# SEO P1.6 Archive Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 `/archive` 博客归档页，并将其纳入 sitemap 和博客页入口。

**Architecture:** 归档页作为 server component 分页读取所有 open posts，按年份分组展示。复用 blog 样式与 canonical post/topic URL 工具，避免新增复杂 UI 或后端接口。

**Tech Stack:** Next.js App Router、Metadata API、Node test runner、styled-components。

---

## 文件结构

- Create: `packages/wuh.site.next/app/archive/page.tsx` — 归档页面。
- Modify: `packages/wuh.site.next/app/lib/sitemap.ts` — 增加 `/archive` 静态 sitemap 路由。
- Modify: `packages/wuh.site.next/app/blog/BlogListView.tsx` — 增加归档入口。
- Create: `packages/wuh.site.next/test/seo-p16-archive-page.test.mjs` — 回归测试。

## Steps

- [ ] 写失败测试：`buildStaticSitemapRoutes` 包含 `/archive`。
- [ ] 写失败测试：`archive/page.tsx` 包含 metadata、canonical、分页读取、`buildPostUrl` 与 `buildTopicUrl`。
- [ ] 写失败测试：博客页头部包含 `/archive` 入口。
- [ ] 实现 `/archive` 页面。
- [ ] 更新 sitemap 静态路由。
- [ ] 更新 BlogListView header actions。
- [ ] 跑全部测试、Oxlint、TypeScript、diff check。
- [ ] 提交、推送并创建 base `codex/seo-p15` 的链式 PR，更新 #248。
