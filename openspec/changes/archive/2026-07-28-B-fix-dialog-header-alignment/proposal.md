# 修复 Dialog 标题与关闭图标垂直对齐

## 背景

共享 Dialog 的 Header 与关闭按钮当前均使用顶部对齐，导致标题与关闭图标不在同一视觉中线上，关闭图标呈现顶对齐。该样式由共享组件提供，因此会影响所有使用标题栏的 Dialog。

## 目标

- 让共享 Dialog 的标题区域与关闭按钮在 Header 内垂直居中。
- 让关闭图标在现有 44×44 像素点击区域内垂直、水平居中。
- 同时兼容单标题和“标题 + 副标题”场景。

## 非目标（明确不做）

- 不调整 Dialog Header 的间距、边框、字体或关闭按钮尺寸。
- 不修改 Dialog 的结构、Props、关闭交互、动画或无障碍属性。
- 不单独覆盖某个页面或某个 Dialog 使用方。

## 影响范围

- `packages/components/dialog/styles/index.tsx` — 调整共享 Dialog Header 和关闭按钮的 flex 对齐方式。
- `packages/components` — 所有使用共享 Dialog 标题栏的前端界面同步生效。
