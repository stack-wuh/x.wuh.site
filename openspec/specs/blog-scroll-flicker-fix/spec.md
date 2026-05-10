# 博客详情页滚动闪屏修复

## R1 — 移除所有 scroll 事件监听

博客详情页不添加任何 `scroll` 或 `resize` 事件监听器。`useScrollProgress` hook 和 `ReadingProgressBar` 组件已删除。

## R2 — 纯 CSS 阅读进度条

阅读进度条通过 `Container::before` 伪元素 + CSS `animation-timeline: scroll(root)` 实现。固定于页面顶部，滚动时从 `scaleX(0)` 平滑过渡到 `scaleX(1)`。

## R3 — 浏览器兼容性

支持 `animation-timeline` 的浏览器（Chrome 115+, Edge 115+, Safari 18.2+）显示进度条。不支持的浏览器自动降级隐藏。

## R4 — 保留现有功能

以下功能不受影响：
- 代码高亮和复制按钮
- 图片预览
- 目录 (TOC) 导航
- 浮动操作按钮（回首页、回页头、点赞）
