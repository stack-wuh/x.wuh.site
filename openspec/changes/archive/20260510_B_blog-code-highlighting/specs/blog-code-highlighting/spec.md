# 博客代码高亮

## R1 — 代码块主题适配

代码块配色应响应 `prefers-color-scheme` 切换。在 light 模式下代码块背景为浅色面板，dark 模式下为深色面板。代码文字与背景有足够对比度。

## R2 — 服务端语法高亮

语法高亮在服务端完成，页面 HTML 直接包含带 hljs 类名的代码块。不依赖 CDN 外部资源。

## R3 — 移除 CDN highlight.js

删除 `usePostImagePreview.ts` 中 CDN highlight.js 脚本和样式加载逻辑，以及 `prefers-color-scheme` 媒体查询监听。

## R4 — 保留现有功能

以下功能不受影响：
- 代码块复制按钮
- 博客图片预览
- 目录 (TOC) 生成和导航
- GFM 扩展语法（表格、任务列表、删除线）
