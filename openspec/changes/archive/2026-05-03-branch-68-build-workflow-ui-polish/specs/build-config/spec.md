# Build Config

## MODIFIED: nest 启动命令

### Requirement: dotenv 环境变量加载
- **GIVEN** nest 项目需要 `.env` 中的 MongoDB URI 等配置
- **WHEN** 执行 `pnpm dev:nest` / `pnpm start:nest` / `pnpm sync:init`
- **THEN** dotenv 自动加载项目根目录 `.env` 文件
- **AND** 环境变量可通过 `process.env.*` 访问

### Requirement: sync:init 使用完整 NestJS 启动
- **GIVEN** 需要从 GitHub Issues 全量同步数据
- **WHEN** 执行 `pnpm sync:init`
- **THEN** 走完整 NestJS bootstrap → AppModule → ConfigService → MongooseModule
- **AND** 不再绕过 NestJS 独立连接 MongoDB

### Requirement: MongooseModule 异步工厂
- **GIVEN** MongoDB 连接需要从 ConfigService 读取配置
- **WHEN** AppModule 初始化
- **THEN** MongooseModule 使用 `forRootAsync` + `useFactory` 从 ConfigService 获取 URI
- **AND** 连接时序与 IoC 容器其他依赖一致

### Requirement: health 检查 MongoDB 状态
- **GIVEN** `/health` 端点
- **WHEN** 请求到达
- **THEN** 返回 MongoDB 连接状态 (connected/disconnected)
- **AND** HTTP 200 正常 / 503 连接异常

### Requirement: sync 仅同步 open issues
- **GIVEN** GitHub Issues 作为 CMS 数据源
- **WHEN** 执行增量/全量同步
- **THEN** 仅拉取 `state: 'open'` 的 issues
- **AND** 已关闭的 issues 不同步
