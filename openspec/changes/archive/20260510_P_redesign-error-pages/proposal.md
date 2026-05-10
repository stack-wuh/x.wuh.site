# 重新设计404/500页面

## What

重新设计博客的 404 (not-found.tsx) 和 500 (error.tsx) 错误页面，使其视觉风格与网站整体保持一致。当前这两个页面使用通用 UI 库风格的 Result 组件（card + border + status badge），与网站的酒红 editorial 风格不搭配。

## Why

1. **Result 组件的 card/border/badge 风格偏通用 UI 库** — 与首页、博客列表、文章详情页的开放布局、无边框设计语言不统一
2. **404 页面有自定义 GlobalLayout** — 重复设置 body 样式，与根 layout 冲突
3. **视觉脱节** — 用户从首页/博客页跳转到 404/500 时，明显感觉进入了不同风格的页面

重新设计后，错误页将采用网站统一的 typography 驱动、无边卡、酒红氛围的 editorial 风格。
