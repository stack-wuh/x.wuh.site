# SEO P1.7 CollectionPage Structured Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为主题页和归档页输出 CollectionPage / ItemList JSON-LD。

**Architecture:** 扩展现有 `structured-data.ts` 纯 builder，接收集合 URL、名称、描述和 canonical 条目。主题页与归档页在服务端获得 posts 后调用 builder 并通过现有 JsonLd 组件输出。

**Tech Stack:** Next.js、Schema.org JSON-LD、TypeScript、Node test runner。

---

## 文件结构

- Modify: `packages/wuh.site.next/app/lib/structured-data.ts` — CollectionPage builder。
- Modify: `packages/wuh.site.next/app/topics/[label]/page.tsx` — 输出 topic collection JSON-LD。
- Modify: `packages/wuh.site.next/app/archive/page.tsx` — 输出 archive collection JSON-LD。
- Create: `packages/wuh.site.next/test/seo-p17-collection-pages.test.mjs` — builder 与页面回归测试。

## Steps

- [ ] 写失败测试：builder 返回 `CollectionPage`、`ItemList`、递增 position、canonical item URL。
- [ ] 实现 `createCollectionPageStructuredData`。
- [ ] 写失败测试：topic/archive 页面调用 builder 和 JsonLd。
- [ ] 在两页输出对应 JSON-LD。
- [ ] 跑全部测试、Oxlint、TypeScript、diff check。
- [ ] 提交、推送，创建 base `codex/seo-p16` 的链式 PR 并更新 #250。
