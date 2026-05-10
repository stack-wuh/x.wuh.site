# 设计：fetcher 简化与跨平台适配

## 方案

### 1. 移除跨平台障碍

**`buildUrl` 中的 `window` 依赖**

当前代码：

```ts
const url = new URL(input, typeof window === 'undefined' ? 'http://localhost' : window.location.origin)
```

问题：React Native 中 `window` 存在但没有 `location.origin`，`typeof window` 检查会走错误分支。

修复：始终使用 `http://localhost` 作为相对 URL 的 base，反正这行之后 base 会被 `url.toString().replace(url.origin, '')` 去掉：

```ts
const url = new URL(input, 'http://localhost')
```

**`NodeJS.Timeout` 类型**

```ts
// before
let timer: NodeJS.Timeout | null = null

// after
let timer: ReturnType<typeof setTimeout> | null = null
```

### 2. 移除回调模式

从 `RequestOptions` 中删除 `onStart`/`onSuccess`/`onError`/`onFinally`。fetcher 保持纯返回 `FetchResult` 的行为不变。

`useFetch` 中对应的 `UseFetchOptions` 回调保留（React hook 层级的生命周期回调有存在价值），但不再透传给 fetcher，改为在 `run` 内部读取 result 后调用。

### 3. Next.js ISR 解耦

将 `next` 选项从 `RequestOptions` 核心类型中提取，改为泛型扩展：

```ts
type RequestOptions<TBody = unknown, TExt = unknown> = {
  method?: string
  // ... 标准选项 ...
  ext?: TExt  // 运行时段扩展，由具体平台填充
}
```

对于 Next.js 服务端使用场景（api.ts），改为：

```ts
await fetcher<T>(url, {
  headers: { 'Accept': 'application/json' },
  ext: { next: { revalidate: 60 } }
})
```

`fetcher` 内部将 `options.ext` 合并到 `RequestInit`：

```ts
const requestInit: RequestInit = {
  method,
  headers,
  body,
  signal,
  ...(options.ext || {}),
}
```

### 4. 精简 useFetch

- 删除 `createOptionsKey`（JSON.stringify 序列化 options 作为依赖 key 的方案本身脆弱，且无实际使用场景）
- 简化 `mergeOptions` 为内联 spread
- 回调改为在 result 返回后执行（不再透传给 fetcher）

### 5. api.ts 适配

API 接口保持不变，内部调用方式微调：

```ts
async function apiGet<T>(path: string, options?: FetchOptions): Promise<T> {
  const res = await fetcher<T>(`${API_BASE}${path}`, {
    headers: { 'Accept': 'application/json' },
    ext: options?.revalidate ? { next: { revalidate: options.revalidate } } : undefined,
  })
  if (!res.ok || !res.data) {
    throw new Error(res.error?.message || `API request failed: ${path}`)
  }
  return res.data
}
```

## 前后对比

| 项目 | 修改前 | 修改后 |
|------|--------|--------|
| fetcher.ts 行数 | 215 | ~100 |
| useFetch.ts 行数 | 140 | ~80 |
| 跨平台兼容 | 依赖 window/NodeJS | 纯 Web API |
| Next.js 耦合 | RequestInit 类型扩展 | ext 泛型扩展 |
| 回调模式 | 两层定义（fetcher + useFetch） | 仅 useFetch 保留 |

## 依赖

- 零新依赖，仅使用标准 `fetch` API
- RN 环境需 `fetch` polyfill（如内置或在 metro config 中配置）
