# 修复 Header 双下划线与留言板主题渐变

## 背景

近期 Header 与 About 留言板入口的样式优化仍存在两处可见问题：

1. Header 桌面导航 Hover 时同时显示全局 `a:hover` 文字下划线和 `NavLink::after` 主题色装饰线，形成双下划线，与“只保留主题色装饰线”的规范不符。
2. About 留言板入口以固定 `--accent-color` 为主要渐变来源，颜色未直接跟随当前主题的 `--primary-color`；暗色分支还使用 `prefers-color-scheme`，可能与用户手动选择的 `data-color-scheme` 不一致。现有渐变方向和强度缺少自然衰减，视觉效果生硬。

## 目标

- Header 桌面导航在 Hover / `focus-visible` 状态只显示一条 1px 主题色装饰线。
- 留言板入口采用已确认的“单向主题雾化”方案：主题色从左侧向右自然衰减，保持纸张基底。
- 留言板背景、边框、CTA 和强调线直接跟随当前主题的 `--primary-color`。
- 留言板亮暗样式跟随站点 `data-color-scheme`，并保留统一 `220ms ease` 与减少动态适配。

## 非目标（明确不做）

- 不修改全站通用链接的 Hover 下划线规则。
- 不改变 Header 导航的文案、链接、点击区域或移动端菜单样式。
- 不修改留言板弹窗、消息流、文案、布局、头像或提交逻辑。
- 不增加位移、缩放、强阴影或额外装饰动画。

## 影响范围

- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 局部覆盖全局链接下划线，确保只显示主题色装饰线。
- `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` — 增加 Header 单下划线回归断言。
- `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts` — 重做留言板入口主题色渐变与主题状态选择器。
- `packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs` — 更新留言板渐变与主题路由回归断言。
- `openspec/specs/design-system/spec.md`、`openspec/specs/guestbook-barrage/spec.md` — 归档后同步正式规范。
