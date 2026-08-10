---
title: 博客分类筛选
domain: blog
keywords: [博客分类, 标签筛选, labels, 过滤条, 分页联动, AND语义]
scope:
  - packages/wuh.site.next/app/blog
  - packages/wuh.site.nest/src/modules/content
  - /blog?labels=
status: active
source:
  - changes/archive/2026-07-05-P-blog-category-filter/brief.md
  - changes/archive/2026-07-05-P-blog-multi-label-filter/brief.md
verified: 2026-08-08
---

# 博客分类筛选

## 当前结论

博客列表支持按 labels 分类筛选，URL 格式为 `/blog?labels=<label>`。多标签使用 AND 语义（仅展示同时包含全部已选标签的文章），URL 为 `/blog?labels=a&labels=b`。筛选状态可通过 URL 分享，服务端渲染时保留全部查询参数。

分类入口展示 open 状态博客的标签汇总，每个标签格式为 `label(+count)`。已选外部 token 只展示标签名。筛选与分页联动：翻页保留 labels 参数，切换分类重置分页到第 1 页。多个筛选 token 可单独移除，最后一个 token 移除后回到 `/blog`。

过滤条使用 GitHub Issues 风格，背景、hover、token 状态与站点主题色一致，不展示结果提示文案。

## 执行约束

- labels 必须保存在 URL 中，多标签保持 AND 语义；分页切换不得丢失已选 labels。

## 适用边界

不约束 `/topics/[label]` SEO 聚合页的展示布局。

## 验证方式

检查 Blog 列表 searchParams 解析和 Content 查询条件，验证 `labels=a&labels=b&page=2` 保留全部筛选。

## 关联知识

- [content api](./content-api.md)
- [seo](./seo.md)
