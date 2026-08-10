---
title: 博客封面图
domain: blog
keywords: [封面图, metadata, HTML注释, 移动端封面, 桌面端封面, 封面回退, 封面动效]
scope:
  - packages/wuh.site.nest/src/modules/content/content-cover.util.ts
  - packages/wuh.site.nest/src/modules/content/content-metadata.util.ts
  - packages/wuh.site.next/app/post
status: active
source:
  - changes/archive/2026-07-05-P-add-post-cover-image/brief.md
  - changes/archive/2026-07-19-P-post-cover-redesign/brief.md
  - changes/archive/2026-07-25-P-semantic-image-roles/brief.md
verified: 2026-08-08
---

# 博客封面图

## 当前结论

封面通过 GitHub Issue 正文中的 HTML 注释元数据声明：`<!-- cover: <URL> -->`，可选 `coverAlt`。该注释不作为可见内容展示。同步时保存为 `metadata.cover`。

显式封面与正文图片独立：正文首张图片保持为文章内容，不因封面展示被移除。仅在封面回退场景（未声明显式封面，从正文首图推导）时，从正文中移除该图片避免重复。正文无图片时正常渲染，不保留空封面区域。

移动端（< 768px）封面铺满横向宽度，高度由最小值、响应式值和最大值共同限制。桌面端（>= 768px）封面保持在阅读栏内，不跨越目录栏，使用固定横向展示区域与高度上限。封面动效为短暂淡入和极轻微缩放，`prefers-reduced-motion: reduce` 时不播放。

## 执行约束

- 显式 metadata 封面不得删除正文首图；只有首图 fallback 才从正文移除对应图片；无封面或加载失败不得保留破图区域。

## 适用边界

不约束列表缩略图的裁切策略。

## 验证方式

运行 content cover/metadata 现有 spec，并检查 PostCover 的移动端、桌面端和 reduced-motion 样式。

## 关联知识

- [blog detail](./blog-detail.md)
- [components](./components.md)
