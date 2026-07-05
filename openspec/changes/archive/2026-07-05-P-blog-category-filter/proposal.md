# 博客列表新增分类查询

## 背景

当前博客列表页只支持按创建时间倒序分页展示全部 open 状态博客，用户无法按分类快速筛选内容。文章数据来源于 GitHub Issues，列表项已经展示 labels，后端内容接口也已支持 `labels` 查询参数，但前端 `/blog` 页面尚未提供分类查询入口，导致标签信息没有形成可操作的浏览路径。

## 目标

- 在 `/blog` 页面新增 GitHub Issues 风格的分类过滤条，提供清晰的分类查询入口。
- 基于现有 Issue labels 做单分类筛选，并将筛选状态写入 URL，支持分享和刷新保持状态。
- 提供 open 博客 labels 汇总能力，让分类入口展示完整可选分类，而不是只展示当前页标签。
- 分类筛选与分页联动：切换分类重置到第 1 页，分页链接保留当前分类参数。
- 保持当前博客列表按创建时间倒序、按年份分组、GitHub 风格视觉一致性。

## 非目标（明确不做）

- 不新增独立分类数据模型或后台分类管理能力。
- 不修改后端 `GET /content/posts` 的 labels 查询语义。
- 不实现全文搜索、排序切换、多标签组合筛选或标签管理。
- 不改变博客详情页、首页文章入口或 RSS 输出逻辑。

## 影响范围

- `packages/wuh.site.next/app/blog/page.tsx` — 解析 `labels` 查询参数，请求博客列表时传入 labels，并向视图传递当前分类状态。
- `packages/wuh.site.next/app/blog/BlogListView.tsx` — 新增分类过滤条渲染、清除筛选、分页 URL 保留分类参数。
- `packages/wuh.site.next/app/blog/styles/index.ts` — 新增 GitHub Issues 风格过滤条、筛选 token、响应式布局样式。
- `packages/wuh.site.nest/src/modules/content/content.controller.ts` — 新增 labels 汇总接口，供博客分类入口使用。
- `packages/wuh.site.nest/src/modules/content/content.service.ts` — 基于现有 Content labels 聚合 open 博客标签。
- `packages/shared-contracts/src/index.ts` — 如需要，补充前端分页/标签视图类型；优先复用现有 `PostListItem` 与 `PaginationMeta`。
- `openspec/specs/blog-category-filter/spec.md` — 新增博客分类查询交互规范。
