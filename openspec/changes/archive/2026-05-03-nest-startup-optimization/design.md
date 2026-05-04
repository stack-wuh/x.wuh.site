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
