---
component: ""
hooks: [useFetch]
keywords:
  - useFetch
  - fetcher
  - fetch
  - 请求
  - request
  - API
  - http
  - GET
  - POST
  - data fetching
  - 数据获取
  - query
  - 参数
  - timeout
  - 超时
  - abort
  - 取消
  - loading
  - 加载中
  - error handling
  - 错误处理
  - async
  - 异步
  - backend
  - 后端
  - REST
related: [demo-blog-list, demo-pagination-blog]
---

## API 数据获取

使用 fetcher 封装进行数据请求，支持 GET/POST、query 参数、body、timeout、错误处理。

fetcher 是纯函数，不绑定 React state，配合组件内部状态使用。

### 使用方式

```tsx
import { fetcher } from 'packages/hooks/useFetch'
```

### fetcher API

```ts
fetcher<T>(url, options): Promise<FetchResult<T>>
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `method` | `string` | 默认 GET |
| `headers` | `Record<string, string>` | 请求头 |
| `query` | `Record<string, QueryValue | QueryValue[]>` | URL 查询参数 |
| `body` | `object \| string \| FormData` | 请求体，自动序列化 JSON |
| `timeout` | `number` | 超时毫秒数 |
| `signal` | `AbortSignal` | 外部 AbortController |

返回值 `FetchResult<T>`:

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `data` | `T \| null` | 成功时数据 |
| `error` | `{ message, status, code?, details? }` | 错误信息 |
| `ok` | `boolean` | 是否成功 |
| `status` | `number` | HTTP 状态码 |

### 注意事项

- body 传入 object 时自动设置 Content-Type: application/json 并 JSON.stringify
- query 中数组值会自动添加多个同名参数
- timeout 使用 AbortController 实现
- 在组件中使用时配合 `useEffect` 或 React Query 管理生命周期
