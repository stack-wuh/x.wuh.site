# 任务拆分

## Phase 1 — FloatButton 实现

- [ ] T1: 实现浮动按钮组与滚动进度
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`
  - 产出: 浮动按钮组 + 滚动进度数字

- [ ] T2: 实现拖拽吸附逻辑
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`
  - 产出: 可拖拽按钮组，左右侧吸附

## Phase 2 — 验证

- [ ] T3: 验证按钮功能与拖拽
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证返回首页/页头、拖动吸附、进度准确、移动端无遮挡
