# PostCover

博客详情封面组件，有封面图时渲染 `cover` 语义图片。

## 用法

```tsx
<PostCover src={issue.metadata?.cover} alt={issue.title} />
```

## 说明

- `src` 为空时返回 `null`。
