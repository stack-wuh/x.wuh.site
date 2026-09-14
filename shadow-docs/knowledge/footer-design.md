---
title: Footer 设计规范
domain: frontend
keywords: [Footer, 页脚, ornament, 中轴布局, 站点数据, 站龄, 全站字数, siteBorn, 版权年份, tooltip, 垂直节奏, 字号层级, 行高令牌, font-sans]
scope:
  - packages/components/layout
  - packages/components/layout/styles
status: active
source:
  - changes/20260914-style-footer-ornament/brief.md
  - changes/20260914-style-footer-compact/brief.md
  - changes/20260914-fix-footer-type-scale/brief.md
verified: 2026-09-14
---

# Footer 设计规范

## 当前结论

Footer 为「中轴 ornament 式」单列布局，内层 `max-width: 640px` 封顶并与站点 720-1200px 居中内容列同轴，超宽屏不随视口拉伸。层级自上而下：`Divider variant="ornament"`（`IconLogo` 作为 children 居中锚点，替代默认字符 ◇）→ serif slogan（`--font-serif`，15px，字距 0.25em）→ 导航行（博客 / 关于 / RSS）→ 备案链接行（可点击，外链配 `rel="noopener noreferrer"`）→ 版权注脚单行 → 站点数据行。

**字号与行高**：页脚整层是辅助信息，根层 `font-size: var(--font-size-xs)`（12px，四主题同值——素雅主题的 `--font-size-sm` 被覆写为 15px，与 `base` 同值，故页脚不用 `sm` 档），导航/备案/注脚/站点数据各行不再单独声明字号；slogan 是唯一的展示行，`--font-size-base`（15px）serif 600。行高一律走设计系统令牌：根层 `--line-height-body`（酒红 1.8 / 素雅 2.0，≤640 收紧 1.7 / 1.8），slogan 与 tooltip 用 `--line-height-heading`（1.35 / 1.4），不写死数值。字体族由根层自持 `font-family: var(--font-sans)`——页脚挂在 `AppProviders`（页面容器之外），页面级 `font-family` 覆盖不到，缺失时全部文字会落到浏览器默认族（实测 `Microsoft YaHei`）。

版权注脚为**一段 flex-wrap 行**，含三段 `white-space: nowrap` 内容：`© {起始年}–{当前年} {author}.` / 协议链接 / 技术栈。分隔符 `·` 由 `.footer-note > * + *::before` 附着在**后一段**上，因此换行永远发生在段边界——不会截断数字或协议名，也不会把分隔符孤立在上一行末尾；技术栈段 <520px 时整段隐藏（其前置分隔符属该段 `::before`，随之消失）。段间不设 `column-gap`：CJK 全角「·」自带 1em 字宽（墨迹居中），它本身就是段间留白（实测可见间隔 12px）——字号降到 12px 后，原先 8px gap + 8px margin 的「双份留白」会让细字显得格外松散。导航行与备案行 `column-gap: var(--space-sm)`（≤520px 收 `--space-xs`），站点数据行同为 `--space-sm`；横向留白一律跟着字号档走，不沿用正文的 `--space-lg/md`。

页脚垂直节奏刻意收紧：footer padding `--space-md`、区块间隙 `--space-sm/base`、`Divider ornament` 的默认 `--space-lg` margin 覆盖为 `--space-sm/base`、logo 64×32；整块高度约 273px（酒红）/ 281px（素雅，1280px 视口），避免作为每页固定收尾过高。

末行「站点数据」为三项 lucide 图标（`calendar-days` = 站龄、`feather` = 全站字数、`eye` = 访问量），响应式标签：桌面 hover/focus 弹 tooltip（向上弹出，页底向下会被视口裁切），触屏（`hover: none` 或 `pointer: coarse`）显示常显短文字。访问量的「总/今日」两值合并于一枚图标内并列展示。

站点事实源：`footerConf.siteBorn`（`2021-03-08` 备案审核日）是站龄与版权年份的唯一日期源；站龄含首日按 UTC 日期差计算；版权区间 = 建站年 → 当前年（同值显示单年）。备案号序列不编码日期，禁止由号码反推日期。

全站字数来自 `GET /api/visit-stats/stats` 扩展字段 `totalWords`（后端聚合 + 1 小时 TTL 缓存），口径为「中文字符数 `[一-鿿]` + 英文单词数 `[a-zA-Z]+`」，与单篇 SEO 的 `getArticleWordCount` 一致；后端未返回时羽毛笔项整体隐藏。

## 执行约束

- Footer 内层保持 640px 封顶，新增内容不得破坏中轴层级顺序；tooltip 必须向上弹出。
- 字号只用两档：辅助层 `--font-size-xs`（根层统一继承，行内不再单独声明）、slogan `--font-size-base`。**不得在页脚使用 `--font-size-sm`**——素雅主题把该 token 覆写为 15px，与 `base` 同值，分级在四主题下不可控。
- 行高不得写死数值：块级行用 `--line-height-body`，展示行（slogan）与 tooltip 用 `--line-height-heading`。
- 页脚必须自持 `font-family: var(--font-sans)`：它挂在页面容器之外，页面级字体族覆盖不到，缺失即回落浏览器默认族。
- 保持收紧后的垂直节奏：区块间距用 `--space-sm/base` 一档，不要回退到 `--space-md`；窄屏需靠 `row-gap` 而非行高撑开。
- 横向留白跟着字号档走：导航行 / 备案行 / 站点数据行 `column-gap: var(--space-sm)`（≤520px 收 `--space-xs`），注脚段间**不设** `column-gap`（全角 `·` 自带 1em 字宽即段间留白）；禁止沿用正文口径的 `--space-lg/md`。
- 注脚内不要给子元素设 `display`：`.footer-note > span`（特异性 0,1,1）会压过 <520px 的 `.footer-note-tech { display: none }`（0,1,0）导致隐藏失效；同理，新增段的分隔符一律用 `::before` 附着于后段，不要写成独立分隔符元素。
- 颜色、字体、断点只经语义 token；触屏标签靠 `(hover: none) / (pointer: coarse)` 媒体查询切换，不依赖宽度断点。
- 图标数据项必须保留 `sr-only` 文案、`tabindex` 可聚焦与 focus-visible 描边。
- 站龄/版权年份只从 `footerConf.siteBorn` 推导，禁止新增第二个日期常量；`packages/components` 不得 import `@wuh.site/core`。

## 适用边界

仅约束 `packages/components/layout` 的 Footer 及其样式；博客页内专用 `TitleWithTooltip` 不受本卡 tooltip 约束；Header 导航、首页 motto 的动效语言由 design-system 卡覆盖。

## 验证方式

检查 footer 结构顺序与 640px 护栏；四主题（wine/plain × light/dark）目测；tooltip 桌面出现/触屏不出现（走文字标签）；375px 下无横向滚动；`GET /api/visit-stats/stats` 返回 `totalWords` 且与 `getArticleWordCount` 口径一致。

字号/行高用 `getComputedStyle` 复核（本地 dev，1280 宽）：根层与各行 12px、字体族 `Noto Sans SC`；行高 21.6px（酒红 1.8）/ 24px（素雅 2.0）；slogan `Noto Serif SC` 15px / 20.25px；tooltip 12px / 16.2px 且向上弹出。横向留白复核：导航行 / 备案行 16px，注脚段间 12px（全角 `·`），数据行 16px。页脚高度约 273px（酒红 @1280）、281px（素雅 @1280），320–1280 宽均无横向溢出，注脚折行只发生在段边界、<520px 技术栈段整体隐藏。

## 关联知识

- [design system](./design-system.md)
- [components](./components.md)
- [visit stats](./visit-stats.md)
