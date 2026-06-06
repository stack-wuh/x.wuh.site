# 任务清单

## Task 1: Skeleton 组件色值改用 CSS 变量 + shimmer 延迟

**文件:** `packages/components/skeleton/index.tsx`

- [x] 将 `SkeletonRoot` 的 background 改为 `linear-gradient(90deg, var(--primary-100), var(--primary-300), var(--primary-100))`
- [x] 删除 `@media (prefers-color-scheme: dark)` 块
- [x] 添加 `animation-delay: 0.15s`
- [x] 保留 `@media (prefers-reduced-motion: reduce)` 不变
- [x] 验证: `pnpm exec tsc --noEmit`（SIGSEGV 已知环境问题，非本次改动导致）

## Task 2: BlogListView 根容器添加 fade-in

**文件:** `packages/wuh.site.next/app/blog/BlogListView.tsx`

- [x] 在 `Root` styled-component 添加 `contentEnter` keyframes 动画（opacity 0→1, translateY 6px→0, 250ms ease-out）
- [x] 添加 `@media (prefers-reduced-motion: reduce) { animation: none }`
- [x] 验证: `pnpm exec tsc --noEmit`（SIGSEGV 已知环境问题）

## Task 3: PostView Container 添加 fade-in

**文件:** `packages/wuh.site.next/app/post/styles/index.ts`

- [x] 在 `Container` styled-component 添加 `contentEnter` keyframes 动画（同上）
- [x] 添加 `@media (prefers-reduced-motion: reduce) { animation: none }`
- [x] 验证: `pnpm exec tsc --noEmit`（SIGSEGV 已知环境问题）
