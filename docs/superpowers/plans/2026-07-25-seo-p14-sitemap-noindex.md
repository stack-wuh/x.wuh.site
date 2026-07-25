# SEO P1.4 Sitemap and Noindex Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `/topics/[label]` 纳入 sitemap 主动发现，并让旧 `/blog?labels=` 筛选页 noindex/follow。

**Architecture:** `app/lib/sitemap.ts` 新增 topic sitemap entry builder；`app/sitemap.ts` 拉取 label summaries 并追加 topic entries；`app/blog/page.tsx` 改为 `generateMetadata`，根据 searchParams 决定 robots/canonical。

**Tech Stack:** Next.js Metadata API、Next MetadataRoute.Sitemap、Node test runner。

---

## 文件结构

- Modify: `packages/wuh.site.next/app/lib/sitemap.ts` — topic sitemap entry builder。
- Modify: `packages/wuh.site.next/app/sitemap.ts` — 拉取 labels 并输出 topic sitemap entries。
- Modify: `packages/wuh.site.next/app/blog/page.tsx` — 动态 metadata：query label noindex/follow。
- Create: `packages/wuh.site.next/test/seo-p14-sitemap-noindex.test.mjs` — 回归测试。

## Task 1: topic sitemap builder

- [ ] 测试 `buildTopicSitemapEntry({ name: 'Next.js' }).url === 'https://wuh.site/topics/Next.js'`。
- [ ] 实现 builder，使用 `buildTopicUrl`。

## Task 2: sitemap 拉取 labels

- [ ] 源码测试断言 `app/sitemap.ts` 使用 `getLabels.server`、`buildTopicSitemapEntry`，且不拼接 query URL。
- [ ] 实现 `getOpenLabels()`，异常显式 throw。
- [ ] 输出 static + topic + post routes。

## Task 3: blog query noindex

- [ ] 测试断言 `app/blog/page.tsx` 使用 `generateMetadata`，并包含 active labels 判断、`index: false`、`follow: true`。
- [ ] 将静态 `metadata` 改为 `generateMetadata`。
- [ ] 无 labels：保持 index/follow；page > 1 canonical 使用 `/blog?page=N`；有 labels：canonical `/blog` 且 noindex/follow。

## Task 4: verify, commit, PR

- [ ] 运行全部前端测试、Oxlint、diff check。
- [ ] 尝试 TypeScript，记录隔离环境 SIGSEGV。
- [ ] 提交、推送 `codex/seo-p14`，创建 base `codex/seo-p13` 的链式 PR，更新 #243。
