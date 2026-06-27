# 任务拆分

## Phase 1 — 按钮组优化

- [ ] T1: 移除进度按钮 + 渐变样式迁移
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`, styles
  - 产出: 回到页头按钮展示渐变进度

## Phase 2 — 验证

- [ ] T2: 验证按钮功能与渐变
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证滚动渐变、拖拽吸附、dark mode、reduced-motion
