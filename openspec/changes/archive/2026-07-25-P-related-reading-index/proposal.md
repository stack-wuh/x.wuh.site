---
artifact: proposal
contractVersion: 1
requiredHeadings:
  - 背景
  - 目标
  - 非目标（明确不做）
  - 影响范围
requiredPatterns:
  - '^# .+'
---

# 阅读余韵索引：文章页相关文章重设计

## 背景

文章详情页的“相关文章”模块当前仍呈现通用组件列表的语气，与站内衬线标题、留白、纸张感和连续阅读节奏不一致。用户已确认采用“阅读余韵索引”方案：以正文结束后的阅读延伸替代推荐卡片或产品信息流。

## 目标

- 将相关文章模块重构为无卡片、无阴影、低动效的阅读索引。
- 复用现有相关文章排序、数量上限和站内内链，只调整展示结构、样式与交互。
- 利用已有摘要和共享标签帮助读者判断下一篇是否值得阅读。
- 满足键盘访问、移动端 44px 触达、主题令牌复用与 reduced-motion 要求。

## 非目标（明确不做）

- 不改变相关文章的服务端查询、排序、去重或三篇上限。
- 不新增 API、DTO、图片封面、评分、点赞或异步加载。
- 不调整正文、版权、分享、评论和上下篇导航模块。
- 不引入新的字体、色板、阴影体系或第三方依赖。

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 调整相关文章模块的语义结构与可访问性属性。
- `packages/wuh.site.next/app/post/styles/post-article.ts` — 实现阅读余韵索引的视觉、响应式与动效约束。
- `packages/wuh.site.next/app/post/styles/index.ts` — 导出新增或调整后的样式模块。
- `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs` — 覆盖展示、无卡片约束与交互结构回归。
