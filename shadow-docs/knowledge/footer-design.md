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

**字号与行高**：页脚整层是辅助信息，根层 `font-size: var(--font-size-xs)`（12px，四主题同值——素雅主题的 `--font-size-sm` 被覆写为 15px，与 `base` 同值，故页脚不用 `sm` 档），导航/备案/注脚/站点数据各行不再单独声明字号；slogan 是唯一的展示行，`--font-size-base`（15px）serif 600。行高由页脚自有的两个变量承担：块级行 `--footer-lh: 1.8`、slogan 与 tooltip `--footer-lh-display: 1.5`，四主题与各断点取值一致（实测块级行 12px/21.6px、slogan 15px/22.5px、tooltip 12px/18px）。**不引用全站行高令牌**：`--line-height-body` 在素雅主题是 2.0（过松）、`--line-height-heading` 只有 1.35（过紧），两端都落不进页脚要的 1.5–1.8 区间。字体族由根层自持 `font-family: var(--font-sans)`——页脚挂在 `AppProviders`（页面容器之外），页面级 `font-family` 覆盖不到，缺失时全部文字会落到浏览器默认族（实测 `Microsoft YaHei`）。

版权注脚为**一段 flex-wrap 行**，含三段 `white-space: nowrap` 内容：`© {起始年}–{当前年} {author}.` / 协议链接 / 技术栈。分隔符 `·` 由 `.footer-note > * + *::before` 附着在**后一段**上，因此换行永远发生在段边界——不会截断数字或协议名，也不会把分隔符孤立在上一行末尾。**三段在任意宽度都完整展示**（技术栈段曾按 <520px 隐藏，已撤销）：窄屏技术栈整段折到下一行，且 ≤520px 时其段首分隔符随之隐藏（此时它独占一行，行首的点是多余的）——注意 521–639px 区间若发生折行，该点会出现在行首（CSS 无法感知 flex 折行，此为该机制的已知边界；只有 ≤520px 是确定折行区间，才可安全隐藏）。段间不设 `column-gap`：CJK 全角「·」自带 1em 字宽（墨迹居中），它本身就是段间留白（实测可见间隔 12px）——若隐藏了分隔符又不给 `column-gap`，两段会直接粘在一起，故两者不能同时成立。导航行与备案行 `column-gap: var(--space-sm)`（≤520px 收 `--space-xs`），站点数据行同为 `--space-sm`；横向留白一律跟着字号档走，不沿用正文的 `--space-lg/md`。

页脚纵向节奏由**行高 + 区块 margin 共同**承担：行与行的距离来自行盒 leading（12px × `--footer-lh` 1.8 → 21.6px 行盒），区块之间则必须保留 margin——`Divider ornament` 默认的 `--space-lg` margin 收到 `--space-sm/base`，导航/备案/注脚行 `margin-bottom: var(--space-sm)` 且 `row-gap: var(--space-xs)`（注脚 `calc(var(--space-xs) / 2)`）。**不能把 margin 全部归零只留行高**：链接下划线是挂在行盒底部再往下 4px（`calc(var(--space-xs) / -2)`，间距令牌推导）的绝对定位伪元素（`linkUnderline`），没有 margin 时它会落进下一行的盒子里——实测下划线到下一行墨迹的余量：有 margin 14px、无 margin 约 4px。footer 自身 `padding: var(--space-md)` 作为外框、logo 64×32；整块高度约 276px（1280 视口）/ 260px（375 宽）。

末行「站点数据」为三项 lucide 图标（`calendar-days` = 站龄、`feather` = 全站字数、`eye` = 访问量），响应式标签：桌面 hover/focus 弹 tooltip（向上弹出，页底向下会被视口裁切），触屏（`hover: none` 或 `pointer: coarse`）显示常显短文字。访问量的「总/今日」两值合并于一枚图标内并列展示。

站点事实源：`footerConf.siteBorn`（`2021-03-08` 备案审核日）是站龄与版权年份的唯一日期源；站龄含首日按 UTC 日期差计算；版权区间 = 建站年 → 当前年（同值显示单年）。备案号序列不编码日期，禁止由号码反推日期。

全站字数来自 `GET /api/visit-stats/stats` 扩展字段 `totalWords`（后端聚合 + 1 小时 TTL 缓存），口径为「中文字符数 `[一-鿿]` + 英文单词数 `[a-zA-Z]+`」，与单篇 SEO 的 `getArticleWordCount` 一致；后端未返回时羽毛笔项整体隐藏。

## 执行约束

- Footer 内层保持 640px 封顶，新增内容不得破坏中轴层级顺序；tooltip 必须向上弹出。
- 字号只用两档：辅助层 `--font-size-xs`（根层统一继承，行内不再单独声明）、slogan `--font-size-base`。**不得在页脚使用 `--font-size-sm`**——素雅主题把该 token 覆写为 15px，与 `base` 同值，分级在四主题下不可控。
- 行高只有两个来源：`--footer-lh`（1.8，块级行）与 `--footer-lh-display`（1.5，slogan / tooltip），两者都必须落在 1.5–1.8 区间；禁止直接引用 `--line-height-body/heading`，也禁止在别处散写行高数值。
- 页脚必须自持 `font-family: var(--font-sans)`：它挂在页面容器之外，页面级字体族覆盖不到，缺失即回落浏览器默认族。
- 区块间距必须用 margin（`--space-sm` / `--space-base` 一档，≤520px 横向收 `--space-xs`），不能把 margin 归零只靠行高：链接下划线挂在行盒底部 −4px，行间没有 margin 时下划线会落进下一行的盒子。行高（`--footer-lh` 1.8 / `--footer-lh-display` 1.5）与 margin 叠加才是最终节奏，两者都要保留。
- 间距与偏移只经令牌，不得出现裸 px：下划线偏移 `calc(var(--space-xs) / -2)`、focus ring 偏移 `calc(var(--space-xs) / 2)`、tooltip 弹出距离 `calc(100% + var(--space-xs))`、tooltip 内边距 `calc(var(--space-xs) / 2) var(--space-xs)`、圆角 `--border-radius-xs/sm/base`、内层宽度 `${BREAKPOINTS.mobile}px`。描边与发丝线宽度（`1px`、`outline: 1.5px`）沿用仓库既有字面值写法，不在此约束内。
- 横向留白跟着字号档走：导航行 / 备案行 / 站点数据行 `column-gap: var(--space-sm)`（≤520px 收 `--space-xs`），注脚段间**不设** `column-gap`（全角 `·` 自带 1em 字宽即段间留白）；禁止沿用正文口径的 `--space-lg/md`。
- 注脚内不要给子元素设 `display` 参与布局（历史坑：`.footer-note > span` 特异性 0,1,1 压过 `.footer-note-tech` 的窄屏规则）；新增段的分隔符一律用 `::before` 附着于后段，不要写成独立分隔符元素。段间留白由分隔符承担，因此若要隐藏某段的分隔符，必须确认该段在同一行时仍有间隔可用。
- 颜色、字体、断点只经语义 token；触屏标签靠 `(hover: none) / (pointer: coarse)` 媒体查询切换，不依赖宽度断点。
- 图标数据项必须保留 `sr-only` 文案、`tabindex` 可聚焦与 focus-visible 描边。
- 站龄/版权年份只从 `footerConf.siteBorn` 推导，禁止新增第二个日期常量；`packages/components` 不得 import `@wuh.site/core`。

## 适用边界

仅约束 `packages/components/layout` 的 Footer 及其样式；博客页内专用 `TitleWithTooltip` 不受本卡 tooltip 约束；Header 导航、首页 motto 的动效语言由 design-system 卡覆盖。

## 验证方式

检查 footer 结构顺序与 640px 护栏；四主题（wine/plain × light/dark）目测；tooltip 桌面出现/触屏不出现（走文字标签）；375px 下无横向滚动；`GET /api/visit-stats/stats` 返回 `totalWords` 且与 `getArticleWordCount` 口径一致。

字号/行高用 `getComputedStyle` 复核（本地 dev，1280 宽）：根层与各行 12px、字体族 `Noto Sans SC`；行高四主题与 375/1280 一律 21.6px（`--footer-lh` 1.8，不再随主题/断点变化），slogan `Noto Serif SC` 15px / 22.5px，tooltip 12px / 18px 且向上弹出。纵向复核：区块相邻盒间距 12 / 8 / 16 / 16 / 16px；链接下划线（行盒底 +4px）到下一行墨迹余量 14px；页脚高度 276px（1280 宽）、285px（375 宽，注脚折两行）、315px（320 宽，备案与注脚各折两行）。横向留白复核：导航行 / 备案行 16px（≤520px 8px），注脚段间 12px（全角 `·` 自带字宽），数据行 16px。技术栈复核：640px 以上与前两段同行、640px 以下整段折到第二行，`≤520px` 时其段首分隔符 `display: none`。令牌复核：间距类属性（margin / padding / gap / bottom / outline-offset）扫描无裸 px，取值由 `--space-*`、`--border-radius-*`、`BREAKPOINTS.mobile` 承担。320–1280 宽均无横向溢出，注脚折行只发生在段边界。

## 关联知识

- [design system](./design-system.md)
- [components](./components.md)
- [visit stats](./visit-stats.md)
