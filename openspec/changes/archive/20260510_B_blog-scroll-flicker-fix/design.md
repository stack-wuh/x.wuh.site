# 设计文档

## 架构对比

### 之前

```
PostView.tsx
  ├── useScrollProgress() → scroll + resize 事件 → setState → 重渲染
  ├── ReadingProgressBar → scroll + resize 事件 → 直接 DOM 操作
  └── FloatingActions ← scrollPercent prop → 渐变背景计算
```

### 之后

```
Container::before (纯 CSS)
  ├── position: fixed, top: 0, left: 0, right: 0, height: 3px
  ├── animation-timeline: scroll(root)
  └── @keyframes scroll-progress { from { scaleX(0) } to { scaleX(1) } }
```

## 关键决策

- **零 JS 方案**: CSS `animation-timeline: scroll(root)` 由浏览器渲染引擎原生驱动
- **降级策略**: `@supports not (animation-timeline: scroll())` 时隐藏进度条
- **删除 IntersectionObserver 保留**: `useHeadingObserver` 驱动 TOC 高亮，非滚动事件

## 涉及文件

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `app/post/hooks/useScrollProgress.ts` | 删除 | 移除 scroll 事件 hook |
| `app/post/components/ReadingProgressBar.tsx` | 删除 | 移除 JS 驱动进度条组件 |
| `app/post/PostView.tsx` | 修改 | 移除导入和调用 |
| `app/post/components/FloatingActions.tsx` | 修改 | 移除 scrollPercent prop |
| `app/post/styles/index.ts` | 修改 | 添加 CSS 滚动动画进度条, 移除死代码 |
