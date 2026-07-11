# Toast 提示框主题重新设计

## 背景

当前 Message/Toast 组件使用硬编码的 `--background-100` 和 `--normal-300` 颜色，未跟随主题（酒红/素雅）和亮暗模式变动。暗黑模式下使用 `color-mix` 混色做适配，但视觉上不够协调。

## 目标

- Toast 背景色跟随 `--background-color` 和 `--text-color` 主题令牌
- 各类型（success/warning/error/info/loading）的颜色更鲜明
- 暗黑模式下文字和背景对比度更清晰
- 边框颜色使用 `color-mix` 与主题令牌混合

## 影响范围

- `packages/components/message/styles/index.tsx` — 主题修改
