---
keywords: [构建配置, Docker, NestJS, MongoDB, dotenv, 部署, Console, nginx, 健康检查]
---

# 构建与部署配置

NestJS 通过 dotenv 自动加载项目根目录 `.env` 文件。MongooseModule 使用 `forRootAsync` + `useFactory` 从 ConfigService 获取 URI。`/health` 端点返回 MongoDB 连接状态（200 正常 / 503 异常）。sync 仅同步 `state: 'open'` 的 issues。

生产环境 Next.js Server Component 请求 Nest API 的默认 base 为 `http://nest:3200/v2`（Docker 内部服务名）。

Docker 多阶段构建：deps、builder、runner。Console 使用 `nginx:alpine` 运行 Vite 构建产物，支持 SPA 路由 fallback（`try_files $uri $uri/ /index.html`）。端口规划：生产 next:3000、nest:3200、console:3300；staging 对应 3001、3201、3301。部署脚本提供 build、staging health、switch、diagnose、cancel 和 rollback 能力。
