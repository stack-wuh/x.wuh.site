---
title: 全站光标系统（一页书跟随层）
domain: components
keywords: [光标, cursor, 一页书, 跟随层, bk-cursor, 热点, data-URI, idle, 翻书]
scope: [packages/components/cursor, apps/site/app/layout.tsx]
status: active
source:
  - changes/20261006-feature-custom-cursor/brief.md
  - changes/20261006-fix-cursor-follow-spring/brief.md
verified: 2026-10-07
verified-depth: runtime
verified-scope: 守卫 node --test 11/11（引擎断言 useMotionValue/useSpring/jump + 无自持 rAF + 初始类不含 on + 接管仅 takeover + armIdle clearTimeout 序；R4 热点锚 (4,4)+OFFSET(6,6)）；域 tsc 0 错误；镜像页量测两轮：v1（真实 style.tsx CSS + book.tsx SSR 标记 + 逐字引擎）指针点与书页间隙 6.3px/14.1px、六态映射全对、idle 时间线 breeze→5.4s→bk-idle-turn→一动回、24 条 data-URI 静帧 + 双 @media 门控；v2（esbuild 实包真组件 + 真 framer-motion 11.18.2）延迟接管首 pointermove 同帧精确落位 matrix=指针位−HOT 零扫移、30 连发跨 8s idle 泄漏 0、静止 5.21s 触发 idle、leave 重武装重入落位、700px 远跳终值精确收敛（观察点：design/shots/mirror-*.png、design/runtime-mirror-pointer-state.png、/tmp/cursor-mirror-v2）
---

# 全站光标系统（一页书跟随层）

## 当前结论

站点鼠标光标是一枚「摊开的一页书」，由两层构成：

1. **跟随层**（`CursorLayer`，apps/site layout 挂在 AppProviders 顶层）：CSS cursor 无法动画，pointer:fine ∧ no-reduced-motion 环境下隐藏系统光标。跟随引擎 = **framer-motion `useMotionValue`×2 + `useSpring`**（stiffness 1000 / damping 60 / mass 0.5，transform 写入与 GPU 提升归引擎）；六态/idle/popping 走 classList/dataset 直写，移动路径零 React 渲染。**延迟接管（D1）**：浏览器在指针未动时无任何 API 可读其位置，故 mount 时不接管——首个 `pointermove` 内把源值与弹簧 `jump()` 落位（扣 HOT 偏移）后同帧加 `on` + `bk-cursor-active`，刷新后不再有书形钉左上角的窗口期；`pointerleave` 重置接管标记，重入同样 jump 落位不回弹扫移。
2. **降级链**：环境不满足时 `CursorStyles` 的静态帧顶替——4 主题（wine/plain × light/dark）× 6 态共 24 条 `cursor: url(data:svg) 12 4` 规则，全部实色。

- **热点 = 画布锚 (4,4) + 书形右下偏移 OFFSET (6,6)**（data-URI 热点 `4 4`）：指针对位点与书页留出 ~6px 水平 / ~14px 垂直的视觉间隙，书摊向右下不压目标（R4 用户点名「明显错开」；同 OS 箭头「尖在点上、身往右下」直觉）。脊头钉 (12,3.6) 为装订点，不再当锚。
- 六态（default/pointer/text/wait/grab/grabbing）不换形状，只换物件使用状态：待机风掀两记（breeze 5.4s）、hover 掀页欲读（lift）、输入压成一行 + 朱基线（text）、加载哗哗翻书（turn .52s alternate）、拖拽合卷、按住压紧、点击一记轻合（popping 260ms）。
- **idle 自读书**：静止 ≥5s 升级为整页翻（bk-idle-turn 3.4s），一动立即收回；idle 规则序在交互态之前，hover/input 态覆盖 ambient。**armIdle 必须先 `clearTimeout` 再挂新定时器**——否则连续移动时积压定时器过 5s 后逐帧闪现 idle 动画（2026-10-06 用户「卡顿」反馈的主根因，守卫已钉顺序断言）。
- 纸色三面 = `color-mix(in oklab, --primary-color {30,18,38}%, --background-100)`（正/背/翻页）；实色表 `tints.ts` 与 oklab 推导由守卫交叉验证，调色板漂移即红。
- 特例态经 `data-cursor="wait|grab"` 属性声明，默认规则覆盖 `a[href]/button/[role=button]/input/textarea/[contenteditable]`。

## 执行约束

- 只动 transform/opacity；时长/缓动走 `--motion-*` 令牌；禁 scroll/resize listener；禁布局属性动画。
- 禁无开关设置项（propose 已定：不关闭、不配置）。
- 表现层文件禁裸 hex——颜色只走 CSS 变量或 `tints.ts` 推导表；data URI 禁 CSS 变量/color-mix（SVG 光标独立解析路径）。
- 静态帧必须与动效层同步维护：改几何改 `tints.ts` d 常量 + `book.tsx` 结构 + 守卫快照三处，缺一即漂移。
- 触控设备零影响：全部行为在 `@media (pointer: fine)` 与 `prefers-reduced-motion` 门控内。
- 实现期发现视觉稿错漏，先修 `design/cursor-v4.html` 再改代码。

## 适用边界

全站桌面端。不适用于：触屏/触控板 coarse 指针（自动静态帧）、reduced-motion 用户（静帧摊开书，翻页件隐藏）、`<video>`/canvas 等要求系统光标语义的场景（如需要原生 grab 手势可临时 `data-cursor` 豁免——当前站点无此需求）。

## 验证方式

```bash
node --test packages/components/cursor/cursor.test.mjs      # 纪律守卫 11 条
node --test packages/components/cursor/typecheck.test.mjs   # 域类型清零（根 tsc 不覆盖 packages/components，域守卫配方见 build-config.md）
```
断言覆盖：d 值快照、path/line/circle/rect 结构计数、keyframes 属性白名单、双 @media 门控、data-URI 禁变量、idle 规则序 + armIdle clearTimeout 序、热点锚 (4,4)+OFFSET (6,6)、tints==oklabMix 交叉验证、无 localStorage/scroll/resize、跟随引擎（framer 三件套 + jump + 无自持 rAF/translate3d 手抄 + 初始类不含 on + 接管仅在 takeover 内 + leave 重武装）。runtime 复验用 `/tmp/build-mirror-v2.mjs`（esbuild 实包真组件）重建镜像页 + 浏览器量测（模式同 SGN-003；毫秒级时序量测注意 SGN-004 帧饥饿限制）。

## 关联知识
- [设计系统](design-system.md)（纸墨·朱砂、4 主题令牌）
- [动效系统](animation-system.md)（motion 令牌、微光呼吸 × 书写显现）
- [图标系统](icon-system.md)（stroke 几何 + currentColor）
- [布局组件契约](layout-components.md)（同款站独享组件自持 keyframes 先例见 audio-player）
