# PostCover

博客详情封面组件。有封面图时渲染「杂志卡」（细边框 + 底部轻渐变过渡）；无封面图时渲染生成式封面，承载完整文章头图（标题/摘要/作者/日期/浏览量/落款）。

## 用法

```tsx
<PostCover src={issue.metadata?.cover} alt={issue.metadata?.coverAlt || issue.title} />

// 无封面图时（PostHeader 不再重复渲染）
<PostCover
  src={null}
  alt={issue.title}
  title={issue.title}
  authorName={userName}
  createdAt={issue.created_at}
  viewCount={issue.viewCount}
  summary={issue.metadata?.summary}
/>
```

## 说明

- `src` 有值时：16:9 圆角卡 + 主题色细边框 + 底部轻渐变过渡（不压暗图片主体）；加载失败时隐藏，不保留破图区域。
- `src` 为空时：生成式封面（主题渐变背景 + 山峦装饰线 + h1 标题 + 摘要 + 作者行 + 落款「wuh.site」），标题为空时不渲染。
- 封面不承载 PostHeader 已有的元信息（日期/标签/浏览量由 PostHeader 展示，避免重复）。
