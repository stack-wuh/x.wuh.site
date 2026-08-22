# BlogListView

博客列表业务组件，负责展示分类筛选、按年份分组的文章列表和分页入口。

## 用法

```tsx
<BlogListView
  posts={posts}
  pagination={pagination}
  activeLabels={activeLabels}
  availableLabels={labels}
/>
```

## 说明

- `posts` 使用 `PostListItem[]`。
- `pagination` 至少需要 `currentPage` 和 `lastPage`。
- 样式从 `styles/index.tsx` 统一导出。
