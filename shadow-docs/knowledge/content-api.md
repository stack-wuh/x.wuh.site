---
title: 内容 API
domain: api
keywords: [API, 分页, 内容接口, 封面, 标签, prev/next, 相邻文章]
scope:
  - packages/wuh.site.nest/src/modules/content
  - packages/shared-contracts
  - /v2/content
status: active
source:
  - changes/archive/20260501-P-standardize-api-and-migrate-frontend/brief.md
  - changes/archive/20260607-P-unified_request_layer/brief.md
verified: 2026-08-08
---

# 内容 API

## 当前结论

所有分页接口返回统一的 `PaginatedResult<T>` 格式：`{ data: T[], pagination: { page, limit, total, totalPages, hasNextPage, hasPreviousPage } }`。文章不存在返回 404。`page` 和 `limit` 查询参数自动从字符串转换为数字。

`labels` 参数支持逗号分隔字符串和数组两种格式，多标签查询使用 AND 语义（返回同时包含全部指定标签的文章）。

文章详情接口返回 prev/next 相邻文章（`{ number, title }` 或 null），按 `createdAtGitHub` 降序 + `state: 'open'` 排序，同时返回 `total` 和 `position`。封面推导链：手动配置的 `metadata.cover` 优先，为空时从 bodyHtml 首张图片推导，HTML 无图片时从 Markdown 正文首张图片兜底。推导值不写回数据库。

前端分页不再解析 GitHub API 的 Link response header，改用后端响应中的 `pagination` 元数据。

## 执行约束

- 分页统一返回 `PaginatedResult<T>`；labels 参数兼容字符串与数组并保持 AND 语义；不存在文章返回 404。

## 适用边界

不约束 Repos、Weread 等其他领域接口的业务字段。

## 验证方式

检查 Content DTO、Controller 和 Service；运行现有 content spec 覆盖分页、labels 与 404。

## 关联知识

- [api standardization](./api-standardization.md)
- [blog category filter](./blog-category-filter.md)
