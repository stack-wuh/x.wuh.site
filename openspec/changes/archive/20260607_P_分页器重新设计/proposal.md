# 分页器重新设计

## 动机

博客列表页的分页逻辑目前内联在 `BlogListView.tsx`（约 160 行），包括样式组件和页码计算逻辑。分页器风格为纯数字 + 上一页/下一页，视觉效果一般。需要：

1. 提取为独立可复用组件 `Pagination`
2. 仿照 Google 经典搜索页 "Goooooogle" 字母式分页，使用 `W-u-u-u-u-u-H` 字母载体实现独特的翻页体验

## 变更范围

- **新增**: `packages/components/pagination/` — 分页器组件
- **修改**: `packages/wuh.site.next/app/blog/BlogListView.tsx` — 替换内联分页为 Pagination 组件
- **修改**: `packages/wuh.site.next/app/blog/loading.tsx` — 骨架屏适配新分页器

## 非目标

- 不修改后端 API 分页格式
- 不新增页码参数类型（复用 `shared-contracts` 的 `PaginationMeta`）
- 不在博客详情页添加分页

## 影响

- **前端**: 组件包新增分页器，博客列表页消费
- **后端**: 无影响
