---
title: 分页器
domain: components
keywords: [分页器, W-u-H, 字母分页, 窗口裁剪, 导航按钮, exports map]
scope:
  - packages/components/pagination
  - packages/wuh.site.next/app/blog
status: active
source:
  - changes/archive/20260607-P-分页器重新设计/brief.md
verified: 2026-08-08
---

# 分页器

## 当前结论

W-u-H 字母式分页：W 链接到第 1 页，中间页码用 'u' 字母链接，H 链接到最后一页。当前页码对应的字母替换为该数字，颜色为 `--primary-color`，其余字母为 `--text-muted`。

总页数超过 5 页时仅展示当前页 +-2 范围的 'u' 字母，超出范围用 `...` 省略号替代。总页数 <= 5 时不显示省略号。左右显示"上一页/下一页"导航链接，首页禁用"上一页"，末页禁用"下一页"。总页数 <= 1 时返回 null 不渲染任何 DOM。

组件通过 `@wuh.site/components/pagination` 的 exports map 导出。博客列表已用此组件替换内联分页实现，使用 `shared-contracts` 的 `PaginationMeta` 类型。

## 执行约束

- 分页必须保留当前查询参数、正确处理首末页和总页数不超过 1 的隐藏逻辑；W-u-H 展示不得改变链接语义。

## 适用边界

只约束分页组件和博客分页消费者，不约束无限滚动。

## 验证方式

用总页数 1、5、6 及首/中/末页输入检查 href、disabled 和省略号范围。

## 关联知识

- [blog category filter](./blog-category-filter.md)
- [guestbook virtual scroll](./guestbook-virtual-scroll.md)
