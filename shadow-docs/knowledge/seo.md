---
title: SEO
domain: seo
keywords: [SEO, Open Graph, Twitter Card, JSON-LD, canonical, sitemap, 结构化数据, metadata, 面包屑, 主题页]
scope:
  - apps/site/app
  - apps/site/app/lib/seo.ts
  - apps/site/app/lib/sitemap-utils.ts
  - apps/site/app/sitemap.ts
status: active
source:
  - changes/archive/20260524_P_seo_optimization/brief.md
  - changes/archive/20260627_P_blog_url_slug_seo/brief.md
  - changes/archive/2026-07-25-P-seo-og-metadata-summary-author-profile/brief.md
  - changes/archive/2026-07-26-P-seo-discovery-navigation/brief.md
  - changes/archive/20260822-feature-post-url-clean/brief.md
  - changes/archive/20260930-fix-seo-indexing-p0/brief.md
  - changes/20261001-fix-og-image-metadata-shadowing/brief.md
  - changes/20261001-fix-heading-hierarchy/brief.md
verified: 2026-10-01
verified-depth: runtime
verified-scope: apps/site/app/sitemap.ts、apps/site/app/post/[number]、apps/site/app/lib/seo.ts、7 个区块页、apps/site/test/seo-*
---

# SEO

## 当前结论

全站页面包含 `og:title`、`og:description`、`og:image`、`og:url`、`og:type` 和 Twitter Card 标签。默认 Open Graph 图片为 1200x630。博客文章 description 优先使用 CMS summary，fallback 到 Markdown AST 提取的首个有效段落（忽略代码块和标题），再 fallback 到正文前 160 字。

Next Metadata API 的 `openGraph`/`twitter` 按**路由段整体遮蔽**父级，不做字段级合并——子页只要声明了这两个对象，就必须自带 `images` 与 large card，否则 root layout 的 og-default(1200×630) 全部失效（2026-10-01 修复前 7 个区块页全部无 og:image、5 页 card 降级 summary）。区块页统一经 `buildSectionMetadata`（apps/site/app/lib/seo.ts）组装，文章页经 `buildArticleMetadata`（自带 cover 图，无 cover 时回落 og-default）；不得在页面里手写字面量 openGraph/twitter。

博客详情页 URL 格式为 `/post/<number>`（只保留文章 id），旧格式 `/post/<number>-<title-slug>` 兼容并 301 重定向至 canonical。canonical URL 由 `buildPostUrl`（纯 id）和 `isCanonicalPostPath`（纯数字校验）统一生成，`extractPostNumber` 兼容旧 slug 格式提取 id。

JSON-LD 结构化数据：根布局输出 WebSite + Person（指向 `https://github.com/stack-wuh`）；博客详情页输出 BlogPosting（通过 builder 统一构造）和 BreadcrumbList（与可见面包屑使用相同 canonical URL）；About 页输出 ProfilePage；主题页输出 CollectionPage + ItemList。

Sitemap 路由必须 `export const dynamic = 'force-dynamic'` 运行时生成——Docker build 阶段容器内无 nest，静态生成的 Metadata Route 会把「fetch 失败的部分结果」烘焙进产物（2026-09-30 修复前线上只剩 4 条静态 URL）。任一页 fetch 失败则记日志后整体抛错返回 500，不静默输出部分结果；fetch 级 `revalidate: 3600` 提供上游短时故障下的 last-good 韧性（有缓存时上游短停仍返回上次完整结果，冷缓存硬故障才 500）。

文章不存在与内容不可渲染统一收敛 404：`/post/{不存在}`（上游 404）与 body/body_html 双空的陈旧同步记录（已删除/已关闭 Issue，生产库实测 142 条中 94 条双空）都走 `notFound()`；上游非 404 故障（网络/5xx/空响应）保留真实 500 交路由级 error.tsx，不做无差别兜底（会把真实故障伪装成 404 误伤收录）。

调试页（如 `/design/system-color`）不进入 sitemap 且 `index: false, follow: false`。旧 labels 筛选页（`/blog?labels=...`）设为 `index: false, follow: true`。

heading hierarchy 硬约束：**每页恰好 1 个 `<h1>`**。首页主标题「wuh.site · 朝朝如念」由 `SiteTitle`（app/styles/index.ts）承载，必须是 `styled.h1` 且 margin 全向重置压掉浏览器默认外距；流式骨架（*/loading.tsx）不得渲染 h1 语义元素（骨架 PageTitle 用 `as='div'` 降型），h1 唯一归属真实内容组件（2026-10-01 修复前 `/` 零 h1、`/music` 双 h1）。

公开文章页不使用请求 Cookie，使用 `revalidate: 3600` 级别的 ISR 替代实时渲染。

## 执行约束

- canonical、OG、Twitter、JSON-LD 和 sitemap 必须使用同一公开 URL；文章 description 按 summary、有效段落、正文截断顺序降级。
- 页面 metadata 里的 openGraph/twitter 一律走 builder（`buildSectionMetadata`/`buildArticleMetadata`），禁止手写字面量——Next 按段整体遮蔽，手写必丢图（2026-10-01 实证）。

## 适用边界

不约束后台 Console 和 API 文档页面的搜索收录。

## 验证方式

运行 Next SEO 相关现有测试，并检查首页、博客、详情、topic 的 metadata 与 sitemap URL 一致。

## 关联知识

- [rss](./rss.md)
- [blog detail](./blog-detail.md)
- [post cover](./post-cover.md)
