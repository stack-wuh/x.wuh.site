---
{
  "schema": "shadow-dev/v1",
  "name": "20261026-ci-build-ssh-load",
  "type": "feature",
  "scope": "build",
  "status": "draft",
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
    "conclusion": null,
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": null,
    "updatedAt": null,
    "lastError": null,
    "release": null
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
- [ ] 先在 runner 侧验证 build 成功（可临时 workflow_dispatch 触发，不接 switch）
- [ ] 实测一次完整 release（v1.4.x patch 递增），记录耗时对比：构建时间、传输时间、总发布时长
- [ ] 容器内产物指纹复核（build-config.md 产物验证纪律）：`docker exec … node -e` 确认新版本上车
- [ ] 若 SSH 传输耗时不可接受（>10min），回落方案 B（国内 registry），本变更标记 superseded

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 需变更
- **候选卡片:** knowledge/build-config.md
- **理由:** 部署链核心事实变化——「release 触发的构建发生在 runner，服务器仅 load + 起容器」，原「CI 触发策略」「磁盘防线」段落需更新；desktop 等后续文档引用部署耗时结论时以新卡片为准
