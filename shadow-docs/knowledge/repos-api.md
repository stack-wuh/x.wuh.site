---
keywords: [Repos API, GitHub, 置顶仓库, GraphQL, pinnedItems, 内存缓存, 过期缓存回退]
---

# Repos API

`GET /v2/repos` 通过 GitHub GraphQL API 查询 `user.pinnedItems(first: 6, types: REPOSITORY)` 获取用户置顶仓库。返回 `{repos: [{name, description, html_url, stargazers_count, language, homepage, fork}]}`，按用户在 GitHub 上的置顶顺序排列。

repos 数据在内存中缓存 5 分钟。GitHub API 调用失败时返回过期缓存数据（即使已过期），确保前端始终有可用数据。
