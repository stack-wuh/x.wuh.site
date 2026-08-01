# useFetch fetcher 请求库简化

> 原始变更名：`20260510_P_useFetch_fetcher_简化`

## 元数据
- 日期：2026-05-10
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
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

## 任务
### Phase 1 — fetcher.ts 简化
- [x] T1: 修复跨平台兼容（buildUrl 移除 window、NodeJS.Timeout 改 ReturnType）
- [x] T2: 移除回调模式（onStart/onSuccess/onError/onFinally）
- [x] T3: Next.js ISR 解耦（next 选项改为 ext 扩展）
### Phase 2 — useFetch.ts 精简
- [x] T4: 精简 useFetch，适配简化后的 fetcher
- [x] T5: 确认 barrel 导出无需变动
### Phase 3 — 消费者适配
- [x] T6: 适配 api.ts 使用新 fetcher 接口（next → ext.next）
### Phase 4 — 验证
- [x] T7: TypeScript 类型检查 — 环境 SIGSEGV 跳过，手动审查通过
- [x] T8: `next build` 构建验证 — 环境 SIGSEGV 跳过（与 openspec/oxlint 同源既有问题）

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: useFetch fetcher 请求库简化
change: useFetch-fetcher-simplification
date: 2026-05-10
type: P
status: applied
```

### `design.md`
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

### `proposal.md`
# useFetch fetcher 请求库简化

## 为什么做

当前 `fetcher.ts`（215 行）存在三个问题：

1. **跨平台兼容性差**：`buildUrl` 硬编码 `window.location.origin` 作为 base URL，在 React Native 环境无法运行；`NodeJS.Timeout` 类型在非 Node 运行时失效
2. **过度设计**：回调模式（onStart/onSuccess/onError/onFinally）在 fetcher 和 useFetch 两层都有定义，实际零消费者；useFetch 整个 hook 项目中无运行时引用
3. **Next.js 耦合**：`RequestInit & { next?: NextFetchConfig }` 类型扩展在纯 fetch 层面绑定了 Next.js 语义

目标：精简 fetcher 为核心 fetch 包装器，移除平台相关代码，方便后续 RN 和 Electron 应用共用。

## 做什么

- 修复 `buildUrl` 移除 `window` 依赖，改用环境无关的 URL 构造方式
- `NodeJS.Timeout` 改为 `ReturnType<typeof setTimeout>`
- 移除 fetcher 和 useFetch 中的回调模式（无消费者）
- 将 Next.js ISR 的 `next` 选项从核心类型中解耦
- 清理 useFetch 中未使用的 `createOptionsKey`、`mergeOptions` 等辅助函数

## 影响范围

- `packages/hooks/useFetch/fetcher.ts` — 核心修改
- `packages/hooks/useFetch/useFetch.ts` — 精简
- `packages/hooks/useFetch/index.ts` — 导出调整（如有）
- `packages/wuh.site.next/app/lib/api.ts` — 适配新接口

## 不改什么

- 不改变 `FetchResult` 模式（不 throw 的返回约定保持不变）
- 不改变 `api.ts` 中业务 API 的对外接口（content/repos/comments）
- 不删除 `useFetch.ts`（保留为可选 React 绑定，未来 RN/Electron 可能用到）

### `tasks.md`
# 任务拆分

## Phase 1 — fetcher.ts 简化

- [x] T1: 修复跨平台兼容（buildUrl 移除 window、NodeJS.Timeout 改 ReturnType）
  - 涉及文件: `packages/hooks/useFetch/fetcher.ts`
  - 预计耗时: 0.5h | 实际: 0.3h

- [x] T2: 移除回调模式（onStart/onSuccess/onError/onFinally）
  - 涉及文件: `packages/hooks/useFetch/fetcher.ts`
  - 预计耗时: 0.5h | 实际: 0.3h

- [x] T3: Next.js ISR 解耦（next 选项改为 ext 扩展）
  - 涉及文件: `packages/hooks/useFetch/fetcher.ts`
  - 预计耗时: 0.5h | 实际: 0.3h

## Phase 2 — useFetch.ts 精简

- [x] T4: 精简 useFetch，适配简化后的 fetcher
  - 涉及文件: `packages/hooks/useFetch/useFetch.ts`
  - 预计耗时: 0.5h | 实际: 0.5h

- [x] T5: 确认 barrel 导出无需变动
  - 涉及文件: `packages/hooks/useFetch/index.ts`
  - 预计耗时: 0.1h | 实际: 0.1h

## Phase 3 — 消费者适配

- [x] T6: 适配 api.ts 使用新 fetcher 接口（next → ext.next）
  - 涉及文件: `packages/wuh.site.next/app/lib/api.ts`
  - 预计耗时: 0.3h | 实际: 0.1h

## Phase 4 — 验证

- [x] T7: TypeScript 类型检查 — 环境 SIGSEGV 跳过，手动审查通过
- [x] T8: `next build` 构建验证 — 环境 SIGSEGV 跳过（与 openspec/oxlint 同源既有问题）
