# 设计文档

## 架构

三个独立改动，无相互依赖：

1. **Skeleton 组件** — 色值纯用 `var(--primary-*)` + shimmer 加 `animation-delay: 0.15s`
2. **BlogListView** — 根容器加 `contentEnter` fade-in（250ms ease-out）
3. **PostView Container** — 同上

## 色值适配原理

CSS 变量已在 `CssVariableStyles` 中按四层级联定义：
- `:root` — money 主题 light
- `:root[data-theme='plain']` — plain 主题 light
- `@media (prefers-color-scheme: dark)` `:root` — money 主题 dark
- `@media (prefers-color-scheme: dark)` `:root[data-theme='plain']` — plain 主题 dark

Skeleton 只需引用 `var(--primary-100)` / `var(--primary-300)`，无需任何 `@media` 查询。

## 行为矩阵

| 场景 | 骨架屏 | 内容 |
|---|---|---|
| 数据 < 150ms | 渲染但 shimmer 不启动 | fade-in 250ms |
| 数据 150ms~1s | shimmer 启动 | fade-in 250ms |
| 数据 > 1s | shimmer 持续循环 | fade-in 250ms |
| reduced-motion | 无动画 | 无动画 |

## 改动范围

| 文件 | 改动 |
|---|---|
| `packages/components/skeleton/index.tsx` | 替换色值 + animation-delay |
| `packages/wuh.site.next/app/blog/BlogListView.tsx` | Root 加 contentEnter |
| `packages/wuh.site.next/app/post/styles/index.ts` | Container 加 contentEnter |
