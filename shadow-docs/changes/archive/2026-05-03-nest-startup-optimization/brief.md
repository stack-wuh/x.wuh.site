# Proposal: nest 服务端项目启动耗时优化

> 原始变更名：`2026-05-03-nest-startup-optimization`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
本地开发环境 nest 服务端启动缓慢，且可能启动失败需要反复重试。排查发现三个核心问题：

1. **MongoDB 连接无超时配置**：远端 MongoDB (`8.153.72.27:27017`) 不可达时，默认 `serverSelectionTimeoutMS: 30000`（30秒）挂起才超时报错。`sync-init.mjs` 脚本已设置了 `serverSelectionTimeoutMS: 10000`，但主应用 `app.module.ts` 没有同步配置
2. **Sentry 占位 DSN**：`.env` 里的 `SENTRY_DSN` 是 `https://your_sentry_dsn_here` 占位符，Sentry SDK 仍尝试连接无效端点
3. **Swagger 生产环境多余**：生产环境也在遍历所有 controller 生成 OpenAPI 文档

同时，构建编译器从 tsc 切换到 swc，可加速编译 3-5 倍。

## 引用规范
- `specs/build-config/spec.md`

## 决策
在 `app.module.ts` 的 `useFactory` 返回对象中添加：

```typescript
serverSelectionTimeoutMS: 5000,  // Mongoose 选服超时 5s
connectTimeoutMS: 5000,          // MongoDB 驱动连接超时 5s
maxPoolSize: 10,                 // 最大连接池
minPoolSize: 2,                  // 最小连接池（保持热连接）
```

**影响**：无，仅加速超时和优化资源使用

- `MongooseModule.forRootAsync` 的 `useFactory` 只传了 `uri`，无任何连接选项
- 默认 `serverSelectionTimeoutMS: 30000`（30s），远端 MongoDB 不可达时挂死
- 默认 `maxPoolSize: 100`，个人博客严重过度分配
- `sync-init.mjs` 已设 `serverSelectionTimeoutMS: 10000`，主应用未同步

## 任务
### Phase 1: MongoDB 连接优化
- [x] `app.module.ts` 添加连接超时和连接池配置 — 预计耗时 0.25h，实际 0.3h
### Phase 2: Sentry + Swagger 优化
- [x] `main.ts` Sentry 按需初始化 + Swagger 环境判断 — 预计耗时 0.25h，实际 0.3h
### Phase 3: SWC 编译器切换
- [x] `nest-cli.json` 配置 swc builder，`package.json` 新增 swc 依赖 — 预计耗时 0.25h，实际 0.3h

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
schema: spec-driven
created: 2026-05-03
```

### `design.md`
# Design: nest 服务端启动耗时优化

## 1. MongoDB 连接超时与连接池

### 问题
- `MongooseModule.forRootAsync` 的 `useFactory` 只传了 `uri`，无任何连接选项
- 默认 `serverSelectionTimeoutMS: 30000`（30s），远端 MongoDB 不可达时挂死
- 默认 `maxPoolSize: 100`，个人博客严重过度分配
- `sync-init.mjs` 已设 `serverSelectionTimeoutMS: 10000`，主应用未同步

### 方案
在 `app.module.ts` 的 `useFactory` 返回对象中添加：

```typescript
serverSelectionTimeoutMS: 5000,  // Mongoose 选服超时 5s
connectTimeoutMS: 5000,          // MongoDB 驱动连接超时 5s
maxPoolSize: 10,                 // 最大连接池
minPoolSize: 2,                  // 最小连接池（保持热连接）
```

**影响**：无，仅加速超时和优化资源使用

## 2. Sentry 按需初始化

### 问题
- `.env` 中 `SENTRY_DSN` 为占位符 `https://your_sentry_dsn_here`
- `Sentry.init()` 在 `NestFactory.create()` 之前同步执行，尝试连接无效端点

### 方案
将 `Sentry.init()` 移到 `NestFactory.create()` 之后，从 ConfigService 读取 DSN，加占位符过滤：

```typescript
const sentryDsn = configService.get<string>('SENTRY_DSN');
if (sentryDsn && !sentryDsn.includes('your_sentry_dsn_here')) {
  Sentry.init({ dsn: sentryDsn });
}
```

**影响**：开发环境不再尝试连接 Sentry

## 3. Swagger 环境判断

### 问题
生产环境也在遍历所有 controller 生成 OpenAPI 文档，纯浪费

### 方案
用 `process.env.NODE_ENV` 判断：

```typescript
if (process.env.NODE_ENV !== 'production') {
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('v2/docs', app, document);
}
```

**影响**：生产环境跳过 Swagger 文档生成，略微加速启动

## 4. SWC 编译器

### 问题
`nest-cli.json` 未指定编译器，默认 tsc，编译慢

### 方案
```json
"compilerOptions": {
  "builder": "swc",
  "typeCheck": true
}
```

新增依赖：`@swc/core`、`@swc/cli`

**影响**：dev/watch 模式编译速度提升 3-5 倍

### `proposal.md`
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

### `specs/build-config/spec.md`
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

### `tasks.md`
# Tasks: nest 服务端启动耗时优化

## Phase 1: MongoDB 连接优化

- [x] `app.module.ts` 添加连接超时和连接池配置 — 预计耗时 0.25h，实际 0.3h
  - 涉及文件: `packages/wuh.site.nest/src/app.module.ts`

## Phase 2: Sentry + Swagger 优化

- [x] `main.ts` Sentry 按需初始化 + Swagger 环境判断 — 预计耗时 0.25h，实际 0.3h
  - 涉及文件: `packages/wuh.site.nest/src/main.ts`

## Phase 3: SWC 编译器切换

- [x] `nest-cli.json` 配置 swc builder，`package.json` 新增 swc 依赖 — 预计耗时 0.25h，实际 0.3h
  - 涉及文件: `packages/wuh.site.nest/nest-cli.json`, `packages/wuh.site.nest/package.json`
