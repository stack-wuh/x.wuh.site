# API Standardization

## ADDED: repos 接口

### Requirement: GET /v2/repos
- **GIVEN** 已认证的 GitHub API 访问权限
- **WHEN** 请求 `GET /v2/repos`
- **THEN** 返回 GitHub 仓库列表 (name, description, stars, language, url)
- **AND** 结果按 stars 降序排列
- **AND** 包含缓存层减少 GitHub API 调用

## MODIFIED: OpenAPI 文档

### Requirement: Swagger 文档自动生成
- **GIVEN** NestJS SwaggerModule 已配置
- **WHEN** 访问 `/api-docs`
- **THEN** 展示所有 API 端点的交互式文档
- **AND** DTO schema 自动从 class-validator 装饰器推断

## MODIFIED: 错误处理标准化

### Requirement: 统一异常过滤器
- **GIVEN** 任何 NestJS 异常抛出
- **WHEN** 请求处理中发生错误
- **THEN** 返回统一格式 `{ statusCode, message, timestamp, path }`
- **AND** 日志通过 Pino 记录

## MODIFIED: 前端 API 迁移

### Requirement: 前端使用 NestJS API
- **GIVEN** HomeView / BlogListView 等前端组件
- **WHEN** 组件挂载并请求数据
- **THEN** 通过 NestJS API (port 3200) 而非 GitHub GraphQL API 获取数据
- **AND** 请求通过 `fetch` + ISR `revalidate` 策略
