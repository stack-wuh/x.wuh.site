# 博客详情页滚动闪屏修复

## What

移除博客详情页所有 scroll 事件监听器，将阅读进度条改为纯 CSS `animation-timeline: scroll()` 驱动。

## Why

滚动时频繁触发 `requestAnimationFrame` 回调导致页面闪屏。原有的 `useScrollProgress` hook 和 `ReadingProgressBar` 组件各自独立监听 scroll 事件，每次滚动都触发 DOM 更新和 React 重渲染。

改用 CSS scroll-driven animation 后，进度条动画由浏览器原生渲染管线驱动，零 JS 开销，不触发重绘/重排。
