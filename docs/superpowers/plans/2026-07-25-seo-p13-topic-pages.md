# SEO P1.3 Topic Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增稳定可索引的 `/topics/[label]` 主题聚合页，并让博客列表标签链接进入主题页。

**Architecture:** 通过纯工具函数集中处理 topic URL 编解码；新增 server route `app/topics/[label]/page.tsx` 获取单标签文章并输出 SEO metadata；复用博客样式渲染主题页内容；博客列表中的标签包裹为内部链接。

**Tech Stack:** Next.js App Router、TypeScript、Node test runner、styled-components。

---

## 文件结构

- Create: `packages/wuh.site.next/app/lib/topic-url.ts` — 主题 URL 编解码。
- Create: `packages/wuh.site.next/app/topics/[label]/page.tsx` — 可索引主题页。
- Modify: `packages/wuh.site.next/app/blog/BlogListView.tsx` — 标签链接到主题页。
- Modify: `packages/wuh.site.next/app/blog/styles/index.ts` — 标签链接样式。
- Create: `packages/wuh.site.next/test/topic-url.test.mjs` — topic URL 工具测试。
- Create: `packages/wuh.site.next/test/seo-p13-topic-pages.test.mjs` — 页面和入口回归测试。

## Task 1: Topic URL 工具

- [ ] 写失败测试：`buildTopicUrl('Next.js SEO') === '/topics/Next.js%20SEO'`，`decodeTopicParam('Next.js%20SEO') === 'Next.js SEO'`。
- [ ] 实现 `buildTopicUrl` 和 `decodeTopicParam`。
- [ ] 重跑测试确认通过。

## Task 2: 主题页路由

- [ ] 写失败测试：断言 `app/topics/[label]/page.tsx` 包含 `generateMetadata`、`alternates.canonical`、`contentService.getPosts.server`、`buildPostUrl`、`decodeTopicParam`。
- [ ] 实现路由：按单标签获取 open posts，metadata 使用 `/topics/${encoded}` canonical，渲染主题说明、数量和文章列表。
- [ ] 重跑测试确认通过。

## Task 3: 博客标签入口

- [ ] 写失败测试：断言 `BlogListView` 使用 `buildTopicUrl(label.name)` 包裹 `Tag`。
- [ ] 将文章列表里的 Tag 包裹为 `PostTagLink`。
- [ ] 增加样式，避免破坏 Tag 外观。
- [ ] 重跑测试确认通过。

## Task 4: 验证与提交

- [ ] 运行全部 `packages/wuh.site.next/test/*.test.mjs`。
- [ ] 运行 oxlint 与 `git diff --check`。
- [ ] 尝试 TypeScript，记录当前隔离环境 SIGSEGV 如仍复现。
- [ ] 提交、推送 `codex/seo-p13`，创建 base `codex/seo-p12` 的链式 PR 并更新 #240。
