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
