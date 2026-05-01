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
