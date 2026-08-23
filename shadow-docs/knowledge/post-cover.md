---
title: 博客封面图
domain: blog
keywords: [封面图, metadata, HTML注释, 移动端封面, 桌面端封面, 封面回退, 封面动效, 生成式封面, 无封面]
scope:
  - apps/site/app/post/components/PostCover
  - apps/site/app/post/styles/post-header.ts
  - apps/site/app/post/PostView/index.tsx
status: active
source:
  - changes/archive/2026-07-05-P-add-post-cover-image/brief.md
  - changes/archive/2026-07-19-P-post-cover-redesign/brief.md
  - changes/archive/2026-07-25-P-semantic-image-roles/brief.md
  - changes/20260823-feature-post-cover-redesign/brief.md
verified: 2026-08-23
---

# 博客封面图

## 当前结论

封面通过 GitHub Issue 正文中的 HTML 注释元数据声明：`<!-- cover: <URL> -->`，可选 `coverAlt`。该注释不作为可见内容展示。同步时保存为 `metadata.cover`。

显式封面与正文图片独立：正文首张图片保持为文章内容，不因封面展示被移除。仅在封面回退场景（未声明显式封面，从正文首图推导）时，从正文中移除该图片避免重复。

**有封面图时**：封面渲染为 16:9「杂志卡」——1px 主题色细边框 + 12px 圆角 + 底部轻渐变过渡（40% 黑 → 40% 透明，不压暗图片主体）。封面不承载元信息（日期/标签/浏览量由 PostHeader 展示，避免重复）。图片加载失败时隐藏封面区域，不保留破图区域，PostHeader 正常展示。

**无封面图时**：渲染纯 CSS 生成式封面，承载完整文章头图——主题渐变背景 + 山峦装饰线 + h1 标题 + 摘要（有 summary 时）+ 作者行（名字/日期/浏览量）+ 落款「wuh.site」。此时 PostHeader 不再渲染，避免双标题；生成式标题是页面唯一 h1。无 title 时不渲染封面区域。

移动端（< 768px）封面铺满横向宽度（-24px 两侧出血），高度由 clamp 限制，无圆角与左右边框。封面动效为短暂淡入和极轻微缩放，`prefers-reduced-motion: reduce` 时不播放。

## 执行约束

- 显式 metadata 封面不得删除正文首图；只有首图 fallback 才从正文移除对应图片；加载失败不得保留破图区域。
- 有封面时 PostHeader 正常渲染；无封面时生成式封面承载 Header 信息，PostHeader 不重复渲染，页面 h1 保持唯一。

## 适用边界

不约束列表缩略图的裁切策略。

## 验证方式

检查 PostCover 的有图/无图/加载失败三分支，验证移动端出血、reduced-motion 样式与 h1 唯一性（有图由 PostHeader 提供 h1，无图由生成式封面提供）。

## 关联知识

- [blog detail](./blog-detail.md)
- [components](./components.md)
