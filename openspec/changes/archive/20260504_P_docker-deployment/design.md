# 设计：Docker 部署配置

## 方案

### 1. 多阶段构建

```dockerfile
# Stage 1: Build
FROM node:25.8.0 AS builder
RUN npm install -g pnpm@9.15.0
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile
RUN pnpm run build:next

# Stage 2: Production
FROM node:25.8.0-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
EXPOSE 3000
HEALTHCHECK --interval=30s CMD curl -f http://localhost:3000 || exit 1
CMD ["pnpm", "run", "start:next"]
```

### 2. Docker Compose

```yaml
services:
  next:
    build: .
    ports: ['3000:3000']
    env_file: ./packages/wuh.site.next/.env
```

### 3. CI 集成

- GitHub Actions 中 docker build + push
- 镜像仓库: Docker Hub / GHCR
- 标签: wuh.site.YYYY-MM-DD:$GIT_SHA + latest

## 依赖

- Docker Engine
