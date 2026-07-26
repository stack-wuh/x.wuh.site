# SEO 内容发现与站内导航

## 背景

`docs/superpowers/plans/` 中保存了 2026-07-23 至 2026-07-25 的 SEO P0、P1 与 P1.2–P1.7 实施计划。这些计划共同定义了文章 URL 规范化、结构化数据、相关文章、主题页、归档页、sitemap 与索引策略，但尚未形成统一的 OpenSpec 规范。

本变更将这些历史计划迁移为可长期维护的需求制品。已单独归档的“阅读余韵索引”视觉设计不重复迁移，仅保留相关文章的数据发现与站内链接契约。

## 目标

- 统一文章 canonical URL、永久重定向、ISR、全局 metadata 与 sitemap 抓取策略。
- 为站点、作者、文章、面包屑及集合页提供一致的 Schema.org JSON-LD。
- 提供最多三篇、去重且按相关度排序的相关文章。
- 建立可索引的 `/topics/[label]` 主题页与 `/archive` 年份归档页。
- 将主题页和归档页加入 sitemap，并让旧 query 筛选页保持 noindex/follow。
- 将文章标签与博客标签入口统一指向站内主题页。

## 非目标（明确不做）

- 不重复定义已归档的相关文章视觉表现层。
- 不新增后端 API；复用现有内容分页、标签查询与标签汇总接口。
- 不改变 GitHub Issues 作为 CMS 的数据来源。
- 不引入新的 SEO SaaS、分析平台或第三方依赖。

## 影响范围

- `packages/wuh.site.next/app/` — metadata、文章页、主题页、归档页、sitemap、结构化数据和站内导航。
- `packages/components/alert/` — 内部链接与外部链接的打开策略。
- 影响规范：`seo`、`blog-detail`。
