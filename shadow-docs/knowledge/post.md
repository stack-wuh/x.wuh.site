---
keywords: [博客详情, PostToolbar, 文章目录, Markdown, 封面, 路由, fallback]
---

# 博客详情页

PostToolbar 底部显示不对称布局导航（prev 全宽，next 右对齐）、文章位置"第 X / Y 篇"、"所有博客"返回入口。移动端隐藏"所有博客"按钮。

文章目录：正文 HTML 中带文本和 id 的 h1/h2/h3 生成目录，桌面端与移动端均使用对应标题锚点。正文 HTML 兼容回退：`bodyHtml` 为空时使用服务端 Markdown renderer 从 `body` 生成非空 HTML；`body` 为空时回退到 `bodyHtml`。

详情路由兼容标题 slug（`/post/<number>-<slug>`）：使用首段数字查询文章，编码字符不导致 500。

封面显式声明通过 HTML 注释元数据 `<!-- cover: URL -->` 和可选 `coverAlt`，该注释不作为可见内容展示。显式封面与正文图片独立（正文首张图片不被移除）。移动端封面铺满横向宽度，高度受最小值、响应式值和最大值共同限制；桌面端封面保持在阅读栏内，不跨越目录栏。封面动效为短暂淡入和极轻微缩放，`prefers-reduced-motion` 下不播放。正文首图作为封面回退时从正文中移除该图片避免重复。
