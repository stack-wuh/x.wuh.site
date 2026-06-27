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
