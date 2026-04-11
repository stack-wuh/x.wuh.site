Docker Deployment Configuration

- **目标**：将 `x.wuh.site` 项目封装成可移植的 Docker 镜像，并为后续部署/CI 提供明确输入。

- **基础信息**
  - 项目根目录：`/Users/wuhong/shadow-desktop/github/x.wuh.site`
  - 当前默认端口（如适用）：3000
  - Node/npm 版本：node:25.8.0; npm:11.11.0; pnpm:9.15.0
  - 入口脚本或启动命令：
    - 启动项目：`pnpm run start:next`
    - 构建项目：`pnpm run build:next`

- **必填配置**
  1. **构建阶段**
     - Docker base 镜像：`node:25.8.0`（可选替换）
     - 需要复制的文件/目录：`package*.json`、`tsconfig.json`（如使用）、源码目录
     - 构建命令（如 `npm run build` 或 `yarn build`）：pnpm ru build:next
     - 构建产物目录（用于后续阶段）：'/packages/wuh.site..next/wuh.site'

  2. **生产阶段**
     - 运行镜像依赖目录（从构建阶段复制）：./
     - 运行命令（例如 `node dist/server.js`、`npm run start`、`next start`）：pnpm run start:next
     - 监听端口（容器内/外映射）：容器内 `3000`、主机映射 `3000`

  3. **环境变量**
     - .env 文件路径：./packages/wuh.site/next/.env
     - 关键变量列表（名称 + 说明）：
       ```
       VAR_NAME    描述
       __________  ___________________________
       ```
     - 有无 secrets 需通过 Docker secrets/外部方式传入：_________

  4. **持久化/卷**
     - 需要挂载卷的目录（日志、上传目录等）：_________
     - 推荐读写权限/宿主路径：_________

  5. **网络**
     - 是否需要访问数据库或外部服务（SaaS、Redis 等）：否
     - 是否使用自定义 Docker 网络？否

- **可选配置**
  - 构建缓存优化（如 `npm ci`、`yarn install --frozen-lockfile`）: 开启缓存优化
  - 多阶段构建缩小镜像的策略: 开启该策略
  - 镜像标签规范（`my-app:$GIT_SHA`、`latest` 等）: wuh.site.yyyy-mm-dd:$GIT_SHA
  - 是否需要健康检查命令: 需要
  - 是否计划使用 Docker Compose / Kubernetes / 其他编排: 可以使用docker-compose

- **部署流程概览（供后续执行）**
  1. 编写 `Dockerfile`。
  2. 添加 `.dockerignore`。
  3. 本地构建并测试：`docker build -t <name> .` + `docker run -p ...`。
  4. 记录 `.env` 与卷映射。
  5. 可选：编写 `docker-compose.yml`（多 service）或连接 CI。
  6. 打包镜像并推送（Docker Hub/GCR/Harbor 等）。
  7. 目标部署环境拉取并运行镜像。

填写完上述空白部分后回复我，我再根据最终配置帮你生成 Dockerfile、Compose、运行命令等。
