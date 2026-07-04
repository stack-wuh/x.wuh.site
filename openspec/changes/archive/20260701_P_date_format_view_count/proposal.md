# 日期格式优化 + 浏览数替换评论数

## 背景

当前首页/博客列表展示 "月份缩写 日" 格式 + 评论数，详情页展示固定 "发布于 2025 Jan 1, N条评论" 格式。体验不友好。

## 目标

- 首页/博客列表：日期改为 MM-dd 格式，评论数改为浏览量（占位）
- 博客详情页：智能日期格式 + 浏览量
  - 1天内 → "X小时前发布"
  - 1周内 → "X天前发布"
  - 1月内 → "MM月dd日发布"
  - 超1月 → "YYYY年MM月dd日"
- `PostListItem.comments` 改为 `PostListItem.views`，前端各处同步

## 非目标（明确不做）

- 不实现真实的浏览量计数
- 不修改后端 API（views 字段暂用 0 占位）

## 影响范围

- `packages/shared-contracts/src/index.ts` — PostListItem.comments → views
- `packages/wuh.site.next/app/HomeView.tsx` — 日期 MM-dd + views
- `packages/wuh.site.next/app/blog/BlogListView.tsx` — 日期 MM-dd + views
- `packages/wuh.site.next/app/blog/page.tsx` — mapContentToPost 映射 views
- `packages/wuh.site.next/app/post/components/PostHeader.tsx` — 智能日期 + views
