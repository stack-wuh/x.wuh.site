# SEO P1.5 Article Topic Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将文章详情页标签链接改为站内主题页链接，并让 Alert 内部链接不再强制新窗口打开。

**Architecture:** PostView 使用 `buildTopicUrl` 生成标签 href；Alert 组件根据 href 是否外部决定 target/rel，保留外部链接安全属性。

**Tech Stack:** React、Next.js、styled-components、Node source regression tests。

---

## 文件结构

- Modify: `packages/wuh.site.next/app/post/PostView.tsx` — 标签 href 指向 `/topics/[label]`。
- Modify: `packages/components/alert/index.tsx` — 标签链接 target/rel 按内部/外部区分。
- Create: `packages/wuh.site.next/test/seo-p15-article-topic-links.test.mjs` — 回归测试。

## Steps

- [ ] 写失败测试：PostView 使用 `buildTopicUrl(label.name)`，不再构造 GitHub issue label query。
- [ ] 写失败测试：Alert 具有 `isExternalHref`，LabelLink target/rel 根据外部链接条件设置。
- [ ] 实现 PostView 标签内链化。
- [ ] 实现 Alert 内外链 target/rel 策略。
- [ ] 跑全部前端测试、Oxlint、diff check，尝试 TypeScript 并记录 SIGSEGV。
- [ ] 提交、推送并创建 base `codex/seo-p14` 的链式 PR，更新 #246。
