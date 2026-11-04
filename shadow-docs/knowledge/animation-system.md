---
title: 动画规范
domain: frontend
keywords: [动画, 动效, motion, 滚动渐入, view-timeline, view-transition, 书写显现, reduced-motion, MotionStyles, reveal, 静交互, 浓时刻, 墨显, 浮墨, 落按, 行墨, 换墨, 换幕, content-swap, mount-rise, useViewTransition, dur-base, transition-fast, 过渡税, 主题切换]
scope:
  - apps/site/app/styles/motion.ts
  - packages/components/themes/tokens.ts
  - packages/components/themes/index.ts
  - packages/components/themes/cssVariableProvider.tsx
  - apps/site/app/components/theme/ThemeModeProvider.tsx
  - packages/hooks/useViewTransition/index.ts
  - apps/site/app/HomeView
status: active
source:
  - changes/archive/20260828-P-site-animation-system/brief.md
  - changes/20260929-feature-mini-player-title-marquee/brief.md
  - changes/archive/20261023-style-site-motion-foundation/brief.md
  - changes/20261104-style-state-transition-motion/brief.md
verified: 2026-11-04
verified-depth: runtime
verified-scope: 20261104 换幕上线（20261104-style-state-transition-motion：/music 切年与 /footprint 选点 startViewTransition 全链路真机实证——vtLog called→cb-enter→cb-exit、Content computed content-swap、MotionStyles 换幕三规则经 document.styleSheets 下发、--motion-dur-base 实测 220ms；换幕跳过 unhandledRejection 修复后 dev 日志零新增；hook 契约测试 7/7（loader 桩行为级）；根 tsc 0、oxlint 0 err、next build 14/14（ambient node24+1400 配方）；两项基线漂移已由 20261104-docs-knowledge-reconcile 对账：裸 ease 白名单修正见验证方式段、music 移动端 wiring 3 条旧正则由 20261104-test-music-guards-realign 对齐）
---

# 动画规范

## 当前结论

全站动效语言为「**静交互 × 浓时刻**」（20261023-style-site-motion-foundation 起，与桌面端素笺家族语法同源）：交互层快而克制、动效预算留给叙事时刻；入场/滚动语言仍是「微光呼吸 × 书写显现」——动画只做「被照亮」（opacity + translateY 12px 缓入）和「被写下」（标题逐行浮现 400ms/行）两件事，不做位移炫技。

**静交互词表（全站唯一交互语法）**：**墨显**=悬停文字/行 color/bg 150ms；**浮墨**=悬停卡片/钮 边框/阴影/位移≤2px 150–220ms；**落按**=按压 translateY(1px) ≤100ms；**行墨**=状态切换（TOC 当前章/选中态）220ms；**换墨**=主题切换 scoped 颜色过渡 300ms（仅切换瞬间）。缓动统一 `--motion-ease-out-soft`，裸 `ease`/裸时长清零。

**motion tokens** 由主题注入层以 `--motion-*` 前缀发射：ease-out-soft / ease-in-out-soft / dur-quick 150ms / **dur-base 220ms（20261023 新增，状态过渡基档）** / dur-reveal 600ms / dur-write 400ms，与 `--space-*` 同层同机制。`--transition-fast` 已退役（20261023），引用一律改 `var(--motion-dur-quick)`（共享组件带 fallback）。

**通配过渡税禁令（20261023）**：全局 `* { transition: … }` 选择器禁止存在——常态通配过渡让全站 hover/状态反馈迟钝发闷。主题切换平滑改由 **scoped 换墨**承担：ThemeModeProvider 在用户切换主题/外观/系统明暗变化的瞬间挂 `html[data-theme-switching]`，cssVariableProvider 的 scoped 块（300ms ease-in-out-soft）接管颜色过渡，340ms 后自动卸载；初始恢复与 reduced-motion 不挂。

动画唯一来源为 `MotionStyles` 全局样式（关键帧 rise-fade/write-fade、`.reveal` 滚动渐入模式、`@view-transition` 页面切换、print/reduced-motion 降级），业务组件不重定义关键帧。滚动渐入走纯 CSS `animation-timeline: view()`（`.reveal` 类，@supports 门控，不支持直显），仅适用行/卡片级元素——高度接近视口的区块勿挂（entry 百分比按元素自身高度计，会拉长动画）。

页面切换为纯 CSS `@view-transition { navigation: auto }` + 350ms 交叉淡入淡出，仅覆盖同源硬导航（地址栏/外链进入）；Next 软导航保持瞬时。Next 16 已移除 `experimental.viewTransition`，React 19.2 稳定版无 `<ViewTransition>` 组件，软导航过渡需 JS 包装或 React canary，届时单独评估。

**换幕（20261104-style-state-transition-motion 起）**=用户操作触发的状态切换内容区过渡，双层按 DOM 提交时机分治：**层 1 交叉淡化**——本地 state 场景经共享 hook `useViewTransition().withTransition(commit)` 提交（`startViewTransition` 回调内 `flushSync` 同步落 DOM），消费方内容区挂 `view-transition-name: content-swap`（**同页唯一、挂外层稳定壳**，条件渲染的内层不持名），`::view-transition-old/new(content-swap)` 走 `--motion-dur-base` + ease-out-soft 并复用硬导航 vt-fade-out/vt-fade-in-rise 关键帧；**层 2 mount 入场**——软导航 `router.push` 提交时机不可控（startViewTransition 回调无法同步等到新内容），内容子树按身份（页码+筛选/页码/文章号/label）挂 key 强制重挂 + `.mount-rise` 模式（复用 rise-fade 关键帧，不走 view() 时间线，重挂即重放）。**出场语言=「入场即过渡」**：被移除 DOM 不做出场动画（React 移除即瞬时；framer-motion AnimatePresence 双缓冲仅 image-preview 弹层特例，非列表先例），出场突兀由「旧内容停留到新数据到达」的等待期掩盖。hook 三分支回落（无 document / 特性不支持 / reduced-motion → 直接 commit，功能零变化），`ready/finished` 拒绝吸收（连切/文档隐藏导致的换幕跳过属正常业务态；`updateCallbackDone` 不吞——真实 commit 失败保持响亮）。软导航自身的导航过渡（区别于页内状态切换）仍属届时单独评估项。

浓时刻入场三构中已定稿**构 2·晕开**（题名墨线一划 + 内容自题名处向下洇开，视觉稿 `shadow-docs/designs/20261023-motion-language/index.html`），实现拆后继变更（依赖 dur-base 令牌已就位）。

## 执行约束

- 新动画必须引用 `--motion-*` tokens；关键帧只在 MotionStyles 定义，组件内不重定义
- **交互过渡只走静交互词表（墨显/浮墨/落按/行墨/换墨）**；禁止裸 `ease`、裸时长、`--transition-fast`；缓动统一 ease-out-soft（持续状态指示类动画如呼吸/行笔自持节奏除外）
- **禁止全局通配 `* { transition }`**；主题切换平滑只经 `html[data-theme-switching]` scoped 块（ThemeModeProvider 挂/卸）
- html/body 的 overflow-x 必须保持 `clip`：`hidden` 会让 body 成为滚动容器，导致 view() 时间线永远判定元素已入视口、滚动渐入整体失效
- 禁止为动画重新引入 JS scroll/resize 监听器
- packages/components 共享组件引用 motion 令牌必须带 fallback：`var(--motion-dur-quick, 150ms)`（console 不注入主题变量时走 fallback 仍可渲染，20261023 起 fallback 形式即合规；裸 `var(--motion-*)` 引用禁止）；audio-player 仍为站点专属自持例外
- 正文阅读区与评论区不做入场动画；reduced-motion 与 print 必须有降级
- **状态切换内容区过渡走换幕两层（20261104）**：本地 state → 层 1 `withTransition` + content-swap；软导航 → 层 2 身份 key + `.mount-rise`；时长一律 dur-base 档，禁另起时长
- **换幕纪律**：content-swap 同页唯一且挂外层稳定壳；hook 的 commit 只包视觉提交（setState 等），数据失败回落等拒绝路径不得进回调；消费方不得自行吞 commit 异常（跳过拒绝吸收已内聚在 hook）

## 适用边界

既有动画（打字机、阅读进度条、skeleton、博客列表入场）保留各自时长，只对齐缓动语言；Dialog/Message 等共享组件经 fallback 形式纳入静交互词表（20261023 修订，console 安全不破）；audio-player 自持例外保持。

## 验证方式

检查 MotionStyles 中关键帧唯一性与降级块；grep html/body 的 overflow-x 为 clip；新增动画引用 motion tokens 且带 reduced-motion 降级。静交互词表探针（20261023 起）：`grep -rn "transition-fast" apps packages` 应为空；grep 通配 `* { transition` 应仅剩 data-no-transition/data-theme-switching 两块 scoped。裸 ease 白名单（**20261104 考古对账修正**，原「image:55」行号漂移且漏计 dialog）：audio-player 自持节奏 + `image-preview/styles/index.tsx:43,218`（源自 517fe7d3 ImagePreview 初版）+ `dialog/styles/index.tsx:123`（源自 41db5be6 dialog 重设计，出场 `ease` 与入场过冲 cubic-bezier 有意区分）——三处均先于本卡定稿存在（foundation 合并前夜 831ebdea 即在位），属口径漂移非回归；各带手调手感，保留各自节奏，强推 ease-out-soft 属行为变更需单独评估。

## 关联知识

- [blog scroll behavior](./blog-scroll-behavior.md)
- [design system](./design-system.md)
- [first load performance](./first-load-performance.md)
