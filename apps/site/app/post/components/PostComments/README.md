# PostComments

博客详情评论区组件，支持加载评论、发表匿名评论和 GitHub 评论标记。

## 用法

```tsx
<PostComments issueNumber={issue.number} />
```

## 说明

- 通过 `/api/comments` 加载和提交评论。
- 昵称保存到 localStorage。
