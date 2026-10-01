---
title: RSS 订阅
domain: seo
keywords: [RSS, feed, 自动发现, canonical URL, 订阅, XML]
scope:
  - apps/server/src/modules/rss
  - apps/site/app/layout.tsx
status: active
source:
  - changes/archive/20260628_P_rss_fix_and_entry/brief.md
  - changes/20261002-fix-rss-feed-format/brief.md
verified: 2026-10-02
verified-depth: runtime
verified-scope: apps/server/src/modules/rss、生产 /api/rss.xml
---

# RSS 订阅

## 当前结论

RSS feed 仅输出 `state: 'open'` 的内容。item link/guid 格式为 `https://wuh.site/post/<number>`（纯数字 canonical；guid 即永久链接 URL，不再输出裸数字 id）。

item description 为**纯文本**：CMS summary 优先，缺失时经 `stripMarkdownToText`（apps/server/src/modules/rss/rss.utils.ts）剥离 Markdown 字面量后截断 200 字——原始 Markdown 会以 `##`、`![]()` 字面量出现在阅读器（2026-10-02 修复前 19/20 item 中招）。`content:encoded` 的 body 回落同样剥离。copyright 动态计算 `© 2021–<当前年> wuh.site`，与页脚 copyrightYears 语义一致。

全站 `<head>` 包含 RSS 自动发现标签 `<link rel="alternate" type="application/rss+xml" ...>`，页脚提供 RSS 订阅入口链接。

## 执行约束

- Feed 只输出 open 内容，item URL 与 canonical 的带 slug 路由一致；全站 head 和页脚保留订阅入口。

## 适用边界

不约束站内普通博客列表排序。

## 验证方式

请求 RSS 输出并检查 closed 内容缺失、item link 格式、layout 的 alternate link 和页脚入口。

## 关联知识

- [seo](./seo.md)
- [blog detail](./blog-detail.md)
