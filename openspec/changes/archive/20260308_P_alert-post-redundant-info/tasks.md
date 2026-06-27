# 任务拆分

## Phase 1 — Alert 组件重构

- [ ] T1: 重写 Alert 组件（删除旧 scss 依赖）
  - 涉及文件: `packages/components/alert/index.tsx`, `packages/components/alert/styles/index.ts`
  - 产出: styled-components 实现的 Alert 组件

## Phase 2 — 博客详情页接入

- [ ] T2: PostView 接入 Alert 展示冗余信息
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`
  - 产出: 展示更新时间、原文链接、标签、版权、Project

- [ ] T3: 拆分为 Meta Card + Share Card 双卡片结构
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`, styles
  - 产出: 元信息单行不换行，Icon hover 旋转，Share 独立卡片

## Phase 3 — 验证

- [ ] T4: 功能与样式验证
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证桌面/移动端、字段缺失降级、超长文本省略号
