---
title: Repos API
domain: api
keywords: [Repos API, GitHub, 置顶仓库, GraphQL, pinnedItems, 内存缓存, 过期缓存回退]
scope:
  - packages/wuh.site.nest/src/modules/repos
  - /v2/repos
  - packages/wuh.site.next/app
status: active
source:
  - changes/archive/20260621-P-about_github_data/brief.md
verified: 2026-08-08
---

# Repos API

## 当前结论

`GET /v2/repos` 通过 GitHub GraphQL API 查询 `user.pinnedItems(first: 6, types: REPOSITORY)` 获取用户置顶仓库。返回 `{repos: [{name, description, html_url, stargazers_count, language, homepage, fork}]}`，按用户在 GitHub 上的置顶顺序排列。

repos 数据在内存中缓存 5 分钟。GitHub API 调用失败时返回过期缓存数据（即使已过期），确保前端始终有可用数据。

## 执行约束

- Repos 必须保持 GitHub pinnedItems 顺序和缓存降级；不得再按 stars 重排置顶仓库。

## 适用边界

不约束 About contribution 热力图接口。

## 验证方式

检查 repos service GraphQL 查询、映射与缓存；用固定 pinnedItems 响应验证返回顺序。

## 关联知识

- [api standardization](./api-standardization.md)
- [homepage data](./homepage-data.md)
