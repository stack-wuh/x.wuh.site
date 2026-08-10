# Proposal: 打包部署优化 — Docker Compose 全栈编排

> 原始变更名：`docker-compose-deploy_2026_05_04`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
当前部署只有 Next.js 前端进了 Docker，NestJS 后端裸跑在服务器上。需要把前后端 + Nginx 全部编排进 docker-compose，统一管理。

## 引用规范
- `specs/build-config/spec.md`

## 决策
# Design: Docker Compose 全栈编排

## 1. Dockerfile 多阶段多服务构建

单 Dockerfile，6 个阶段：

```
base -> deps -> builder-next -> runner-next (target)
            -> builder-nest -> runner-nest  (target)
```

### base
- `node:20-alpine`，`pnpm@9.15.0` via corepack
- `curl`（HEALTHCHECK 需要）
- `WORKDIR /app`

### deps
- 复制 workspace 配置 (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`)
- 复制所有 `packages/` 源码
- `pnpm install --no-frozen-lockfile`（lockfile 可能因平台差异漂移）

### builder-next / builder-nest
- 从 deps 继承，分别执行 `pnpm run build:next` / `pnpm run build:nest`
- 两个构建并行隔离，互不影响

### runner-next
- 从 deps 复制 `node_modules` + `packages/`，从 builder-next 覆盖 `dist/`
- `EXPOSE 3000`，`HEALTHCHECK curl /_next/healthz`
- `CMD ["pnpm", "run", "start:next"]`

### runner-nest
- 从 deps 复制 `node_modules` + `packages/`，从 builder-nest 覆盖 `dist/`
- `EXPOSE 3200`，`HEALTHCHECK curl /v2/health`
- `CMD ["node", "packages/wuh.site.nest/dist/main"]`（不走 dotenv，env 由 docker-compose 注入）

## 2. docker-compose.yml

```yaml
services:
  nginx:   nginx:alpine, ports 80/443, 挂载 nginx.conf, depends_on next
  next:    build target runner-next, env_file .env, NEST_API_URL=http://nest:3200/v2
  nest:    build target runner-nest, env_file .env
```

全部 `restart: unless-stopped`。NestJS 通过 `@nestjs/config` 直接从 `process.env` 读取配置，无需 dotenv。

## 3. nginx.conf

简化方案：全部请求 proxy_pass 到 `next:3000`。Next.js 内部已有 rewrites 配置：`/api/:path*` → `${NEST_API_URL}/:path*`，在容器内解析为 `http://nest:3200/v2/:path*`。

不判断 `/api/` 路由属于前端还是后端，避免 nginx 层维护路由规则。

## 4. deploy-docker.sh 改造

原脚本用 `docker buildx build` + `docker run`。新脚本全部改为 `docker compose` 子命令：

| 命令 | 旧 | 新 |
|------|----|----|
| build | `docker buildx build -t XX .` | `docker compose build` |
| run | `docker run -d --rm --name XX` | `docker compose up -d` |
| stop | `docker stop XX` | `docker compose down` |
| push | `docker push XX` | `docker compose push` |
| logs | (无) | `docker compose logs -f` |
| shell | `docker run --rm -it XX /bin/sh` | `docker compose exec XX /bin/sh` |

## 5. CI-CD workflow

SSH 脚本保持不变，但底层 `deploy-docker.sh` 已改为 docker compose：

```bash
git fetch origin main && git checkout main && git reset --hard origin/main
./scripts/deploy-docker.sh stop || true
./scripts/deploy-docker.sh build
./scripts/deploy-docker.sh run
```

## 6. 健康检查端点

新增 `packages/wuh.site.nest/src/modules/api-v2/health.controller.ts`：

```
GET /v2/health -> { status: "ok", timestamp, uptime }
```

注册到 `ApiV2Module`。不依赖任何 service，纯控制器返回，确保健康检查始终可用。

## 7. .dockerignore 补充

新增排除：`Dockerfile`, `docker-compose.yml`, `nginx.conf`, `.dockerignore`, `.gitignore`, `.github`, `openspec`

已确认 `dist/`, `**/dist`, `.next`, `**/.next`, `.env` 覆盖率正确。

## 任务
### Phase 1: 核心构建文件
- [x] 重写 `Dockerfile` — 6 阶段多服务构建 (base/deps/builder-next/builder-nest/runner-next/runner-nest)
- [x] 新建 `docker-compose.yml` — nginx + next + nest 三 service 编排
- [x] 新建 `nginx.conf` — 全量反向代理到 next:3000
### Phase 2: 部署脚本与 CI/CD
- [x] 改造 `scripts/deploy-docker.sh` — docker 命令 → docker compose 命令
- [x] 更新 `.github/workflows/ci-cd.yml` — SSH 脚本适配
### Phase 3: 后端健康检查
- [x] 新增 `health.controller.ts` — GET /v2/health
### Phase 4: 构建排除
- [x] 更新 `.dockerignore` — 补充 Docker/CI/OpenSpec 文件排除

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
schema: spec-driven
created: 2026-05-04
```

### `design.md`
# Design: Docker Compose 全栈编排

## 1. Dockerfile 多阶段多服务构建

单 Dockerfile，6 个阶段：

```
base -> deps -> builder-next -> runner-next (target)
            -> builder-nest -> runner-nest  (target)
```

### base
- `node:20-alpine`，`pnpm@9.15.0` via corepack
- `curl`（HEALTHCHECK 需要）
- `WORKDIR /app`

### deps
- 复制 workspace 配置 (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`)
- 复制所有 `packages/` 源码
- `pnpm install --no-frozen-lockfile`（lockfile 可能因平台差异漂移）

### builder-next / builder-nest
- 从 deps 继承，分别执行 `pnpm run build:next` / `pnpm run build:nest`
- 两个构建并行隔离，互不影响

### runner-next
- 从 deps 复制 `node_modules` + `packages/`，从 builder-next 覆盖 `dist/`
- `EXPOSE 3000`，`HEALTHCHECK curl /_next/healthz`
- `CMD ["pnpm", "run", "start:next"]`

### runner-nest
- 从 deps 复制 `node_modules` + `packages/`，从 builder-nest 覆盖 `dist/`
- `EXPOSE 3200`，`HEALTHCHECK curl /v2/health`
- `CMD ["node", "packages/wuh.site.nest/dist/main"]`（不走 dotenv，env 由 docker-compose 注入）

## 2. docker-compose.yml

```yaml
services:
  nginx:   nginx:alpine, ports 80/443, 挂载 nginx.conf, depends_on next
  next:    build target runner-next, env_file .env, NEST_API_URL=http://nest:3200/v2
  nest:    build target runner-nest, env_file .env
```

全部 `restart: unless-stopped`。NestJS 通过 `@nestjs/config` 直接从 `process.env` 读取配置，无需 dotenv。

## 3. nginx.conf

简化方案：全部请求 proxy_pass 到 `next:3000`。Next.js 内部已有 rewrites 配置：`/api/:path*` → `${NEST_API_URL}/:path*`，在容器内解析为 `http://nest:3200/v2/:path*`。

不判断 `/api/` 路由属于前端还是后端，避免 nginx 层维护路由规则。

## 4. deploy-docker.sh 改造

原脚本用 `docker buildx build` + `docker run`。新脚本全部改为 `docker compose` 子命令：

| 命令 | 旧 | 新 |
|------|----|----|
| build | `docker buildx build -t XX .` | `docker compose build` |
| run | `docker run -d --rm --name XX` | `docker compose up -d` |
| stop | `docker stop XX` | `docker compose down` |
| push | `docker push XX` | `docker compose push` |
| logs | (无) | `docker compose logs -f` |
| shell | `docker run --rm -it XX /bin/sh` | `docker compose exec XX /bin/sh` |

## 5. CI-CD workflow

SSH 脚本保持不变，但底层 `deploy-docker.sh` 已改为 docker compose：

```bash
git fetch origin main && git checkout main && git reset --hard origin/main
./scripts/deploy-docker.sh stop || true
./scripts/deploy-docker.sh build
./scripts/deploy-docker.sh run
```

## 6. 健康检查端点

新增 `packages/wuh.site.nest/src/modules/api-v2/health.controller.ts`：

```
GET /v2/health -> { status: "ok", timestamp, uptime }
```

注册到 `ApiV2Module`。不依赖任何 service，纯控制器返回，确保健康检查始终可用。

## 7. .dockerignore 补充

新增排除：`Dockerfile`, `docker-compose.yml`, `nginx.conf`, `.dockerignore`, `.gitignore`, `.github`, `openspec`

已确认 `dist/`, `**/dist`, `.next`, `**/.next`, `.env` 覆盖率正确。

### `proposal.md`
# Proposal: 打包部署优化 — Docker Compose 全栈编排

## 动机

当前部署只有 Next.js 前端进了 Docker，NestJS 后端裸跑在服务器上。需要把前后端 + Nginx 全部编排进 docker-compose，统一管理。

## 变更范围

1. **Dockerfile** — 单文件多阶段构建，同时产出 Next.js 和 NestJS 两个镜像
2. **docker-compose.yml** — 编排 nginx + next + nest 三个 service
3. **nginx.conf** — 反向代理全部请求到 Next.js，内部 rewrites 代理 /api/* 到 NestJS
4. **scripts/deploy-docker.sh** — 从 docker CLI 改为 docker compose 命令
5. **.github/workflows/ci-cd.yml** — CI/CD 脚本适配 docker compose
6. **health.controller.ts** — NestJS 新增 /v2/health 健康检查端点
7. **.dockerignore** — 补充排除 Docker 相关文件和 CI 配置

## 架构

```
nginx (:80) -> next (:3000) -> nest (:3200) -> MongoDB (外部)
```

## 非目标

- 不改变 MongoDB 部署方式（保持外部独立服务）
- 不修改业务逻辑
- 不涉及 HTTPS/SSL 证书配置

### `specs/build-config/spec.md`
# Spec: build-config (Docker Compose 部署)

## Docker 多阶段构建

- Dockerfile MUST 使用 6 阶段构建：base → deps → builder-next / builder-nest → runner-next / runner-nest
- base MUST 基于 node:20-alpine，pnpm 9.15.0，含 curl
- deps MUST 复制 workspace 文件 + packages 目录，执行 `pnpm install --no-frozen-lockfile`
- builder-next MUST 执行 `pnpm run build:next`
- builder-nest MUST 执行 `pnpm run build:nest`
- runner-next MUST EXPOSE 3000，HEALTHCHECK 用 `/_next/healthz`
- runner-nest MUST EXPOSE 3200，HEALTHCHECK 用 `/v2/health`，CMD 用 `node packages/wuh.site.nest/dist/main`

## docker-compose 编排

- MUST 包含 nginx、next、nest 三个 service
- nginx MUST 使用 `nginx:alpine`，挂载 `./nginx.conf`
- next MUST 注入 `NEST_API_URL=http://nest:3200/v2` 环境变量
- 全部 service MUST `restart: unless-stopped`
- 环境变量 MUST 通过 `env_file: .env` 注入

## Nginx 反向代理

- MUST 全部请求 proxy_pass 到 `next:3000`
- MUST 包含 WebSocket upgrade headers

## 部署脚本

- deploy-docker.sh MUST 使用 `docker compose` 命令
- build → `docker compose build`
- run → `docker compose up -d`
- stop → `docker compose down`
- logs → `docker compose logs -f`

## 健康检查

- NestJS MUST 提供 `GET /v2/health` 端点
- 响应 MUST 包含 status、timestamp、uptime 字段

## 构建排除

- .dockerignore MUST 排除 Dockerfile、docker-compose.yml、nginx.conf、.github、openspec

### `tasks.md`
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
