# 博客详情页代码展示优化

## What

将博客详情页的 markdown 渲染从 `marked` + CDN highlight.js 方案迁移到 unified + remark + rehype 生态，在服务端完成语法高亮。

## Why

当前方案存在三个问题：

1. **代码块在 light 主题下看不清** — `--atom-pre-bg` 硬编码为 `#1e1e1e`（深色），`pre code` 文字颜色硬编码 `#d4d4d4`。无论站点切换到 money 还是 plain 主题，代码块始终深色背景，与浅色页面形成强烈对比。

2. **highlight.js 从 CDN 加载，不感知站点主题** — 只监听 OS 级 `prefers-color-scheme` 切换 `atom-one-dark`/`atom-one-light`，不知道站点 `data-theme` 的手动切换。

3. **CDN 依赖** — 语法高亮完全依赖外部 CDN 可用性，加载失败时代码块无任何样式。

改用 rehype 生态后，语法高亮在服务端完成，无 CDN 依赖，代码块配色可通过 CSS 变量统一响应站点主题切换。
