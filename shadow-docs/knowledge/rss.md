---
keywords: [RSS, feed, 自动发现, canonical URL, 订阅, XML]
---

# RSS 订阅

RSS feed 仅输出 `state: 'open'` 的内容。item link 格式为 `https://wuh.site/post/<number>-<title-slug>`（与博客 SEO canonical URL 一致）。

全站 `<head>` 包含 RSS 自动发现标签 `<link rel="alternate" type="application/rss+xml" ...>`，页脚提供 RSS 订阅入口链接。
