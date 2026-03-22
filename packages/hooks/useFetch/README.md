# useFetch

基于 `fetch` 的统一请求封装与 React hook。

## fetcher

```ts
import { fetcher } from '@wuh.site/hooks/useFetch/fetcher'

const { data, error, ok } = await fetcher<User[]>('/api/users', {
  method: 'GET',
  query: { page: 1 },
  next: { revalidate: 60 },
})
```

## useFetch

```tsx
import { useFetch } from '@wuh.site/hooks/useFetch'

const { data, loading, error, reload } = useFetch<User[]>('/api/users')
```

## RequestOptions

- `method`/`headers`/`query`/`body`/`parse`
- `timeout`/`signal`/`cache`/`credentials`
- `next`（Next.js `revalidate` 支持）
- `onStart`/`onSuccess`/`onError`/`onFinally`

## 返回结构

- `FetchResult<T>`: `{ data, error, status, ok, headers }`
- `UseFetchReturn<T>`: `{ data, error, loading, status, ok, run, reload, cancel }`

> Server Components 请使用 `fetcher`，`useFetch` 仅用于客户端。
