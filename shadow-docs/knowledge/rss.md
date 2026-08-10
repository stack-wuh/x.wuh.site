---
title: RSS 订阅
domain: seo
keywords: [RSS, feed, 自动发现, canonical URL, 订阅, XML]
scope:
  - packages/wuh.site.nest/src/modules/rss
  - packages/wuh.site.next/app/layout.tsx
status: active
source:
  - changes/archive/20260628_P_rss_fix_and_entry/brief.md
verified: 2026-08-08
---

# RSS 订阅

## 当前结论

RSS feed 仅输出 `state: 'open'` 的内容。item link 格式为 `https://wuh.site/post/<number>-<title-slug>`（与博客 SEO canonical URL 一致）。

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
