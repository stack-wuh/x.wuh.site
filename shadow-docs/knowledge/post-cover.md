---
title: 博客封面图
domain: blog
keywords: [封面图, metadata, HTML注释, 移动端封面, 桌面端封面, 封面回退, 封面动效, 生成式封面, 无封面, 导语区去重, 封面重复, wuh-site-metadata]
scope:
  - apps/site/app/post/components/PostCover
  - apps/site/app/post/styles/post-header.ts
  - apps/site/app/post/PostView/index.tsx
  - apps/site/app/lib/postLeadDedupe.ts
  - apps/server/src/modules/content
status: active
source:
  - changes/archive/20260705-P-add-post-cover-image/brief.md
  - changes/archive/20260719-P-post-cover-redesign/brief.md
  - changes/archive/20260725-P-semantic-image-roles/brief.md
  - changes/archive/20260823-feature-post-cover-redesign/brief.md
  - changes/20261008-fix-post-cover-lead-dedupe/brief.md
verified: 2026-10-08
---

# 博客封面图

## 当前结论

封面通过 GitHub Issue 正文中的元数据注释声明：`<!-- wuh-site-metadata: {"cover": URL, "summary": …, "keywords": […], "coverAlt": …} -->`。同步时解析存为 `metadata.cover`，API 出口剥离注释，不作为可见内容展示（历史 `<!-- cover: <URL> -->` 语法已非实现形态）。

文档标准结构（全站文章确认的产出形态，存量自 #65 即常见）：正文首行为与文章标题同名的大标题、紧随内嵌封面图（与 `metadata.cover` 同 URL）、文末元数据注释。该结构与详情页 chrome（PostHeader h1 + PostCover 杂志卡）叠加会造成首屏图 ×2、标题 ×3，按下述两层规则收编。

**显式封面（有 metadata.cover）**：数据层保持独立——正文首图原样保留于 GitHub body / MongoDB / RSS，不因封面展示被服务端移除。渲染层「导语区去重」（`apps/site/app/lib/postLeadDedupe.ts`，SSR 纯字符串运算，与排印变换同一确定性纪律）：导语区（首个实质段落之前的块组）内与封面 URL 归一化相等的正文 `<img>` 移除（空壳段落整块删、混排段落仅删图），导语区首个剥离手写编号前缀后与文章标题等强的 heading 移除；导语区之后出现的同 URL 配图不动（正文合理复用）。

**无显式封面**：后端 `withDerivedCover`（content.controller + content-cover.util.extractFirstImageAndClean）将正文首图升格为派生封面并同步从 body/bodyHtml 移除——此场景前端去重天然 no-op，两层不叠加。无图可派生时渲染纯 CSS 生成式封面，承载完整文章头图——主题渐变背景 + 山峦装饰线 + h1 标题 + 摘要（有 summary 时）+ 作者行（名字/日期/浏览量）+ 落款「wuh.site」。此时 PostHeader 不再渲染，避免双标题；生成式标题是页面唯一 h1。无 title 时不渲染封面区域。

**有封面图时**：封面渲染为 16:9「杂志卡」——1px 主题色细边框 + 12px 圆角 + 底部轻渐变过渡（40% 黑 → 40% 透明，不压暗图片主体）。封面不承载元信息（日期/标签/浏览量由 PostHeader 展示，避免重复）。图片加载失败时隐藏封面区域，不保留破图区域，PostHeader 正常展示。

移动端（< 768px）封面铺满横向宽度（-24px 两侧出血），高度由 clamp 限制，无圆角与左右边框。封面动效为短暂淡入和极轻微缩放，`prefers-reduced-motion: reduce` 时不播放。

## 执行约束

- 去重只发生在渲染层且只收导语区：仅删与显式封面同 URL 的正文图与等强标题的导语首 heading；不得为封面展示改写数据层内容（RSS/导出源保持完整文档形态）；后端首图派生删除与前端导语去重不叠加、不二次删图。
- 有封面时 PostHeader 正常渲染；无封面时生成式封面承载 Header 信息，PostHeader 不重复渲染，页面 h1 保持唯一。
- 加载失败不得保留破图区域。

## 适用边界

不约束列表缩略图的裁切策略；不约束正文配图的相对路径资产改写（发布管线域）。

## 验证方式

检查 PostCover 的有图/无图/加载失败三分支，验证移动端出血、reduced-motion 样式与 h1 唯一性（有图由 PostHeader 提供 h1，无图由生成式封面提供）。导语区去重回归 `apps/site/test/post-lead-dedupe.test.mjs`（`node --experimental-strip-types --test`），并以 #172 真实数据过「stripMetadata→renderMarkdown→dedupe→transformArticleTypography」链路核对首屏图/标题唯一与目录编号起点。

## 关联知识

- [blog detail](./blog-detail.md)
- [components](./components.md)
