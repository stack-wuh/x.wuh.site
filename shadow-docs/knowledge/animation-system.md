---
title: 动画规范
domain: frontend
keywords: [动画, 动效, motion, 滚动渐入, view-timeline, view-transition, 书写显现, reduced-motion, MotionStyles, reveal]
scope:
  - apps/site/app/styles/motion.ts
  - packages/components/themes/tokens.ts
  - packages/components/themes/cssVariableProvider.tsx
  - apps/site/app/HomeView
status: active
source:
  - changes/archive/20260828-P-site-animation-system/brief.md
verified: 2026-08-29
---

# 动画规范

## 当前结论

全站动画遵循「微光呼吸 × 书写显现」语言：动画只做「被照亮」（opacity + translateY 12px 缓入）和「被写下」（标题逐行浮现 400ms/行）两件事，不做位移炫技。motion tokens 由主题注入层以 `--motion-*` 前缀发射：ease-out-soft / ease-in-out-soft / dur-quick 150ms / dur-reveal 600ms / dur-write 400ms，与 `--space-*` 同层同机制。

动画唯一来源为 `MotionStyles` 全局样式（关键帧 rise-fade/write-fade、`.reveal` 滚动渐入模式、`@view-transition` 页面切换、print/reduced-motion 降级），业务组件不重定义关键帧。滚动渐入走纯 CSS `animation-timeline: view()`（`.reveal` 类，@supports 门控，不支持直显），仅适用行/卡片级元素——高度接近视口的区块勿挂（entry 百分比按元素自身高度计，会拉长动画）。

页面切换为纯 CSS `@view-transition { navigation: auto }` + 350ms 交叉淡入淡出，仅覆盖同源硬导航（地址栏/外链进入）；Next 软导航保持瞬时。Next 16 已移除 `experimental.viewTransition`，React 19.2 稳定版无 `<ViewTransition>` 组件，软导航过渡需 JS 包装或 React canary，届时单独评估。

## 执行约束

- 新动画必须引用 `--motion-*` tokens；关键帧只在 MotionStyles 定义，组件内不重定义
- html/body 的 overflow-x 必须保持 `clip`：`hidden` 会让 body 成为滚动容器，导致 view() 时间线永远判定元素已入视口、滚动渐入整体失效
- 禁止为动画重新引入 JS scroll/resize 监听器
- packages/components 共享组件不得引用 `--motion-*`（console 不注入主题变量，引用会坏）
- 正文阅读区与评论区不动画；reduced-motion 与 print 必须有降级

## 适用边界

既有动画（打字机、阅读进度条、skeleton、博客列表入场）保留各自时长，只对齐缓动语言；Dialog/Message 等共享组件维持自有节奏不入规范。

## 验证方式

检查 MotionStyles 中关键帧唯一性与降级块；grep html/body 的 overflow-x 为 clip；新增动画引用 motion tokens 且带 reduced-motion 降级。

## 关联知识

- [blog scroll behavior](./blog-scroll-behavior.md)
- [design system](./design-system.md)
- [first load performance](./first-load-performance.md)
