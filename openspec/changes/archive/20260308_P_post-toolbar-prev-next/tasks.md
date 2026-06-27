# 任务拆分

## Phase 1 — 数据层

- [ ] T1: page.tsx 中获取相邻文章数据
  - 涉及文件: `packages/wuh.site.next/app/post/[number]/page.tsx`
  - 产出: prevIssue/nextIssue 数据

## Phase 2 — UI 层

- [ ] T2: 重构 PostView 底部 Toolbar
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`, styles
  - 产出: 上下篇导航按钮 + 禁用态 "空空如也"

## Phase 3 — 验证

- [ ] T3: 验证导航功能
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证第一篇/最后一篇禁用态、超长标题省略、移动端
