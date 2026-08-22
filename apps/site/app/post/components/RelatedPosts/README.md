# RelatedPosts

相关文章推荐组件，根据当前文章标签拉取同题文章。

## 用法

```tsx
<RelatedPosts number={issue.number} labels={issue.labels.map((l) => l.name)} />
```

## 说明

- 无相关文章时返回 `null`。
- 最多使用前 3 个标签匹配。
