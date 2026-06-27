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
