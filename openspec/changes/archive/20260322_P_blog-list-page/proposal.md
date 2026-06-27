# 博客列表页

## 为什么做

首页无法看到所有博客，需要新增博客列表页，支持分页浏览所有文章。

## 做什么

- 首页新增入口，点击进入 `/blog` 博客列表页
- 列表页支持分页（每页 10 条，URL 参数 `?page=`）
- 按博客创建时间倒序排列
- 沿用首页卡片风格与间距
- 数据来源 GitHub Issues API

## 影响范围

- `packages/wuh.site.next/app/blog/page.tsx` — 新增
- `packages/wuh.site.next/app/HomeView.tsx` — 添加入口
