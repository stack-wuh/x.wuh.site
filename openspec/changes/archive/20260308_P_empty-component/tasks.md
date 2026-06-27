# 任务拆分

## Phase 1 — Empty 组件实现

- [ ] T1: 实现 Empty 组件
  - 涉及文件: `packages/components/empty/index.tsx`, readme.md
  - 产出: token 驱动的 Empty 空状态组件

## Phase 2 — 页面接入

- [ ] T2: 博客详情页底部接入 Empty 作为留言占位
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`
  - 产出: 留言系统预留区展示

## Phase 3 — 验证

- [ ] T3: 验证功能与样式
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证占位文案、light/dark、移动端
