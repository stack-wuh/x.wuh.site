# Proposal: nest 服务端项目启动耗时优化

## 动机

本地开发环境 nest 服务端启动缓慢，且可能启动失败需要反复重试。排查发现三个核心问题：

1. **MongoDB 连接无超时配置**：远端 MongoDB (`8.153.72.27:27017`) 不可达时，默认 `serverSelectionTimeoutMS: 30000`（30秒）挂起才超时报错。`sync-init.mjs` 脚本已设置了 `serverSelectionTimeoutMS: 10000`，但主应用 `app.module.ts` 没有同步配置
2. **Sentry 占位 DSN**：`.env` 里的 `SENTRY_DSN` 是 `https://your_sentry_dsn_here` 占位符，Sentry SDK 仍尝试连接无效端点
3. **Swagger 生产环境多余**：生产环境也在遍历所有 controller 生成 OpenAPI 文档

同时，构建编译器从 tsc 切换到 swc，可加速编译 3-5 倍。

## 变更范围

### packages/wuh.site.nest

1. **MongoDB 连接优化** (`app.module.ts`): 添加 `serverSelectionTimeoutMS: 5000`、`connectTimeoutMS: 5000`、`maxPoolSize: 10`、`minPoolSize: 2`
2. **Sentry 按需初始化** (`main.ts`): 占位符 DSN 不启用 Sentry，仅生产环境有效 DSN 才初始化
3. **Swagger 环境判断** (`main.ts`): 非生产环境才生成 Swagger 文档
4. **SWC 编译器** (`nest-cli.json`): 从 tsc 切换到 swc 构建，新增 `@swc/core`、`@swc/cli` 依赖

## 非目标

- 不改变 NestJS 业务逻辑
- 不修改前端代码
- 不涉及 CI/CD 或 Docker 变更
