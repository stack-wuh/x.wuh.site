# Tasks: Docker Compose 全栈编排

## Phase 1: 核心构建文件

- [x] 重写 `Dockerfile` — 6 阶段多服务构建 (base/deps/builder-next/builder-nest/runner-next/runner-nest)
  - 涉及文件: `Dockerfile`
- [x] 新建 `docker-compose.yml` — nginx + next + nest 三 service 编排
  - 涉及文件: `docker-compose.yml`
- [x] 新建 `nginx.conf` — 全量反向代理到 next:3000
  - 涉及文件: `nginx.conf`

## Phase 2: 部署脚本与 CI/CD

- [x] 改造 `scripts/deploy-docker.sh` — docker 命令 → docker compose 命令
  - 涉及文件: `scripts/deploy-docker.sh`
- [x] 更新 `.github/workflows/ci-cd.yml` — SSH 脚本适配
  - 涉及文件: `.github/workflows/ci-cd.yml`

## Phase 3: 后端健康检查

- [x] 新增 `health.controller.ts` — GET /v2/health
  - 涉及文件: `packages/wuh.site.nest/src/modules/api-v2/health.controller.ts`, `api-v2.module.ts`

## Phase 4: 构建排除

- [x] 更新 `.dockerignore` — 补充 Docker/CI/OpenSpec 文件排除
  - 涉及文件: `.dockerignore`
