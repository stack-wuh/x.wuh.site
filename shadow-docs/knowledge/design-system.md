---
title: 设计系统
domain: frontend
keywords: [主题系统, CSS变量, 暗黑模式, 主题切换, 字体, 无闪动, 打字动画, Header导航, 外观设置, 静默条, 试笔墨签, 暗色淡化]
scope:
  - packages/components/themes
  - packages/wuh.site.next/app/layout.tsx
  - packages/wuh.site.next/app/design/system-color
  - packages/components/themes/cssVariableProvider.tsx
status: active
source:
  - changes/archive/20260418_P_site-theme-optimization/brief.md
  - changes/archive/20260627_P_theme_follow_system/brief.md
  - changes/archive/2026-07-28-P-unify-cross-platform-fonts/brief.md
  - changes/20260829-feature-custom-scrollbar/brief.md
  - changes/20260829-feature-responsive-spacing/brief.md
  - changes/20260915-style-quiet-header-bar/brief.md
verified: 2026-09-15
---

# 设计系统

## 当前结论

双维度主题模型：`data-theme-family`（wine/plain）和 `data-color-scheme`（light/dark），组合为 4 种主题，存储于 localStorage key `wuh.site.theme`。

CSS 变量分三层：`:root` 注入 raw 调色板；4 个 selector 路由映射到公开变量；非颜色 tokens（spaces/fontSizes/borderRadius）通过 theme props 注入。颜色变量命名使用 `--primary-color`、`--text-primary`、`--background-{100-900}` 等语义化 token。三个字体 token（`--font-sans`、`--font-serif`、`--font-mono`）由 Noto Sans SC、Noto Serif SC、JetBrains Mono 自托管提供，真实字重覆盖 400/500/600/700，全局 `font-synthesis: none` 禁止浏览器合成粗体或斜体。全站任何组件声明 font-family 只能引用这三个语义 token，不直接写平台字体名。

系统级滚动条（CssVariableStyles 全局样式）：8px 宽主题色细条，轨道透明，滑块 `--primary-color` 渐变圆角胶囊（hover 提亮），4 主题自动适配；Chrome/Edge 121+ 标准 `::scrollbar-*` 与旧 `::-webkit-scrollbar-*` 双写，Safari 走 WebKit 旧语法，Firefox 用 `scrollbar-width: thin` + `scrollbar-color`（形状不可控仅颜色统一）；`@media (pointer: fine)` 包裹全部自定义规则，触控设备恢复系统覆盖式滚动条。组件级滚动条（留言板虚拟滚动 7px 等）样式更specific，不被全局覆盖。

响应式断点体系（`packages/components/themes/breakpoints.ts`）：语义化 3 档常量 `mobile: 640`（max-width）/ `small: 520`（max-width）/ `tablet: 1024`（min-width），styled-components 模板字符串引用；新代码必须使用语义常量，不新引入裸断点数值，存量散乱断点（480/560/767/768 等）随触碰逐步收敛。

响应式间距 token：spaces 的 md/lg/xl/2xl/3xl 为 clamp 值（窄屏收缩、桌面封顶原值），xs/sm/base 固定。移动端行高收紧（max-width 640）：`--line-height-body` 酒红 1.8→1.7、素雅 2.0→1.8，`--line-height-heading` 1.35→1.3（素雅 1.4→1.35），桌面保持原值。

首屏主题无闪动：`<head>` 中的同步脚本在首次渲染前设置 `data-no-transition` 禁用过渡、强制重排、设置主题属性、再移除 `data-no-transition` 恢复过渡，整个过程在同一同步块完成。主题切换时所有元素的 background-color、color、border-color、box-shadow 以 0.3s ease 平滑过渡。

首页标语使用 TypewriterMotto 打字机效果逐字显示，两句循环："写作是抵抗遗忘的方式，代码是构建世界的语言。" / "不要停步不前，每一天都要做出改变。"

桌面端 Header 是「静默条」：整层自持 `font-family: var(--font-sans)` 与局部行高 `--header-lh: 1.5`（挂在页面容器之外，页面级字体族覆盖不到）；导航行字号由局部变量 `--header-fs` 承担——平板带 13px（四主题无稳定 13px 令牌），`≥ BREAKPOINTS.tablet`(1024) PC 带升 `--font-size-base`(15px，四主题稳定)；`≤ BREAKPOINTS.mobile`(640) 收起汉堡，与内容断点同轴（旧野断点 768 已清除）。外观入口为朱砂印「墨」（18×18、印框 `color-mix(primary 45%, transparent)`、印面衬线「墨」`--font-size-xs`、`--border-radius-xs`——打开墨签弹层选墨，动作即钤印；印面自身即装饰，不挂渐隐下划线，下划线语言只留给导航与墨字段）；触发器与 NavLink 同行盒高（`font-size: var(--header-fs)` + `min-height: calc(1em * var(--header-lh) + var(--space-xs) * 2)`），行节奏不随入口形态变；印面状态用 transient prop（`$open`）+ 自身 `:hover` 转实边——跨组件插值选择器 `.trigger:hover .seal` 在 SSR 双写 styleSheets 下实测不可靠、已弃；可发现性由 aria-label（含当前主题态）+ 原生 `title` 承担；logo 高 = `--header-fs × 2`、宽按 42:26 比例随档缩放；底边框发丝线 `color-mix(--text-muted 18%)` 与页脚同档。导航悬停下划线语言不变：1px、两端透明、中段 `--primary-color`。

主题选择弹层是纸卡语言：不透明 `--background-100` + 发丝线边框 + `--border-radius-base` + `--elevation-soft`（light 下 background-100 是纸白、暗色下是深面——它就是主题表面色）；无标题回显行。主题预览为「试笔墨签」：该主题的纸（background-900）打底、墨（normal-900）写衬线「朝」（字高 `--header-fs × 2`）、下压该主题主色的渐隐装饰线；**色值引用 Layer 1 原始调色板变量（`--_wl-*` / `--_pl-*`，恒挂 `:root` 不随当前主题路由）**——预览独立于当前主题的旧规「写死渐变色值」由此升级为零复制漂移。明暗三段是发丝线分隔的墨字段，选中态 = 与导航同源的渐隐下划线，不再用彩色胶囊。移动端外观设置在菜单内展开，不弹出独立 Bottom Sheet；移动菜单项字号 `--font-size-base`。

**暗色淡化表达铁律**：Header 及其弹层不得使用 `--text-secondary` 做淡化色——暗色调色板方向反转（normal-600 比正文用的 normal-500 更亮），会使「选中」比「未选中」更暗；统一 `color-mix(in oklab, var(--text-color) 72%, transparent)`（NavLink 既有语言）。另有 CSS 陷阱：styled 块内 `font` 简写必须排在 `font-size` 之前，同块内后写的简写会重置先声明的字号。

## 执行约束

- 颜色必须经主题变量暴露，不在业务组件硬编码；主题 family 与 color scheme 独立，SSR 初始化不得产生闪烁。
- Header/弹层：字号禁引 `--font-size-sm`（素雅覆写为 15px）；淡化色禁引 `--text-secondary`（暗色反向），用 `--text-color` 72% mix；间距/圆角/偏移只经 `--space-*`/`--border-radius-*`；断点只用 `BREAKPOINTS` 语义常量；`font` 简写不得排在 `font-size` 之后；动态状态禁用跨组件插值选择器（`&:hover ${Child}`），改由 transient prop 挂在子组件自身。
- 主题预览类 UI 要显示"别的主题的样子"时，取 Layer 1 原始变量 `--_wl/--wd/_pl/--pd-*`，禁止复制十六进制色值或读当前路由变量。

## 适用边界

品牌插图和外部内容图片的固有颜色不受主题 token 限制。

## 验证方式

检查主题变量生成、layout 初始化脚本和四种组合 selector；分别在 light/dark 与 wine/plain 下检查公开变量。

## 关联知识

- [components](./components.md)
- [icon system](./icon-system.md)
