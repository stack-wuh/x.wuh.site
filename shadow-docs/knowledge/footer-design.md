---
title: Footer 设计规范
domain: frontend
keywords: [Footer, 页脚, ornament, 中轴布局, 站点数据, 站龄, 全站字数, siteBorn, 版权年份, tooltip]
scope:
  - packages/components/layout
  - packages/components/layout/styles
status: active
source:
  - changes/20260914-style-footer-ornament/brief.md
verified: 2026-09-14
---

# Footer 设计规范

## 当前结论

Footer 为「中轴 ornament 式」单列布局，内层 `max-width: 640px` 封顶并与站点 720-1200px 居中内容列同轴，超宽屏不随视口拉伸。层级自上而下：`Divider variant="ornament"`（`IconLogo` 作为 children 居中锚点，替代默认字符 ◇）→ serif slogan（`--font-serif`，17px，字距 0.25em）→ 导航行（博客 / 关于 / RSS）→ 备案链接行（可点击，外链配 `rel="noopener noreferrer"`）→ 版权注脚两行（`© {起始年}–{当前年} {author}. · CC BY-NC-SA 4.0` / 技术栈行，小屏 hidden）→ 站点数据行。

末行「站点数据」为三项 lucide 图标（`calendar-days` = 站龄、`feather` = 全站字数、`eye` = 访问量），响应式标签：桌面 hover/focus 弹 tooltip（向上弹出，页底向下会被视口裁切），触屏（`hover: none` 或 `pointer: coarse`）显示常显短文字。访问量的「总/今日」两值合并于一枚图标内并列展示。

站点事实源：`footerConf.siteBorn`（`2021-03-08` 备案审核日）是站龄与版权年份的唯一日期源；站龄含首日按 UTC 日期差计算；版权区间 = 建站年 → 当前年（同值显示单年）。备案号序列不编码日期，禁止由号码反推日期。

全站字数来自 `GET /api/visit-stats/stats` 扩展字段 `totalWords`（后端聚合 + 1 小时 TTL 缓存），口径为「中文字符数 `[一-鿿]` + 英文单词数 `[a-zA-Z]+`」，与单篇 SEO 的 `getArticleWordCount` 一致；后端未返回时羽毛笔项整体隐藏。

## 执行约束

- Footer 内层保持 640px 封顶，新增内容不得破坏中轴层级顺序；tooltip 必须向上弹出。
- 颜色、字体、断点只经语义 token；触屏标签靠 `(hover: none) / (pointer: coarse)` 媒体查询切换，不依赖宽度断点。
- 图标数据项必须保留 `sr-only` 文案、`tabindex` 可聚焦与 focus-visible 描边。
- 站龄/版权年份只从 `footerConf.siteBorn` 推导，禁止新增第二个日期常量；`packages/components` 不得 import `@wuh.site/core`。

## 适用边界

仅约束 `packages/components/layout` 的 Footer 及其样式；博客页内专用 `TitleWithTooltip` 不受本卡 tooltip 约束；Header 导航、首页 motto 的动效语言由 design-system 卡覆盖。

## 验证方式

检查 footer 结构顺序与 640px 护栏；四主题（wine/plain × light/dark）目测；tooltip 桌面出现/触屏不出现（走文字标签）；375px 下无横向滚动；`GET /api/visit-stats/stats` 返回 `totalWords` 且与 `getArticleWordCount` 口径一致。

## 关联知识

- [design system](./design-system.md)
- [components](./components.md)
- [visit stats](./visit-stats.md)
