# 修复 Header 外观选择器三项 Bug

## 背景

2026-07-25 上线的 Header 外观选择器（`2026-07-25-P-header-appearance-selector`）引入三个缺陷：

1. **酒红与素雅色板预览颜色相同** — 两张 `SwatchPreview` 的渐变背景都读取当前页面已生效的 `var(--primary-color)` 和 `var(--background-color)`，无论选中哪个选项都显示同一套当前主题色，色板无法区分两个主题家族。
2. **移动端二级主题选择打开后无法关闭一级菜单** — `openMobileAppearance` 调用 `close()` 卸载一级菜单入口，但二级 Sheet 关闭时 `closeMobileAppearance` 试图将焦点归还到 `mobileAppearanceTriggerRef`（已随一级菜单隐藏/卸载），且关闭二级后没有恢复一级菜单显示。用户只能通过页面刷新恢复。
3. **桌面端外观按钮风格不协调** — `AppearanceTrigger` 使用了 999px 胶囊、混合主题色边框、内阴影和显式上浮动效，与 Header 博客/关于导航链接的轻量文字风格不一致。

这三个问题应在「外科式修复 + 抽取共享选项组件」的范围内解决，不重新设计整体架构。

## 目标

- 酒红与素雅的色板预览分别使用各自主题家族的**固定主色与背景色**，不再读取当前页面 CSS 变量。
- 移动端：一级菜单与二级外观 Sheet 形成可逆的层级状态。打开二级时一级菜单视觉保留入口以便返回；关闭二级后恢复一级菜单显示并将焦点归还外观入口；只有点击一级菜单关闭按钮或导航项时才关闭全部菜单。
- 桌面端外观入口采用导航同款轻量按钮形态（静态淡主题色底 + 主题色图标），移除厚重胶囊视觉。
- 抽取仅负责两组选择控件的共享组件，桌面浮层和移动 Sheet 复用同一数据、文案和 `aria-pressed` 行为。
- 先补失败测试覆盖根因，再做最小实现并通过回归。

## 非目标（明确不做）

- 不新增 `wine`、`plain` 之外的主题家族。
- 不调整 Header 的站点标识、导航信息架构、移动菜单导航项或 768px 响应式断点。
- 不修改通用 Button 的公共 API 或全局默认样式。
- 不引入第三方弹层、动画或状态管理依赖。

## 影响范围

- `packages/wuh.site.next/app/components/SiteHeader/index.tsx` — 修复移动端层级状态与焦点归还；替换桌面入口样式；引入共享选项组件。
- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 桌面入口改为导航同款轻量按钮；色板预览改用固定色值；移除厚重胶囊样式。
- `packages/wuh.site.next/app/components/SiteHeader/AppearanceOptions.tsx` — **新增**共享选项组件，负责主题色板与显示模式两组选择控件。
- `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` — 新增失败测试：色板固定预览值、移动端二级关闭恢复一级菜单及焦点、桌面入口无厚重胶囊视觉。
