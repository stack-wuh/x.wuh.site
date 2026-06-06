# 骨架屏主题适配 + 渐进过渡

## 问题

1. 骨架屏色值硬编码 + `@media (prefers-color-scheme: dark)` 手动适配，不跟随站点 `data-theme='plain'` 主题切换
2. 页面加载快时骨架屏闪烁即消失，shimmer 动画没机会执行，体验割裂

## 方案

- Skeleton 组件色值改用 `var(--primary-*)` CSS 变量，自然跟随所有主题（money/plain × light/dark）
- Shimmer 加 `animation-delay: 0.15s`，150ms 内数据就绪则不播动画
- BlogListView 和 PostView 根容器加 `contentEnter` fade-in 动画（250ms ease-out）
- 保留 `loading.tsx` 结构不变
- 所有动画尊重 `prefers-reduced-motion: reduce`
