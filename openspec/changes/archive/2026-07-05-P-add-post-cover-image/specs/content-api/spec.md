# Spec: 内容 API 文章详情封面

## ADDED

### Requirement: Post detail derives cover from first content image
- **GIVEN** 一篇文章的 `metadata.cover` 为空，且 `bodyHtml` 中包含至少一个 `<img src="...">`
- **WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
- **THEN** 响应中的 `metadata.cover` 应为 `bodyHtml` 中第一张图片的 `src`
- **AND** 服务端不应将该推导值写回数据库

### Requirement: Post detail falls back to markdown first image
- **GIVEN** 一篇文章的 `metadata.cover` 为空，`bodyHtml` 不包含图片，且 `body` 中包含 Markdown 图片语法
- **WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
- **THEN** 响应中的 `metadata.cover` 应为 Markdown 正文第一张图片的 URL

---

## MODIFIED

### Requirement: Post detail includes prev/next adjacent posts
- **GIVEN** 一篇已存在的文章
- **WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
- **THEN** 响应继续包含 `prev`、`next`、`total`、`position`
- **AND** 响应的 `metadata.cover` 优先保留原始手动配置值；仅当原始值为空时，才从正文首图推导

---

## REMOVED

### Requirement: None
- 本次不移除既有内容 API 需求。
