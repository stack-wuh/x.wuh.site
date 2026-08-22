# PostToolbar

博客详情底部工具栏，展示上一篇/下一篇导航和当前文章位置。

## 用法

```tsx
<PostToolbar prevIssue={prev} nextIssue={next} total={total} position={position} />
```

## 说明

- `prevIssue` / `nextIssue` 为相邻文章，为空时渲染禁用态。
