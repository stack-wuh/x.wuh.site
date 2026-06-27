# 设计：Skeleton 组件

## 方案

### 1. 组件 API

```ts
interface SkeletonProps {
  variant?: 'text' | 'title' | 'image' | 'card'
  width?: string | number
  height?: string | number
  count?: number
  animated?: boolean // 默认 true
}
```

### 2. 样式

- 灰阶背景: CSS 变量 `--skeleton-base` / `--skeleton-shimmer`
- Shimmer 动画: `@keyframes shimmer`，`background: linear-gradient(90deg, ...)`
- prefers-reduced-motion: 禁用 shimmer，显示静态占位

### 3. 页面 loading 场景

- 博客列表: 3 列卡片骨架（桌面）/ 1 列（移动端）
- 博客详情: 标题 + 段落条 + 图片块骨架

## 依赖

- 零新依赖
