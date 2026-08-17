# PostView

博客详情视图组件，组合文章头部、封面、正文、评论和悬浮操作。

## 用法

```tsx
<PostView issue={issue} prevIssue={prev} nextIssue={next} total={total} position={position} />
```

## 说明

- `PostViewProps` 和 `Issue` 类型定义在 `PostView.types.ts`。
- 样式从 `post/styles` 共享导出，子组件在 `post/components/`。
