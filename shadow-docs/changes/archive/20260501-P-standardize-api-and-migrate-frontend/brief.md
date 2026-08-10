# Proposal: 前后端联调 - OpenAPI 标准化 + 接口迁移

> 原始变更名：`2026-05-01-standardize-api-and-migrate-frontend`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：archived
- Issue：历史记录未提供

## 动机
当前前端直接调用 GitHub API 获取数据（repos、issues、markdown 渲染），存在以下问题：

- **耦合过紧**：前端与 GitHub API 强绑定，接口格式变化直接影响渲染
- **无契约层**：前后端之间缺乏可追溯的接口文档
- **后端不完整**：后端缺少 repos 接口，异常处理和分页格式不统一

## 引用规范
- `specs/content-api/spec.md`
- `specs/error-handling/spec.md`
- `specs/repos-api/spec.md`

## 决策
# Design: 前后端联调 - OpenAPI 标准化 + 接口迁移

## 架构决策

### 分页响应格式

```ts
PaginatedResult<T> = {
  data: T[]
  pagination: { page, limit, total, totalPages, hasNextPage, hasPreviousPage }
}
```

替代旧的 `{ data, total, page }`，前端不再需要解析 GitHub Link header。

### 异常过滤器

全局 `HttpExceptionFilter` 统一错误响应为 `{ statusCode, message, error, timestamp }`，生产环境隐藏堆栈信息。

### Swagger 挂载点

`/v2/docs` - 复用已有的全局前缀 `app.setGlobalPrefix('v2')`，避免与 Swagger UI 根路径冲突。

### repos 缓存策略

- 内存缓存 TTL 5 分钟
- 过期后返回 stale 数据作为 fallback
- 不使用 Redis（简化部署）

### 前端 API 层

`app/lib/api.ts` 封装所有后端调用，类型安全。通过 `NEST_API_URL` 环境变量切换后端地址，通过 `next.config.ts` rewrite 在生产环境代理 `/api/*`。

## 接口变更

### 新增接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v2/repos` | 获取 GitHub repos（过滤 fork，按 stars 排序） |

### 修改接口
| 方法 | 路径 | 变更 |
|------|------|------|
| GET | `/v2/content/posts` | 响应格式从 `{ data, total, page }` 改为 `{ data, pagination }` |
| GET | `/v2/content/posts/:slugOrNumber` | 不存在时返回 404 而非 null |
| GET | `/v2/content/projects` | 同上分页格式变更 |
| GET | `/v2/comments` | 同上分页格式变更 |
| PATCH | `/v2/admin/content/:id/metadata` | 不存在时返回 404 |

## 关键文件

| 文件 | 角色 |
|------|------|
| `packages/wuh.site.nest/src/common/interfaces/paginated-response.interface.ts` | 分页工具 |
| `packages/wuh.site.nest/src/common/filters/http-exception.filter.ts` | 异常处理 |
| `packages/wuh.site.nest/src/main.ts` | Swagger + 全局过滤器 |
| `packages/wuh.site.nest/src/modules/repos/` | repos 模块 |
| `packages/wuh.site.next/app/lib/api.ts` | 前端 API 层 |
| `packages/wuh.site.next/next.config.ts` | API rewrite |
| `packages/shared-contracts/src/index.ts` | 共享类型 |

## 任务
### Phase 1: 后端标准化
- [x] **Task 1.1** 创建 common 基础设施
- [x] **Task 1.2** 修复 Query DTO
- [x] **Task 1.3** 标准化分页响应
- [x] **Task 1.4** 添加 404 处理
- [x] **Task 1.5** 注册全局异常过滤器
### Phase 2: OpenAPI/Swagger
- [x] **Task 2.1** 安装依赖
- [x] **Task 2.2** 配置 Swagger
- [x] **Task 2.3** Schema 添加 @ApiProperty
- [x] **Task 2.4** DTO 添加 @ApiProperty
- [x] **Task 2.5** Controller 添加 @ApiTags/@ApiOperation/@ApiResponse
### Phase 3: 新增 /v2/repos 接口
- [x] **Task 3.1** 创建 repos 模块
- [x] **Task 3.2** 注册到 app.module.ts
- [x] **Task 3.3** 更新 shared-contracts
### Phase 4: 前端接口迁移
- [x] **Task 4.1** 添加 API rewrite
- [x] **Task 4.2** 创建前端 API 层
- [x] **Task 4.3** 迁移首页
- [x] **Task 4.4** 迁移博客列表
- [x] **Task 4.5** 迁移文章详情
- [x] **Task 4.6** 更新 shared-contracts

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
schema: spec-driven
created: 2026-05-01
status: archived
```

### `design.md`
# Design: 前后端联调 - OpenAPI 标准化 + 接口迁移

## 架构决策

### 分页响应格式

```ts
PaginatedResult<T> = {
  data: T[]
  pagination: { page, limit, total, totalPages, hasNextPage, hasPreviousPage }
}
```

替代旧的 `{ data, total, page }`，前端不再需要解析 GitHub Link header。

### 异常过滤器

全局 `HttpExceptionFilter` 统一错误响应为 `{ statusCode, message, error, timestamp }`，生产环境隐藏堆栈信息。

### Swagger 挂载点

`/v2/docs` - 复用已有的全局前缀 `app.setGlobalPrefix('v2')`，避免与 Swagger UI 根路径冲突。

### repos 缓存策略

- 内存缓存 TTL 5 分钟
- 过期后返回 stale 数据作为 fallback
- 不使用 Redis（简化部署）

### 前端 API 层

`app/lib/api.ts` 封装所有后端调用，类型安全。通过 `NEST_API_URL` 环境变量切换后端地址，通过 `next.config.ts` rewrite 在生产环境代理 `/api/*`。

## 接口变更

### 新增接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v2/repos` | 获取 GitHub repos（过滤 fork，按 stars 排序） |

### 修改接口
| 方法 | 路径 | 变更 |
|------|------|------|
| GET | `/v2/content/posts` | 响应格式从 `{ data, total, page }` 改为 `{ data, pagination }` |
| GET | `/v2/content/posts/:slugOrNumber` | 不存在时返回 404 而非 null |
| GET | `/v2/content/projects` | 同上分页格式变更 |
| GET | `/v2/comments` | 同上分页格式变更 |
| PATCH | `/v2/admin/content/:id/metadata` | 不存在时返回 404 |

## 关键文件

| 文件 | 角色 |
|------|------|
| `packages/wuh.site.nest/src/common/interfaces/paginated-response.interface.ts` | 分页工具 |
| `packages/wuh.site.nest/src/common/filters/http-exception.filter.ts` | 异常处理 |
| `packages/wuh.site.nest/src/main.ts` | Swagger + 全局过滤器 |
| `packages/wuh.site.nest/src/modules/repos/` | repos 模块 |
| `packages/wuh.site.next/app/lib/api.ts` | 前端 API 层 |
| `packages/wuh.site.next/next.config.ts` | API rewrite |
| `packages/shared-contracts/src/index.ts` | 共享类型 |

### `proposal.md`
# Proposal: 前后端联调 - OpenAPI 标准化 + 接口迁移

## 动机

当前前端直接调用 GitHub API 获取数据（repos、issues、markdown 渲染），存在以下问题：

- **耦合过紧**：前端与 GitHub API 强绑定，接口格式变化直接影响渲染
- **无契约层**：前后端之间缺乏可追溯的接口文档
- **后端不完整**：后端缺少 repos 接口，异常处理和分页格式不统一

## 变更范围

### 后端 (packages/wuh.site.nest)
1. 创建 common 基础设施（分页接口、异常过滤器）
2. 修复 DTO 类型转换问题（page/limit @Type, labels @Transform）
3. 标准化分页响应格式 `PaginatedResult<T>`
4. 接入 OpenAPI/Swagger，挂载 `/v2/docs`
5. 新增 `/v2/repos` 接口（Octokit + 5min 内存缓存）

### 前端 (packages/wuh.site.next)
6. 创建类型安全的 API 层 `app/lib/api.ts`
7. 三大页面从 GitHub API 迁移至后端接口
8. `next.config.ts` 添加 `/api/*` → NestJS rewrite

### 共享 (packages/shared-contracts)
9. 新增 `ContentItem`、`RepoDto`、`PaginatedResult<T>`、`PaginationMeta` 类型

## 非目标

- 不涉及 auth/user/admin 模块的接口调整
- 不涉及评论功能的前端集成
- 不涉及 RSS 订阅源的前端展示

### `specs/content-api/spec.md`
# Content API

## ADDED

### Requirement: Paginated response format
所有分页接口返回统一的 `PaginatedResult<T>` 格式。

- **GIVEN** 客户端请求 `/v2/content/posts?page=1&limit=10`
- **WHEN** 服务端查询数据库
- **THEN** 响应包含 `{ data: T[], pagination: { page, limit, total, totalPages, hasNextPage, hasPreviousPage } }`

### Requirement: Post not found returns 404
当请求的文章不存在时，返回 404 状态码。

- **GIVEN** 客户端请求 `/v2/content/posts/nonexist`
- **WHEN** 数据库查询无结果
- **THEN** 返回 `{ statusCode: 404, message: ["Post not found: nonexist"], error: "Not Found", timestamp }`

### Requirement: Query parameter type coercion
`page` 和 `limit` 查询参数自动从字符串转换为数字。

- **GIVEN** 客户端请求 `/v2/content/posts?page=2&limit=5`
- **WHEN** 参数到达 Controller
- **THEN** `page` 为 `number 2`，`limit` 为 `number 5`

### Requirement: Labels parameter supports comma-separated format
`labels` 参数支持逗号分隔字符串和数组两种格式。

- **GIVEN** 客户端请求 `/v2/content/posts?labels=javascript,typescript`
- **WHEN** 参数经 `@Transform` 处理
- **THEN** `labels` 被解析为 `["javascript", "typescript"]`

## MODIFIED

### Requirement: findAll returns PaginatedResult
`content.service.ts` 和 `comment.service.ts` 的 `findAll()` 方法从 `{ data, total, page }` 改为返回 `PaginatedResult<T>`。

## REMOVED

### Requirement: GitHub Link header pagination
前端不再通过解析 GitHub API 的 `Link` response header 做分页，改用后端响应中的 `pagination` 元数据。

### `specs/error-handling/spec.md`
# Error Handling

## ADDED

### Requirement: Global exception filter
所有未捕获异常由 `HttpExceptionFilter` 处理，统一响应格式。

- **GIVEN** 任何请求处理中抛出异常
- **WHEN** 异常未被 Controller 层捕获
- **THEN** 返回 `{ statusCode, message, error, timestamp }`
- **AND** 生产环境不暴露内部错误详情和堆栈信息

### Requirement: Swagger API documentation
OpenAPI/Swagger 文档挂载在 `/v2/docs`。

- **GIVEN** 服务启动
- **WHEN** 浏览器访问 `/v2/docs`
- **THEN** 显示 Swagger UI，包含所有 API 的文档
- **AND** 所有 Schema、DTO、Controller 带有完整类型注解

### `specs/repos-api/spec.md`
# Repos API

## ADDED

### Requirement: Get GitHub repositories
`GET /v2/repos` 返回 GitHub 用户的所有公开仓库，过滤 fork，按 star 排序。

- **GIVEN** 客户端请求 `/v2/repos`
- **WHEN** 服务端调用 GitHub API
- **THEN** 返回 `{ repos: [{ name, description, html_url, stargazers_count, language, homepage, fork }] }`
- **AND** fork 仓库被过滤
- **AND** 结果按 `stargazers_count` 降序排列

### Requirement: 5-minute memory cache
repos 数据在内存中缓存 5 分钟。

- **GIVEN** 首次请求 `/v2/repos`
- **WHEN** 数据从 GitHub API 获取
- **THEN** 结果缓存 5 分钟

### Requirement: Stale cache fallback
GitHub API 调用失败时，返回过期缓存数据。

- **GIVEN** 有缓存数据（即使已过期）
- **WHEN** GitHub API 调用失败
- **THEN** 返回缓存的 repos 数据

### `tasks.md`
# Tasks: 前后端联调 - OpenAPI 标准化 + 接口迁移

## Phase 1: 后端标准化

- [x] **Task 1.1** 创建 common 基础设施
  - 文件: `src/common/interfaces/paginated-response.interface.ts`, `src/common/filters/http-exception.filter.ts`
  - 预计: 0.5h | 实际: 0.3h

- [x] **Task 1.2** 修复 Query DTO
  - 文件: `src/modules/content/dto/content.dto.ts`, `src/modules/comment/dto/comment.dto.ts`
  - `page`/`limit` 添加 `@Type(() => Number)`，`labels` 添加 `@Transform`
  - 预计: 0.5h | 实际: 0.3h

- [x] **Task 1.3** 标准化分页响应
  - 文件: `src/modules/content/content.service.ts`, `src/modules/comment/comment.service.ts`
  - `findAll()` 返回 `PaginatedResult<T>` 替代 `{ data, total, page }`
  - 预计: 0.5h | 实际: 0.3h

- [x] **Task 1.4** 添加 404 处理
  - 文件: `src/modules/content/content.controller.ts`, `src/modules/admin/admin.controller.ts`
  - 结果为空时抛 `NotFoundException`
  - 预计: 0.3h | 实际: 0.2h

- [x] **Task 1.5** 注册全局异常过滤器
  - 文件: `src/main.ts`
  - `app.useGlobalFilters(new HttpExceptionFilter())`
  - 预计: 0.2h | 实际: 0.1h

## Phase 2: OpenAPI/Swagger

- [x] **Task 2.1** 安装依赖
  - `pnpm add @nestjs/swagger --filter @wuh.site/nest`
  - 预计: 0.2h | 实际: 0.1h

- [x] **Task 2.2** 配置 Swagger
  - 文件: `src/main.ts`
  - Swagger UI 挂载 `/v2/docs`
  - 预计: 0.3h | 实际: 0.2h

- [x] **Task 2.3** Schema 添加 @ApiProperty
  - 文件: `content.schema.ts`, `comment.schema.ts`, `user.schema.ts`
  - 预计: 0.5h | 实际: 0.4h

- [x] **Task 2.4** DTO 添加 @ApiProperty
  - 文件: `content.dto.ts`, `comment.dto.ts`
  - 预计: 0.3h | 实际: 0.2h

- [x] **Task 2.5** Controller 添加 @ApiTags/@ApiOperation/@ApiResponse
  - 文件: `content/comment/admin/webhook/rss/api-v2/app.controller.ts`
  - 预计: 0.5h | 实际: 0.4h

## Phase 3: 新增 /v2/repos 接口

- [x] **Task 3.1** 创建 repos 模块
  - 文件: `src/modules/repos/repos.module.ts`, `repos.controller.ts`, `repos.service.ts`, `dto/repos.dto.ts`
  - Octokit 调用 + 5min 内存缓存
  - 预计: 0.5h | 实际: 0.4h

- [x] **Task 3.2** 注册到 app.module.ts
  - 文件: `src/app.module.ts`
  - 预计: 0.1h | 实际: 0.1h

- [x] **Task 3.3** 更新 shared-contracts
  - 文件: `packages/shared-contracts/src/index.ts`
  - 新增 `ContentItem`, `RepoDto`, `PaginatedResult<T>`, `PaginationMeta`
  - 预计: 0.3h | 实际: 0.2h

## Phase 4: 前端接口迁移

- [x] **Task 4.1** 添加 API rewrite
  - 文件: `packages/wuh.site.next/next.config.ts`
  - 预计: 0.2h | 实际: 0.1h

- [x] **Task 4.2** 创建前端 API 层
  - 文件: `packages/wuh.site.next/app/lib/api.ts`
  - `api.content.getPosts()`, `api.content.getPost()`, `api.repos.getAll()`
  - 预计: 0.5h | 实际: 0.4h

- [x] **Task 4.3** 迁移首页
  - 文件: `packages/wuh.site.next/app/page.tsx`
  - GitHub API → `api.repos.getAll()` + `api.content.getPosts()`
  - 预计: 0.5h | 实际: 0.3h

- [x] **Task 4.4** 迁移博客列表
  - 文件: `packages/wuh.site.next/app/blog/page.tsx`
  - 移除 `parseLinkHeader`、`parsePageNumber`，使用 `pagination` 元数据
  - 预计: 0.5h | 实际: 0.4h

- [x] **Task 4.5** 迁移文章详情
  - 文件: `packages/wuh.site.next/app/post/[number]/page.tsx`
  - 移除 `renderMarkdown()`，后端已返回 `bodyHtml`
  - 相邻文章通过两次 API 调用 + 404 处理
  - 预计: 0.5h | 实际: 0.4h

- [x] **Task 4.6** 更新 shared-contracts
  - 与 Task 3.3 合并完成
  - 预计: 0h | 实际: 0h

## 总结
- 预计总耗时: 7.2h
- 实际总耗时: 4.9h
