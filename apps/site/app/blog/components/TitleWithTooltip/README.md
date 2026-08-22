# TitleWithTooltip

博客标题溢出提示组件，标题超出容器时显示省略号，并在悬停时展示完整标题。

## 用法

```tsx
<TitleWithTooltip text={post.title} />
```

## 说明

- 仅当文本溢出时显示 tooltip。
- 使用 `ResizeObserver` 监听容器宽度变化。
