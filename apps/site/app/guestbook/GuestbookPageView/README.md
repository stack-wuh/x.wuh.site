# GuestbookPageView

留言板列表业务组件，负责展示留言、空状态和分页入口。

## 用法

```tsx
<GuestbookPageView comments={comments} pagination={pagination} currentPage={page} />
```

## 说明

- `comments` 是页面层归一化后的留言列表。
- `pagination.totalPages > 1` 时展示分页器。
- 样式从 `styles/index.tsx` 统一导出。
