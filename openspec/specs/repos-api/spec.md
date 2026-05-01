# Repos API

## ADDED

### Requirement: Get GitHub repositories
`GET /v2/repos` 返回 GitHub 用户的所有公开仓库，过滤 fork，按 star 排序。

- **GIVEN** 客户端请求 `/v2/repos`
- **WHEN** 服务端调用 GitHub API
- **THEN** 返回 `{ repos: [{ name, description, html_url, stargazers_count, language, homepage, fork }] }`
- **AND** fork 仓库被过滤
- **AND** 结果按 `stargazers_count` 降序排列

### Requirement: 5-minute memory cache
repos 数据在内存中缓存 5 分钟。

- **GIVEN** 首次请求 `/v2/repos`
- **WHEN** 数据从 GitHub API 获取
- **THEN** 结果缓存 5 分钟

### Requirement: Stale cache fallback
GitHub API 调用失败时，返回过期缓存数据。

- **GIVEN** 有缓存数据（即使已过期）
- **WHEN** GitHub API 调用失败
- **THEN** 返回缓存的 repos 数据
