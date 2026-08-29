---
title: 博客代码高亮
domain: blog
keywords: [代码高亮, 语法高亮, 服务端渲染, shiki, 双主题, 主题适配, SSR]
scope:
  - packages/wuh.site.next/app/lib/markdown.ts
  - packages/wuh.site.next/app/post
status: active
source:
  - changes/archive/20260510_B_blog-code-highlighting/brief.md
  - changes/20260830-P-shiki-highlighting/brief.md
verified: 2026-08-30
---

# 博客代码高亮

## 当前结论

代码块语法高亮在服务端完成，使用 Shiki（`@shikijs/rehype`，TextMate 语法，VS Code 同款），双主题 `github-light` / `github-dark`，`defaultColor: false` 输出 `--shiki-light` / `--shiki-dark` / `--shiki-light-bg` / `--shiki-dark-bg` 变量。双主题切换用 `[data-color-scheme="dark"] &` 选择器（跟随站点主题，而非系统 `prefers-color-scheme`）。代码块背景用项目主题 `--atom-pre-bg`，仅 token 字色用 Shiki 高亮。复制按钮为独立 DOM 功能（读 `pre code` 文本），迁移不受影响。

## 执行约束

- 高亮必须在服务端 Markdown 渲染阶段完成；不得重新依赖客户端 CDN，并保持语言标签和主题对比度。

## 适用边界

不约束普通行内 code 的组件外观。

## 验证方式

检查 Markdown renderer 的高亮插件和文章详情代码块样式，确认页面源码无需 highlight.js CDN。

## 关联知识

- [blog detail](./blog-detail.md)
- [design system](./design-system.md)
