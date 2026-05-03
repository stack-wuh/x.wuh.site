# Spec: build-config

## ADDED

### Requirement: MongoDB 连接超时配置

Mongoose 连接必须配置合理的超时和连接池参数。

GIVEN 环境变量 `MONGO_URI` 指向远端 MongoDB
WHEN NestJS 应用启动并初始化 MongooseModule
THEN `serverSelectionTimeoutMS` 不超过 5000ms
AND `connectTimeoutMS` 不超过 5000ms
AND `maxPoolSize` 为 10
AND `minPoolSize` 为 2

### Requirement: Sentry 按需初始化

Sentry 仅在配置了有效 DSN 时才初始化。

GIVEN `.env` 中 `SENTRY_DSN` 为占位符或为空
WHEN NestJS 应用启动
THEN Sentry SDK 不应初始化

### Requirement: Swagger 仅开发环境生成

GIVEN 应用运行在生产环境 (`NODE_ENV=production`)
WHEN NestJS 应用启动
THEN SwaggerModule 不生成文档
AND `/v2/docs` 路由不可用

### Requirement: SWC 编译器

GIVEN 项目使用 NestJS CLI 构建
WHEN 执行 `nest build` 或 `nest start --watch`
THEN 使用 swc builder 编译 TypeScript
AND 类型检查可独立控制 (`typeCheck` 选项)
