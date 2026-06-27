# Skeleton 骨架屏组件

## 为什么做

页面切换的 Loading 过渡页过于简单。需要新增骨架屏公共组件，在数据加载时提供与内容结构一致的占位视觉，提升感知性能。

## 做什么

- 新增可复用 Skeleton 骨架屏组件
- GitHub 风格灰阶骨架：标题条 + 段落条 + 图文块
- 轻微 shimmer 动效
- 接入博客详情页和博客列表页 loading.tsx
- 遵循 prefers-reduced-motion（无动画）

## 影响范围

- `packages/components/skeleton/` — 新增
- `packages/wuh.site.next/app/post/[number]/loading.tsx` — 接入
- `packages/wuh.site.next/app/blog/loading.tsx` — 接入
