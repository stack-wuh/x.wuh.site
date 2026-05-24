# 技术方案

## 方案: 在详情接口中附带 prev/next

修改 `GET /content/posts/:slugOrNumber`，在响应中增加 `prev` 和 `next` 字段。

### 后端

`ContentService.findAdjacentPosts(currentPost, baseQuery)`:

- 接收当前文章和查询条件（`{ state: 'open' }`）
- 并行查询 prev 和 next
- prev: `createdAtGitHub > current` 中最小者（ASC + number ASC 二级排序）
- next: `createdAtGitHub < current` 中最大者（DESC + number DESC 二级排序）
- 同日期时用 `number` 做二级排序，保证确定性
- 返回 `{ prev: { number, title } | null, next: { number, title } | null }`

`ContentController.getPostDetail`:

- 找到文章后调用 `findAdjacentPosts(result, { state: 'open' })`
- 返回 `{ ...result.toJSON(), prev, next }`

### 前端

`api.content.getPost` 返回类型扩展为 `ContentItem & { prev: AdjacentPost | null; next: AdjacentPost | null }`。

`[number]/page.tsx`:

- 删除 `getAdjacentIssue` 函数
- `getIssue` 改为返回 `{ issue, prev, next }`
- `Page` 组件直接从 `getIssue` 解构 prev/next

`PostView.tsx` / `PostToolbar.tsx`: 无需改动。

## 影响分析

- 无数据库 schema 变更
- 无新增 API 端点
- `GET /content/posts/:slugOrNumber` 响应新增 `prev`/`next` 字段（向后兼容）
- 详情页少发 2 个 HTTP 请求（原来 prev 和 next 各一次）
