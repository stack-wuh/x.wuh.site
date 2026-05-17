# 博客详情页排版重新设计

## 动机

博客详情页（PostView + MarkdownBody）在酒红(Default) + 素雅(Plain) × light + dark 四组主题组合下，存在字号层级不清晰、文字与背景对比度不足、素雅 dark 模式 CSS 变量覆盖不完整的系统性问题。

## 变更范围

- 双主题独立排版 Token（字号 + 行高）
- 补全素雅 dark 模式缺失的 CSS 变量
- MarkdownBody 标题字号从硬编码 em 改为 CSS 变量引用
- 按 WCAG AA 校准四组组合的文字对比度

## 影响包

- `packages/components` — cssVariableProvider.tsx
- `packages/wuh.site.next` — app/post/styles/index.ts

## 非目标

- 不修改组件库其他组件（Button、Card 等）
- 不修改 DefaultTheme tokens 类型结构
- 不新增 npm 依赖
