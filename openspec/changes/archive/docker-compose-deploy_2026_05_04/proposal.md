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
