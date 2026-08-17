# Pagination

分页导航组件，展示上一页/下一页、首尾页和中间页码范围。

## 用法

```tsx
<Pagination currentPage={1} totalPages={10} getPageUrl={(page) => `/blog?page=${page}`} />
```

## 关键 Props

- `currentPage`：当前页码。
- `totalPages`：总页数。
- `getPageUrl`：根据页码生成链接。
