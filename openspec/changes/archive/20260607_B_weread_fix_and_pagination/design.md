# Design: weread 分页支持

## 后端

- `WereadService.getBooks(page, limit)` → 使用 Mongoose `skip()`/`limit()`/`countDocuments()` + `buildPaginatedResult()`
- `WereadController` → 新增 `page` 和 `limit` 查询参数，默认 page=1, limit=10
- 返回 `PaginatedResult<WereadBook>` 结构（data + pagination）

## 前端

- `api.weread.getBooks({page, limit})` → 替代旧的 `getBooks(limit)`
- `app/weread/page.tsx` → 服务端组件，`searchParams.page`，`PER_PAGE=10`
- `WereadView` → 接收 `total`/`currentPage`/`totalPages`，底部渲染 `<Pagination>`
