# 设计：useFetch 请求封装

## 方案

### 1. 类型定义

```ts
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  query?: Record<string, string | number>
  body?: unknown
  parse?: 'json' | 'text' | 'stream'
  timeout?: number
}

interface FetchResult<T> {
  data: T | null
  error: string | null
  status: number
  ok: boolean
  headers: Headers
}

interface FetchCallbacks {
  onStart?: () => void
  onSuccess?: <T>(data: T) => void
  onError?: (error: string) => void
  onFinally?: () => void
}
```

### 2. 分层策略

- **Server Components**: 使用 `fetcher(url, options)` 纯函数
- **Client Components**: 使用 `useFetch(url, options)` hook

### 3. 错误处理

- 统一错误结构 `{ error: string }`
- HTTP 错误码映射友好提示
- 网络异常捕获并返回标准结构

## 依赖

- 零新依赖
