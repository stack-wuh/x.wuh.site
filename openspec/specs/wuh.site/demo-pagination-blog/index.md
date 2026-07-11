---
component: Pagination
keywords:
  - Pagination
  - pagination
  - 分页
  - pager
  - page
  - navigate
  - 翻页
  - blog
  - list
  - 博客
  - 列表
  - page navigation
  - 页码导航
  - footer
  - bottom
  - 底部
  - current page
  - 当前页
  - total pages
  - 总页数
  - W
  - U
  - H
related: [demo-blog-list, demo-empty-state]
hooks: []
---

## 博客列表分页

在博客列表、搜索结果等数据分页场景中，提供 WUH 字母图标风格的分页导航。

`totalPages <= 1` 时自动不渲染。

### 使用方式

```tsx
import Pagination from '@wuh.site/components/pagination'
```

### Props 说明

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `currentPage` | `number` | 当前页码（从 1 开始） |
| `totalPages` | `number` | 总页数 |
| `getPageUrl` | `(page: number) => string` | 生成页码链接 |

### 注意事项

- `getPageUrl` 返回链接字符串，组件内部渲染为 `<a>`，配合 Next.js 可实现客户端导航
- 总页数少于等于 5 时全部展示，超过时用省略号折叠
- 移动端自动压缩间距和字号
