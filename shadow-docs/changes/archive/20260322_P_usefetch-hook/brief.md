# useFetch 请求封装

> 原始变更名：`20260322_P_usefetch-hook`

## 元数据
- 日期：2026-03-22
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
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

## 任务
### Phase 1 — fetcher 封装
- [ ] T1: 实现 fetcher 核心函数
- [ ] T2: 实现 useFetch hook
### Phase 2 — 全局替换
- [ ] T3: 替换现有 fetch 调用
### Phase 3 — 验证
- [ ] T4: 验证所有页面数据加载

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: useFetch请求封装
change: usefetch-hook
date: 2026-03-22
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/40
```

### `design.md`
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

### `proposal.md`
# useFetch 请求封装

## 为什么做

页面内直接使用 fetch，缺少统一封装与治理能力。需要新增 useFetch hook 统一管理请求、入参/出参结构，便于埋点扩展和统一错误处理。

## 做什么

- 新增 `useFetch` hook 封装 fetch
- 统一 `RequestOptions` 入参（method/headers/query/body/parse/timeout）
- 统一 `FetchResult<T>` 输出（data/error/status/ok/headers）
- 预留 onStart/onSuccess/onError/onFinally 回调
- 全局替换页面直接 fetch 调用：Server Components 用 fetcher，Client Components 用 useFetch

## 影响范围

- `packages/hooks/useFetch/` — 新增
- `packages/wuh.site.next/app/` — 替换现有 fetch 调用

### `tasks.md`
# 任务拆分

## Phase 1 — fetcher 封装

- [ ] T1: 实现 fetcher 核心函数
  - 涉及文件: `packages/hooks/useFetch/fetcher.ts`
  - 产出: 统一 fetch 封装，支持 RequestOptions 和 FetchResult

- [ ] T2: 实现 useFetch hook
  - 涉及文件: `packages/hooks/useFetch/index.ts`
  - 产出: 客户端 hook，支持 loading/error/data 状态

## Phase 2 — 全局替换

- [ ] T3: 替换现有 fetch 调用
  - 涉及文件: `packages/wuh.site.next/app/` 下所有使用 fetch 的页面
  - 产出: Server Components 用 fetcher，Client Components 用 useFetch

## Phase 3 — 验证

- [ ] T4: 验证所有页面数据加载
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证 `/`、`/blog`、`/post/[number]` 数据加载正常
