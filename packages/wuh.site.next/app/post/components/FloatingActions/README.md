# FloatingActions

博客详情悬浮操作按钮组，提供返回首页、回到顶部和点赞。

## 用法

```tsx
<FloatingActions issueNumber={issue.number} initialLikeCount={issue.likeCount} initialLiked={issue.liked} />
```

## 说明

- 点赞调用 `/api/content/posts/:number/like`。
