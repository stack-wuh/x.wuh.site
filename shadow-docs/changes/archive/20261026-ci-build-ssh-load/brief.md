---
{
  "schema": "shadow-dev/v1",
  "name": "20261026-ci-build-ssh-load",
  "type": "feature",
  "scope": "build",
  "status": "archived",
  "baseBranch": "main",
  "branch": "feature/20261026-ci-build-ssh-load",
  "files": [
    ".github/workflows/ci-cd.yml",
    "scripts/deploy-docker.sh",
    "docker-compose.yml",
    "Dockerfile"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "255b2321325493692336f3cb778500e89ea08916",
    "verifiedAt": "2026-10-26T18:20:00+08:00"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "release:v1.4.88",
    "planHash": null,
    "updatedAt": "2026-10-26T18:20:00+08:00",
    "lastError": null,
    "release": {
      "files": [
        ".github/workflows/ci-cd.yml",
        "scripts/deploy-docker.sh",
        "docker-compose.yml",
        "Dockerfile"
      ],
      "message": "ci(build): release 构建迁移 runner + SSH 传输镜像上车",
      "title": "ci(build): release 构建迁移 runner + SSH 传输镜像上车",
      "body": "## 变更内容\n\n部署链架构迁移：release 构建从服务器移至 GitHub runner，镜像经 SSH 通道 docker load 上车（不走 registry）。PR #552，release v1.4.88 实跑全绿。\n\n## 验证\n\n- next 镜像 runner 构建 193s，transfer（scp 两镜像）128s，远低于 10min 回落阈值\n- 公网验证：首页 200 + 新 chunk 200 + api/health 200（MongoDB connected）+ rss.xml 200\n- 附带发现：server-diagnose.yml 探测域名误写 x.wuh.site（NXDOMAIN），待后续修正"
    }
  },
  "knowledge": {
    "action": "待评估",
    "target": "knowledge/build-config.md",
    "reason": "部署链架构级变更：构建从服务器移至 runner，镜像经 SSH 传输 docker load 上车"
  }
}
---

# CI 构建迁移 runner + SSH 传输镜像（docker save/load）

## 现象与影响

服务器内存小、性能低，每次 release 的 `prepare-deps → build-next → build-nest` 全部经 SSH 在服务器上执行 `pnpm install` + Next build + Nest build，单次发布耗时长；且构建期间高内存/磁盘压力曾两次拖垮同机 mongod（2026-09-03 / 2026-10-01，见 knowledge/build-config.md 磁盘防线段）。曾尝试 registry 方案（GHCR/Docker Hub），但国内服务器拉取镜像经常失败，最终退回服务器构建——形成「拉不动镜像 → 在服务器构建 → 构建慢且危险」的死循环。

## 复杂度评级
- **评级:** M
- **理由:** 部署链架构级改动（CI workflow 重写 + compose image 策略 + deploy 脚本新增命令），有既有 staging-test/switch-traffic/rollback 流程需要保持兼容；不动应用代码
- **期望验证深度:** code-read + 实际 release 全链路演练（至少一个 v1.4.x release 验证）

## 方案

核心思路：**构建搬回 GitHub Actions runner，镜像不走 registry，直接走既有 SSH 通道**（该通道已被数月部署历史验证稳定）。

```
GitHub runner（ubuntu-latest, 4C16G）:
  checkout → docker build (target=runner-next / runner-nest)
  → docker save | gzip → scp 传到服务器 /tmp/

服务器:
  gunzip | docker load → docker tag
  → staging-test（不变）→ switch-traffic（不变）
```

### 决策记录
- **不走 GHCR/ACR**：服务器拉镜像不稳定是既有事实（用户实测）；阿里 ACR 引入新外部依赖暂不考虑，SSH 通道零新依赖。
- **compose 策略**：镜像 tag 固定 `xwuhsite-next:xwuhsite` / `xwuhsite-nest:xwuhsite`（latest 语义词根），`docker load` 的新镜像直接顶替同 tag；compose 的 `build:` 段保留（本地应急构建能力不删），由 CI 注入 `image:` 优先。服务器上 compose 引用本地 tag，永不触发远端 pull。
- **传输体积**：runner 上构建后镜像 gzip 预计 150~350MB；SSH 超时放宽到 45m 兜底，实测后可回调。
- **服务器磁盘**：`docker load` 后旧镜像成 dangling，`prune_old_images` 在 switch-traffic 已有调用，保留即可；build cache 不再在服务器产生，disk-guard 降级为兜底保留。

## 任务
### Phase 1 — 脚本与 compose
- [x] `scripts/deploy-docker.sh`：新增 `load-images` 命令（从 /tmp/deploy-images/ 下的 tar 包 `docker load`，校验 next/nest 固定 tag 就绪后清理传输产物）；`usage`/`cancel` 同步
- [x] `docker-compose.yml`：`next`/`nest` 服务补 `image: xwuhsite-next:xwuhsite` / `xwuhsite-nest:xwuhsite`（compose up 优先用本地镜像，不再隐式触发远端 pull）
- [x] 保留服务器本地 `build-deps/build-next/build-nest` 命令作为应急回退路径
- [x] `Dockerfile`：`BASE_IMAGE`/`NPM_REGISTRY` 参数化（默认国内源不变，runner 构建传官方源）

### Phase 2 — CI workflow
- [x] `.github/workflows/ci-cd.yml`：release 链改为
  - `prepare`（服务器代码同步，保留）→ `build-images`（runner 上 matrix 并行构建 next/nest，`docker save | gzip` 产出 tar 包并以 artifact 中转）
  - `transfer-images`（download-artifact 拍平 + scp 到服务器 `/tmp/deploy-images/`）
  - `load-and-stage`（`deploy-docker.sh load-images` + 既有 `staging-test`）
  - `staging-test`/`switch-traffic`/`restart-nginx` 语义保持不变（前两者合并进 `load-and-stage` 与独立 job）
- [x] concurrency group `ci-deploy-<ref>` 保持不变
- [x] 服务器构建 job（prepare-deps/build-next/build-nest）移除；`deploy-docker.sh` 的对应命令保留为服务器应急手动路径

### Phase 3 — 验证
- [x] runner 侧 build 成功：v1.4.88 实跑，next 镜像构建 193s、nest 并行、transfer-images（含 artifact 下载+scp）128s
- [x] 完整 release（v1.4.88）部署链 8 job 全绿（run 40304622186），耗时对比：旧链服务器构建整体十几分钟级 → 新链 runner 构建+传输约 5.5 分钟
- [x] 公网验证（本机直访 wuh.site）：首页 HTTP 200（145KB，含新 _next chunk）、新 chunk 资源 200、api/health 200（MongoDB connected）、rss.xml 200——部署生效
- [x] server-diagnose 公网探测 job 失败原因查明：其探测域名写的是 x.wuh.site（仓库名，NXDOMAIN），站点真身是 wuh.site——诊断工作流的域名需后续修正（与本变更无关的既有缺陷）
- [x] SSH 传输耗时 128s << 10min 回落阈值，方案 A 成立，无需国内 registry

## 结果
- 实际耗时: 构建链全绿（run 40304622186）；runner 构建 next 193s / nest 并行，transfer 128s，端到端约 11 分钟（含排队与健康检查等待），显著快于旧服务器构建链
- 验证: 公网首页 200 + 新 _next chunk 200 + api/health 200（MongoDB connected）+ rss.xml 200；staging 健康检查与 switch-traffic 按 CI 步骤绿

## 知识评估
- **预期影响:** 需变更（已在本地更新 knowledge/build-config.md 前置事实，随归档流程合入）
- **候选卡片:** knowledge/build-config.md
- **理由:** 部署链核心事实变化——「release 触发的构建发生在 runner，镜像经 SSH scp + docker load 上车，服务器不再执行构建」；v1.4.88 实测 next 构建 193s、scp 128s。另发现 server-diagnose.yml 探测域名误写 x.wuh.site（真身 wuh.site），独立小修不属本变更
