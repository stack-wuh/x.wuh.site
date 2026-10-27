---
{
  "schema": "shadow-dev/v1",
  "name": "20261027-ci-oss-transfer",
  "type": "feature",
  "scope": "build",
  "status": "draft",
  "baseBranch": "main",
  "branch": "feature/20261027-ci-oss-transfer",
  "files": [
    ".github/workflows/ci-cd.yml",
    "scripts/deploy-docker.sh"
  ],
  "github": { "repository": null, "issue": null, "issueUrl": null, "pullRequest": null, "pullRequestUrl": null },
  "review": { "conclusion": null, "verifiedCommit": null, "verifiedAt": null },
  "workflow": { "operation": null, "checkpoint": null, "planHash": null, "updatedAt": null, "lastError": null, "release": null },
  "knowledge": {
    "action": "待评估",
    "target": "knowledge/build-config.md",
    "reason": "镜像传输通道从 SSH scp 换 OSS 中转（runner 上传公网 / 服务器内网下载）"
  }
}
---

# 镜像传输换阿里云 OSS 中转（runner → OSS ← 服务器内网）

## 现象与影响

v1.4.95 实测：runner→服务器的 scp 传输 547MB 耗时 14m12s（有效带宽 0.64MB/s），对比 v1.4.94 同链路 94s（5.8MB/s）——GitHub 国际出口到国内阿里云的公网链路带宽时段性波动大（8 倍差距），SSH 传输通道的「稳定」前提不成立。scp 慢会直接吃掉按需构建省下的时间。

## 复杂度评级
- **评级:** M
- **理由:** 传输通道替换（workflow 两个 job 重写 + 服务器侧 ossutil 依赖），逻辑不变；需用户准备 OSS Bucket + RAM AK 并填 secrets
- **期望验证深度:** code-read + 实际 release 演练（对比 scp 波动基线）

## 方案

```
runner（海外）: ossutil cp 上传 tar.gz 到 OSS（公网 endpoint，上传走阿里云海外入口，
                通常比 SSH 到国内稳）
服务器（国内）: ossutil cp 从 OSS 内网 endpoint 下载（同 region 内网带宽跑满、
                免公网流量费、不受国际链路影响）→ 后续 load-images 不变
```

### 决策记录
- **为何不用 OSS presigned URL + curl**：ossutil 一条命令且自动处理分片重试；presigned 需要签名生成步骤，复杂度更高。
- **凭证**：RAM 子账号 AK（只需该 bucket 的 Object 读写权限），放 GitHub Secrets（runner 用）+ 服务器 `.ossutilconfig`（load 用）。
- **前缀清理**：每次 release 用固定前缀 `xwuhsite/<version>/`，load 成功后服务器侧删除该前缀对象，避免堆积。
- **占位符**：region/bucket 未定，workflow 全部走 secrets/env 占位（`OSS_REGION`、`OSS_BUCKET`、`OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`），填值后即生效。

### 服务器侧一次性准备（用户操作）
1. 阿里云 OSS 建 Bucket（建议与服务器同 region，如杭州/上海）
2. RAM 建子账号，授权该 Bucket 的 GetObject/PutObject/DeleteObject/ListObjects
3. GitHub Secrets 添加：`OSS_REGION`、`OSS_BUCKET`、`OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`
4. 服务器安装 ossutil：`curl https://gosspublic.alicdn.com/ossutil/1.7.18/ossutil64 -o /usr/local/bin/ossutil && chmod +x $_`
5. 服务器配置 `~/.ossutilconfig`（endpoint 用内网：`oss-<region>-internal.aliyuncs.com`）

## 任务
### Phase 1 — workflow
- [x] transfer-images 改名 upload-images：ossutil v1.7.18 二进制 + `-i/-k/-e` 内联凭证上传（弃 docker 镜像：ACR 匿名 pull 被拒）
- [x] load-and-stage 前置 `pull-images <tag>`（ossutil 内网下载 + 下载后清理 OSS 前缀）

### Phase 2 — 脚本
- [x] deploy-docker.sh 新增 pull-images（ossutil 内网下载 + 校验文件存在 + OSS 前缀清理）；load-images 不变

### Phase 3 — 验证
- [x] secrets 填好后触发 release，观察上传/下载耗时（对比 scp 波动基线 94s~14m12s）——v1.4.97 实测见「结果」
- [x] OSS 对象清理确认（release 后前缀下无残留）

## 结果
- 实际耗时: 上传 32s（546MB，~17MB/s）；内网下载 93s（~6MB/s）；scp 基线 94s~14m12s
- 验证: v1.4.97 release 全链路通过（上传→内网下载→load→staging→切流→nginx），生产已切流；OSS 前缀下载后自动清理（2 objects，0.2s）

### 验证中发现并修复
- ACR 匿名 docker pull 被拒（实测 401）→ 上传改 v1.7.18 静态二进制
- v1 批量 cp 网络错误仍 exit 0（FinishWithError 但退出码 0）→ 上传/下载补 Error num 检查
- pipefail 下 PIPESTATUS 诊断是死代码 → `if ! ... | tee` 写法
- runner git 2.55→2.56 收紧 ref DWIM，`git tag --merged main` 报 malformed object name（v1.4.96 失败根因）→ 改用当前 tag 做 committish（PR #562）
- 零镜像产物 release 在 upload 阶段崩溃 → `has_images` 输出级联跳过部署链（PR #562）
- 服务器 .env 缺 OSS_BUCKET（手工配置未生效）→ 临时 workflow 从 secret 自动补写

## 知识评估
- **预期影响:** 需变更（build-config 部署链架构段：传输通道 scp → OSS 中转）
- **候选卡片:** knowledge/build-config.md
- **理由:** 传输通道是部署链核心事实；scp 国际链路波动 8 倍是重要实测数据
