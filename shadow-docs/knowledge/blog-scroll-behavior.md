---
title: 博客滚动与阅读进度
domain: blog
keywords: [滚动, 阅读进度, 闪屏, CSS动画, scroll-driven, animation-timeline]
scope:
  - packages/wuh.site.next/app/post/PostView.tsx
  - packages/wuh.site.next/app/post/styles
status: active
source:
  - changes/archive/20260510_B_blog-scroll-flicker-fix/brief.md
verified: 2026-08-08
---

# 博客滚动与阅读进度

## 当前结论

博客详情页不使用任何 `scroll` 或 `resize` 事件监听器。阅读进度条通过纯 CSS `animation-timeline: scroll(root)` 在 `::before` 伪元素上实现，固定于页面顶部。支持 `animation-timeline` 的浏览器显示进度条，不支持的自动隐藏降级。

`useScrollProgress` hook 和 `ReadingProgressBar` 组件已删除，不再添加新的 JS 滚动监听。

## 执行约束

- 阅读进度保持纯 CSS `animation-timeline: scroll(root)`；禁止重新添加 scroll/resize 监听器或旧进度 Hook。

## 适用边界

不支持 scroll-driven animations 的浏览器允许隐藏进度条降级。

## 验证方式

搜索文章详情是否存在 `addEventListener`、`useScrollProgress` 或 `ReadingProgressBar`，并检查 CSS fallback。

## 关联知识

- [blog detail](./blog-detail.md)
- [first load performance](./first-load-performance.md)
