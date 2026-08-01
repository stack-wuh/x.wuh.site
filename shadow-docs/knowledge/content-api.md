---
keywords: [API, 分页, 内容接口, 封面, 标签, prev/next, 相邻文章]
---

# 内容 API

所有分页接口返回统一的 `PaginatedResult<T>` 格式：`{ data: T[], pagination: { page, limit, total, totalPages, hasNextPage, hasPreviousPage } }`。文章不存在返回 404。`page` 和 `limit` 查询参数自动从字符串转换为数字。

`labels` 参数支持逗号分隔字符串和数组两种格式，多标签查询使用 AND 语义（返回同时包含全部指定标签的文章）。

文章详情接口返回 prev/next 相邻文章（`{ number, title }` 或 null），按 `createdAtGitHub` 降序 + `state: 'open'` 排序，同时返回 `total` 和 `position`。封面推导链：手动配置的 `metadata.cover` 优先，为空时从 bodyHtml 首张图片推导，HTML 无图片时从 Markdown 正文首张图片兜底。推导值不写回数据库。

前端分页不再解析 GitHub API 的 Link response header，改用后端响应中的 `pagination` 元数据。
