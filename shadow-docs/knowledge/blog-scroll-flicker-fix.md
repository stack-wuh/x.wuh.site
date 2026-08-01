---
keywords: [滚动, 阅读进度, 闪屏, CSS动画, scroll-driven, animation-timeline]
---

# 博客滚动与阅读进度

博客详情页不使用任何 `scroll` 或 `resize` 事件监听器。阅读进度条通过纯 CSS `animation-timeline: scroll(root)` 在 `::before` 伪元素上实现，固定于页面顶部。支持 `animation-timeline` 的浏览器显示进度条，不支持的自动隐藏降级。

`useScrollProgress` hook 和 `ReadingProgressBar` 组件已删除，不再添加新的 JS 滚动监听。
