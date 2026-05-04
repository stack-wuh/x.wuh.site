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
