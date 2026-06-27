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
