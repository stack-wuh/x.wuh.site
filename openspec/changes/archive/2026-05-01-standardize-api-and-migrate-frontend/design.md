# Design: 前后端联调 - OpenAPI 标准化 + 接口迁移

## 架构决策

### 分页响应格式

```ts
PaginatedResult<T> = {
  data: T[]
  pagination: { page, limit, total, totalPages, hasNextPage, hasPreviousPage }
}
```

替代旧的 `{ data, total, page }`，前端不再需要解析 GitHub Link header。

### 异常过滤器

全局 `HttpExceptionFilter` 统一错误响应为 `{ statusCode, message, error, timestamp }`，生产环境隐藏堆栈信息。

### Swagger 挂载点

`/v2/docs` - 复用已有的全局前缀 `app.setGlobalPrefix('v2')`，避免与 Swagger UI 根路径冲突。

### repos 缓存策略

- 内存缓存 TTL 5 分钟
- 过期后返回 stale 数据作为 fallback
- 不使用 Redis（简化部署）

### 前端 API 层

`app/lib/api.ts` 封装所有后端调用，类型安全。通过 `NEST_API_URL` 环境变量切换后端地址，通过 `next.config.ts` rewrite 在生产环境代理 `/api/*`。

## 接口变更

### 新增接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v2/repos` | 获取 GitHub repos（过滤 fork，按 stars 排序） |

### 修改接口
| 方法 | 路径 | 变更 |
|------|------|------|
| GET | `/v2/content/posts` | 响应格式从 `{ data, total, page }` 改为 `{ data, pagination }` |
| GET | `/v2/content/posts/:slugOrNumber` | 不存在时返回 404 而非 null |
| GET | `/v2/content/projects` | 同上分页格式变更 |
| GET | `/v2/comments` | 同上分页格式变更 |
| PATCH | `/v2/admin/content/:id/metadata` | 不存在时返回 404 |

## 关键文件

| 文件 | 角色 |
|------|------|
| `packages/wuh.site.nest/src/common/interfaces/paginated-response.interface.ts` | 分页工具 |
| `packages/wuh.site.nest/src/common/filters/http-exception.filter.ts` | 异常处理 |
| `packages/wuh.site.nest/src/main.ts` | Swagger + 全局过滤器 |
| `packages/wuh.site.nest/src/modules/repos/` | repos 模块 |
| `packages/wuh.site.next/app/lib/api.ts` | 前端 API 层 |
| `packages/wuh.site.next/next.config.ts` | API rewrite |
| `packages/shared-contracts/src/index.ts` | 共享类型 |
