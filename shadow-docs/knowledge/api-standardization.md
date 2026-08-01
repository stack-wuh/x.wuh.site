---
keywords: [API标准化, v2接口, Swagger, 错误处理, 统一格式, NestJS API, ISR, repos接口]
---

# API 标准化

`GET /v2/repos` 返回 GitHub 仓库列表（name, description, stars, language, url），按 stars 降序排列，含内存缓存层减少 GitHub API 调用。Swagger 交互式文档自动生成于 `/api-docs`，DTO schema 由 class-validator 装饰器推断。

统一异常过滤器将所有 NestJS 异常转换为 `{statusCode, message, timestamp, path}` 格式，通过 Pino 记录日志。

前端组件（HomeView、BlogListView 等）通过 NestJS API（port 3200）获取数据，使用 `fetch` + ISR `revalidate` 策略，不再直接调用 GitHub GraphQL API。
