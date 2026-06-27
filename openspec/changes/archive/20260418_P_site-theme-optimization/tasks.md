# 任务拆分

## Phase 1 — Design Tokens

- [ ] T1: 定义 tokens 与 CSS 变量
  - 涉及文件: `packages/components/themes/tokens.ts`, `CssVariableStyles.tsx`
  - 产出: 两套主题四分支 CSS 变量

- [ ] T2: 实现主题切换入口与持久化
  - 涉及文件: `packages/components/themes/ThemeProvider.tsx`
  - 产出: localStorage 持久化 + 跟随系统选项

## Phase 2 — 页面重构

- [ ] T3: 重构首页（Header + Hero + 精选模块 + 列表卡片）
  - 涉及文件: `packages/wuh.site.next/app/HomeView.tsx`, styles

- [ ] T4: 重构文章详情页（正文宽度 + 元信息 + 上下篇 + 评论空状态）
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`

- [ ] T5: 实现 TOC
  - 涉及文件: `packages/wuh.site.next/app/post/TableOfContents.tsx`

## Phase 3 — 组件对齐

- [ ] T6: 统一 Card/Tag/Button/Empty 组件样式
- [ ] T7: 响应式调试（四档断点）
- [ ] T8: 可访问性检查（对比度、focus、keyboard）

## Phase 4 — 验证

- [ ] T9: 全站验证
  - `pnpm --filter @wuh.site/next lint && pnpm --filter @wuh.site/next build`
  - 手动回归所有页面 + 两套主题切换 + 四档断点
