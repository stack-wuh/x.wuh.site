---
keywords: [SEO, Open Graph, Twitter Card, JSON-LD, canonical, sitemap, 结构化数据, metadata, 面包屑, 主题页]
---

# SEO

全站页面包含 `og:title`、`og:description`、`og:image`、`og:url`、`og:type` 和 Twitter Card 标签。默认 Open Graph 图片为 1200x630。博客文章 description 优先使用 CMS summary，fallback 到 Markdown AST 提取的首个有效段落（忽略代码块和标题），再 fallback 到正文前 160 字。

博客详情页 URL 格式为 `/post/<number>-<title-slug>`，slug 中保留中文，URL 敏感字符替换为 `-`，连续 `-` 压缩。旧格式 `/post/<number>` 保持兼容。非规范路径执行 308 永久重定向至 canonical URL。canonical URL 由 `buildPostUrl` 和 `isCanonicalPostPath` 统一生成。

JSON-LD 结构化数据：根布局输出 WebSite + Person（指向 `https://github.com/stack-wuh`）；博客详情页输出 BlogPosting（通过 builder 统一构造）和 BreadcrumbList（与可见面包屑使用相同 canonical URL）；About 页输出 ProfilePage；主题页输出 CollectionPage + ItemList。

Sitemap 按 `state: 'open'`、`revalidate: 3600` 分页生成，任一页失败则整体失败。调试页（如 `/design/system-color`）不进入 sitemap 且 `index: false, follow: false`。旧 labels 筛选页（`/blog?labels=...`）设为 `index: false, follow: true`。

公开文章页不使用请求 Cookie，使用 `revalidate: 3600` 级别的 ISR 替代实时渲染。
