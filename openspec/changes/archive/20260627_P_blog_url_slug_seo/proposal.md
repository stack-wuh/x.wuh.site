# 博客 URL 添加标题 slug 提升 SEO

## 背景

当前博客详情页 URL 格式为 `/post/123`，仅包含文章编号。搜索引擎和用户无法从 URL 中获取内容信息，不利于 SEO 排名和用户分享体验。

## 目标

- 博客详情页 URL 包含文章标题 slug，格式为 `/post/123-标题slug`
- 首页、博客列表页、详情页导航中的链接全部使用新 URL 格式
- 不改变路由结构，不改变后端 API

## 非目标（明确不做）

- 不改变 Next.js 路由目录结构
- 不添加服务端重定向逻辑
- 不处理历史 URL 的 301（后续迭代）
- 不修改 API 接口

## 影响范围

- `packages/wuh.site.next/app/post/[number]/page.tsx` — param 解析从数字改为 "数字-标题slug"
- `packages/wuh.site.next/app/HomeView.tsx` — 博客链接加 slug
- `packages/wuh.site.next/app/blog/BlogListView.tsx` — 博客链接加 slug
- `packages/wuh.site.next/app/post/components/PostToolbar.tsx` — 上下篇导航链接加 slug
- `packages/wuh.site.next/app/lib/slug.ts` — 新增 slug 工具函数
