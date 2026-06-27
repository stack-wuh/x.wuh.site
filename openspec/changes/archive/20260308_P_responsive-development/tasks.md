# 任务拆分

## Phase 1 — 结构调整

- [ ] T1: 拆分 HomeView 结构并实现响应式栅格
  - 涉及文件: `packages/wuh.site.next/app/HomeView.tsx`
  - 产出: 三档响应式布局

- [ ] T2: 微调 card/cta/section 样式
  - 涉及文件: `packages/wuh.site.next/app/HomeView.tsx`, styles
  - 产出: 三设备间距、字号、对齐统一

## Phase 2 — 博客列表页

- [ ] T3: blog/page.tsx 响应式适配
  - 涉及文件: `packages/wuh.site.next/app/blog/page.tsx`

## Phase 3 — 验证

- [ ] T4: 验证各断点布局
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证 390px/768px/1440px 宽度无水平滚动
