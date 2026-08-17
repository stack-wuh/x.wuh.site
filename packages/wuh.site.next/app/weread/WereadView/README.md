# WereadView

微信读书书架业务组件，负责展示本页书籍、阅读状态统计和分页入口。

## 用法

```tsx
<WereadView books={books} total={total} currentPage={page} totalPages={totalPages} />
```

## 说明

- `books` 使用 `WereadBook[]`。
- 组件内部按 `finishReading` 计算在读和已读数量。
- 样式从 `styles/index.tsx` 统一导出。
