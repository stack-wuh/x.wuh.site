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

### Requirement: Production server API fallback uses Docker service name
- **GIVEN** Next.js 服务运行在生产环境且未显式配置 `NEST_API_URL`
- **WHEN** Server Component 或 Route Handler 通过共享 service 请求 Nest API
- **THEN** 默认 API base 应为 `http://nest:3200/v2`

### Requirement: Dockerfile 支持 Console 构建
Dockerfile SHALL 提供 deps、builder 和 runner 阶段以构建 Console 静态镜像。

#### Scenario: Console 多阶段构建
- **GIVEN** pnpm workspace 中包含 `packages/wuh.site.console`
- **WHEN** 执行 Docker 构建
- **THEN** deps 阶段复制 Console `package.json` 并安装 workspace 依赖
- **AND** builder-console 阶段执行 `pnpm run build:console`
- **AND** runner-console 阶段使用 `nginx:alpine` 提供静态文件服务

### Requirement: Docker Compose 包含 Console 服务
Docker Compose 配置 SHALL 定义生产与 staging Console 服务。

#### Scenario: 生产与 staging 端口规划
- **GIVEN** Compose 文件包含 next、nest、console 服务
- **WHEN** 启动生产容器
- **THEN** console 绑定 `127.0.0.1:3300`
- **WHEN** 启动 staging 容器
- **THEN** console staging 绑定 `127.0.0.1:3301`、nest staging 绑定 `127.0.0.1:3201`、next staging 绑定 `127.0.0.1:3001`

### Requirement: 部署脚本管理 Console 生命周期
`deploy-docker.sh` SHALL 为 Console 提供 build、staging health、switch、diagnose、cancel 和 rollback 能力。

#### Scenario: deploy-docker.sh Console 命令
- **GIVEN** 部署脚本已扩展 Console 支持
- **WHEN** 执行 `build-console`
- **THEN** 构建 Console 镜像
- **WHEN** 执行 `diagnose`
- **THEN** 包含 Console 容器状态检查
- **WHEN** 执行 `cancel`
- **THEN** 清理 staging Console 容器
