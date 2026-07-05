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

### Requirement: Multiple labels query uses AND semantics
多个 `labels` 查询条件使用 AND 语义过滤内容。

- **GIVEN** 内容列表接口收到多个 `labels` 查询条件
- **WHEN** 服务端构造数据库查询条件
- **THEN** 查询条件使用数组全部匹配语义
- **AND** 返回结果中的每篇文章都同时包含全部指定 labels

### Requirement: Post detail derives cover from first content image
文章详情接口在缺少手动封面时，从正文 HTML 第一张图片推导封面。

- **GIVEN** 一篇文章的 `metadata.cover` 为空，且 `bodyHtml` 中包含至少一个 `<img src="...">`
- **WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
- **THEN** 响应中的 `metadata.cover` 应为 `bodyHtml` 中第一张图片的 `src`
- **AND** 服务端不应将该推导值写回数据库

### Requirement: Post detail falls back to markdown first image
文章详情接口在 HTML 无图片时，从 Markdown 正文第一张图片兜底推导封面。

- **GIVEN** 一篇文章的 `metadata.cover` 为空，`bodyHtml` 不包含图片，且 `body` 中包含 Markdown 图片语法
- **WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
- **THEN** 响应中的 `metadata.cover` 应为 Markdown 正文第一张图片的 URL

## MODIFIED

### Requirement: findAll returns PaginatedResult
`content.service.ts` 和 `comment.service.ts` 的 `findAll()` 方法从 `{ data, total, page }` 改为返回 `PaginatedResult<T>`。

### Requirement: Post detail includes prev/next adjacent posts
文章详情接口返回 prev/next 相邻文章，与博客列表页排序一致。

- **GIVEN** 一篇已存在的文章
- **WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
- **THEN** 响应包含 `prev` 字段（`{ number, title }` 或 `null`），表示按 `createdAtGitHub` 降序 + `state: 'open'` 过滤后，紧邻当前文章的上一条（更新的文章）
- **AND** 响应包含 `next` 字段（`{ number, title }` 或 `null`），表示同排序规则下紧邻当前文章的下一条（更旧的文章）
- **AND** `prev`/`next` 的排序规则与 `GET /content/posts?state=open` 一致
- **AND** 响应包含 `total`（符合条件的文章总数）和 `position`（当前文章在排序中的位置）
- **AND** 响应的 `metadata.cover` 优先保留原始手动配置值；仅当原始值为空时，才从正文首图推导

## REMOVED

### Requirement: GitHub Link header pagination
前端不再通过解析 GitHub API 的 `Link` response header 做分页，改用后端响应中的 `pagination` 元数据。
