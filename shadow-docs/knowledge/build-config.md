---
title: 构建与部署配置
domain: build
keywords: [构建配置, Docker, NestJS, MongoDB, dotenv, 部署, Console, nginx, 健康检查, CI, release, 触发]
scope:
  - Dockerfile
  - docker-compose.yml
  - .github/workflows
  - packages/wuh.site.nest/src/main.ts
status: active
source:
  - changes/archive/20260504_P_docker-deployment/brief.md
  - changes/archive/20260607_P_rolling_deploy/brief.md
  - changes/archive/20260524_P_build_optimization/brief.md
  - changes/archive/20260822-build-release-trigger-deploy/brief.md
verified: 2026-08-22
---

# 构建与部署配置

## 当前结论

NestJS 通过 dotenv 自动加载项目根目录 `.env` 文件。MongooseModule 使用 `forRootAsync` + `useFactory` 从 ConfigService 获取 URI。`/health` 端点返回 MongoDB 连接状态（200 正常 / 503 异常）。sync 仅同步 `state: 'open'` 的 issues。

生产环境 Next.js Server Component 请求 Nest API 的默认 base 为 `http://nest:3200/v2`（Docker 内部服务名）。

Docker 多阶段构建：deps、builder、runner。Console 使用 `nginx:alpine` 运行 Vite 构建产物，支持 SPA 路由 fallback（`try_files $uri $uri/ /index.html`）。端口规划：生产 next:3000、nest:3200、console:3300；staging 对应 3001、3201、3301。部署脚本提供 build、staging health、switch、diagnose、cancel 和 rollback 能力。

CI 触发策略：push 到 main 只运行 quality-gate（typecheck + lint）；GitHub Release 发布（`release: types: [published]`）才触发完整部署链（prepare → build → staging-test → switch-traffic）。concurrency 按事件分组：push main 用 `ci-quality`，release 用 `ci-deploy-<ref>`，互不取消。

## 执行约束

- 构建和部署必须保持 workspace 路径、健康检查、运行端口与环境变量一致；Docker COPY 必须保留 `packages/` 层级。

## 适用边界

不约束本地页面功能实现。

## 验证方式

检查 Dockerfile、compose、CI workflow 和 `/health`；构建命令需在实际部署环境单独验证。

## 关联知识

- [next](./next.md)
- [admin console](./admin-console.md)
