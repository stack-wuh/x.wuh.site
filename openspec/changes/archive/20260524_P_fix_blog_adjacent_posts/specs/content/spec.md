# Content API — 文章详情接口

## MODIFIED

### GET /content/posts/:slugOrNumber

**GIVEN** 一篇已存在的文章
**WHEN** 客户端请求 `GET /content/posts/:slugOrNumber`
**THEN** 响应包含文章的完整信息
**AND** 响应包含 `prev` 字段（`{ number, title }` 或 `null`），表示按 `createdAtGitHub` 降序 + `state: 'open'` 过滤后，紧邻当前文章的上一条（更新的文章）
**AND** 响应包含 `next` 字段（`{ number, title }` 或 `null`），表示同排序规则下紧邻当前文章的下一条（更旧的文章）
**AND** 当文章为列表中第一篇时 `prev` 为 `null`
**AND** 当文章为列表中最后一篇时 `next` 为 `null`
**AND** `prev`/`next` 的排序规则与 `GET /content/posts?state=open` 一致
