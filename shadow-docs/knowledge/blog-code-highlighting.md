---
title: 博客代码高亮
domain: blog
keywords: [代码高亮, 语法高亮, 服务端渲染, highlight.js, 主题适配, SSR]
scope:
  - packages/wuh.site.next/app/lib/markdown.ts
  - packages/wuh.site.next/app/post
status: active
source:
  - changes/archive/20260510_B_blog-code-highlighting/brief.md
verified: 2026-08-08
---

# 博客代码高亮

## 当前结论

代码块语法高亮在服务端完成，不再依赖客户端 CDN 加载 highlight.js。高亮样式需适配当前站点的亮色与暗色主题。同时确保代码块现有功能（行号、语言标签等）在迁移后不受影响。

## 执行约束

- 高亮必须在服务端 Markdown 渲染阶段完成；不得重新依赖客户端 CDN，并保持语言标签和主题对比度。

## 适用边界

不约束普通行内 code 的组件外观。

## 验证方式

检查 Markdown renderer 的高亮插件和文章详情代码块样式，确认页面源码无需 highlight.js CDN。

## 关联知识

- [blog detail](./blog-detail.md)
- [design system](./design-system.md)
