# Docker 部署配置

> 原始变更名：`20260504_P_docker-deployment`

## 元数据
- 日期：2026-05-04
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
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

## 任务
### Phase 1 — Docker 配置
- [ ] T1: 编写 Dockerfile（多阶段构建）
- [ ] T2: 添加 .dockerignore
- [ ] T3: 编写 docker-compose.yml
### Phase 2 — CI 集成
- [ ] T4: 更新 CI workflows 支持 Docker build + push
### Phase 3 — 验证
- [ ] T5: 本地构建并测试

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: Docker部署配置
change: docker-deployment
date: 2026-05-04
type: P
status: applied
```

### `design.md`
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

### `proposal.md`
# Docker 部署配置

## 为什么做

需要将项目封装成可移植的 Docker 镜像，为后续部署和 CI/CD 提供标准化输入。

## 做什么

- 编写多阶段 Dockerfile（build → production）
- 基础镜像: node:25.8.0 + pnpm 9.15.0
- 构建命令: pnpm run build:next
- 生产端口: 3000
- 添加 .dockerignore
- 配置环境变量注入
- 健康检查命令
- docker-compose.yml 编排
- 镜像标签: wuh.site.yyyy-mm-dd:$GIT_SHA

## 影响范围

- `Dockerfile` — 新增
- `docker-compose.yml` — 新增
- `.dockerignore` — 新增
- CI/CD workflows — 更新

### `tasks.md`
# 任务拆分

## Phase 1 — Docker 配置

- [ ] T1: 编写 Dockerfile（多阶段构建）
  - 涉及文件: `Dockerfile`
- [ ] T2: 添加 .dockerignore
  - 涉及文件: `.dockerignore`
- [ ] T3: 编写 docker-compose.yml
  - 涉及文件: `docker-compose.yml`

## Phase 2 — CI 集成

- [ ] T4: 更新 CI workflows 支持 Docker build + push
  - 涉及文件: `.github/workflows/`

## Phase 3 — 验证

- [ ] T5: 本地构建并测试
  - `docker build -t wuh.site . && docker run -p 3000:3000 wuh.site`
  - 验证健康检查、环境变量
