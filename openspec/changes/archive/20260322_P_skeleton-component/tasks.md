# 任务拆分

## Phase 1 — Skeleton 组件实现

- [ ] T1: 实现 Skeleton 组件与 shimmer 动画
  - 涉及文件: `packages/components/skeleton/index.tsx`, styles
  - 产出: GitHub 风格灰阶骨架屏

- [ ] T2: 更新导出与 README
  - 涉及文件: `packages/components/index.ts`, readme.md

## Phase 2 — 页面接入

- [ ] T3: 博客详情页 loading 接入
  - 涉及文件: `packages/wuh.site.next/app/post/[number]/loading.tsx`

- [ ] T4: 博客列表页 loading 接入
  - 涉及文件: `packages/wuh.site.next/app/blog/loading.tsx`

## Phase 3 — 验证

- [ ] T5: 验证骨架屏展示与动效
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证页面切换骨架、shimmer 动画、reduced-motion、dark 模式对比度
