---
title: 全站光标系统（一页书跟随层）
domain: components
keywords: [光标, cursor, 一页书, 跟随层, bk-cursor, 热点, data-URI, idle, 翻书, 墨晕, 墨迹, 粒子, 拖尾, 水波, 涟漪, 落笔一晕, 起笔, 颜色不像主题色]
scope: [packages/components/cursor, apps/site/app/layout.tsx]
status: active
source:
  - changes/archive/20261006-feature-custom-cursor/brief.md
  - changes/archive/20261006-fix-cursor-follow-spring/brief.md
  - changes/archive/20261006-feature-cursor-ink-trail/brief.md
  - changes/archive/20261007-feature-cursor-ink-dust/brief.md
  - changes/20261009-feature-cursor-ripple-ink/brief.md
verified: 2026-10-09
verified-depth: runtime
verified-scope: 守卫 `node --experimental-strip-types --test` 13/13（墨层新铉：Kind 仅 bleed|wave|splash、SPAWN_GAP=11、takeover 内 first() 恰一记 bleed、setInterval/clearInterval 各恰 0、field.start/stop 接线已删、墨层块 --text-color 计数 0 且 --primary-color 恰 1、三类 color-mix(currentColor) 柔边渐变、bk-ink-bleed/wave 各 3 关键帧、duration 含 --motion-dur-reveal、--px/--py/--o/--sz/--dl 五属性齐、旧六类与旧 keyframes 零残留；保留：d 值快照/结构计数/属性白名单/双门控/data-URI 禁变量/idle 序 + armIdle clearTimeout 序/热点锚 (4,4)+OFFSET(6,6)/tints==oklabMix 交叉验证/framer 三件套 + jump + 无自持 rAF）+ 域 tsc 0 错误；runtime 镜像页（esbuild 实包**真组件** cursor/index.tsx，Node 22.14）：26 步笔迹 → kinds{{bleed:38}} visible 38 opacity .157–.337；一记点击 → splash:1 + wave:3 且 --dl 恰 0/140/280ms、bk-cursor on popping 不受影响；四主题 .bk-ink computed color 逐一对表 generator-color（wl rgb(201,74,68) / wd rgb(227,106,100) / pl rgb(168,115,72) / pd rgb(212,164,120)）；?mode=coarse → live 0 且不接管、?mode=reduce → pool 0（整层不挂载）；控制台 0 错误；观察点 `shadow-docs/designs/20261009-cursor-ripple/shots/mirror-v5-{{wl,wd,pl,pd}}.png`、比稿台定格帧 `S1-drop-*.png` 与现状对照 `S0-current-wl.png`
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
- **墨晕层**（`ink.ts` 的 `InkField` + `.bk-ink` 池 ×48，20261009 起为「一滴水」形态）：指 = 笔尖、轨迹 = 纸上连续洇开的柔边墨晕，**纯事件驱动、零定时器**。事件语义：`onMove` 距上一出生点 ≥11px 沿段出生一记 `bleed`（三段柔边 radial-gradient，scale .45→2 洇开；相邻晕重叠成连续墨痕，11px 是「不散成点列」的下限，旧 6px 硬边小圆点密排的撒沙子感由此来）；`onDown`（与 popping 同源）出 **恰一粒 `splash` 落笔一晕**（四段浓淡长尾，全站唯一签名件）+ **恰三圈 `wave` 同心水波**（靠边柔环，`--dl` 错峰 0/140/280ms、逐圈变淡）；>140px 跳变视为传送只重锚不连线；**`takeover` 落点补一记 `first()` 起笔晕**——接管首帧只重锚会让轨迹没有起头（比稿台实测拖尾 0 出生的根因之一）。行笔疾徐：`--o` 在 .20–.42 逐粒随机后按平滑速度衰减（每 1px/ms 除 1.14，夹在区间内），尺寸 16px 起按速度最多放大 10.5px——慢 = 浓而小（洇得深）、快 = 淡而大。引擎纪律：**零新监听器 + 零定时器**（发射钟随尘层一起退役）、round-robin 池复用运行期零 DOM 增删、几何与浓淡经 `--px/--py/--o/--sz/--dl` 内联、动画重启机制同 popping（清类→`void offsetWidth`→重挂）、`animation-delay` 禁入 shorthand。颜色：**整层只声明一次 `--primary-color`**，浓淡一律 `currentColor` + `color-mix(in oklab, …)` 分层——`--text-color` 已从墨层退出（此前五种粒子吃正文字色、只有 speck 用主题色，就是「颜色不像主题色」的根因）。时长走 `--motion-dur-reveal` 倍数（900/1080/1200ms）且 keyframes 带驻留段（0/32/100%、0/22/100%）——纯 ease-out 会把淡出提前吃掉，实测几乎不可见。与书形同在 fine∧noReduce 门控内，降级环境 0 粒子；静态帧降级链不含粒子（CSS cursor 无法承载，属接管态专属装饰）。

## 执行约束

- 只动 transform/opacity；时长/缓动走 `--motion-*` 令牌；禁 scroll/resize listener；禁布局属性动画。
- 禁无开关设置项（propose 已定：不关闭、不配置）。
- 表现层文件禁裸 hex——颜色只走 CSS 变量或 `tints.ts` 推导表；data URI 禁 CSS 变量/color-mix（SVG 光标独立解析路径）。
- 静态帧必须与动效层同步维护：改几何改 `tints.ts` d 常量 + `book.tsx` 结构 + 守卫快照三处，缺一即漂移。
- 触控设备零影响：全部行为在 `@media (pointer: fine)` 与 `prefers-reduced-motion` 门控内。
- 墨层零新监听器、零定时器：粒子只能由 CursorLayer 既有 onMove/onDown/onLeave 喂（守卫钉 `.addEventListener` 计数恰 4），`ink.ts` 内禁出现 `window.setInterval`/`clearInterval`/`requestAnimationFrame`/`addEventListener`（守卫钉各恰 0）；出生只准 `walk()` 按 `SPAWN_GAP` 沿段插值，**任何需要时钟的周期出生形态（飘尘/呼吸）一律先提案改纪律再写代码**；新增事件语义先扩 InkField 方法（现有 `first/move/tap/reset`），不开新 listener、不起钟；池位数量改 `INK_POOL` 必须与 JSX `Array.from({ length: INK_POOL })` 同源（禁手写第二份数字）。
- 实现期发现视觉稿错漏，先修比稿台 `shadow-docs/designs/20261009-cursor-ripple/prototype.html`（`?scene=&theme=&demo=1`，四构型 + 现状对照同页可切）再改代码。

## 适用边界

全站桌面端。不适用于：触屏/触控板 coarse 指针（自动静态帧）、reduced-motion 用户（静帧摊开书，翻页件隐藏）、`<video>`/canvas 等要求系统光标语义的场景（如需要原生 grab 手势可临时 `data-cursor` 豁免——当前站点无此需求）。

## 验证方式

```bash
node --experimental-strip-types --test packages/components/cursor/cursor.test.mjs   # 纪律守卫 13 条。Node 22+ 必须带 --experimental-strip-types：测试要 import tints.ts / generator-color.ts，缺开关会有 4 条 ERR_UNKNOWN_FILE_EXTENSION 假失败（直接当成回归会无形中修一堆无关代码）。另勿以 node --test <目录>/ 方式跑：Node 24 会把目录当模块 require 报假 MODULE_NOT_FOUND
node --test packages/components/cursor/typecheck.test.mjs   # 域类型清零（根 tsc 不覆盖 packages/components，域守卫配方见 build-config.md）
```
断言覆盖：d 值快照、path/line/circle/rect 结构计数、keyframes 属性白名单与总数（书形 6 + 墨层 3 = 9）、双 @media 门控、data-URI 禁变量、idle 规则序 + armIdle clearTimeout 序、热点锚 (4,4)+OFFSET(6,6)、tints==oklabMix 交叉验证、无 localStorage/scroll/resize、跟随引擎（framer 三件套 + jump + 无自持 rAF/translate3d 手抄 + 初始类不含 on + 接管仅在 takeover 内 + leave 重武装）、墨晕层（Kind 联合仅三类、旧六类与旧 keyframes 零残留、池上限/节流阈值/round-robin 取模/传送防护/重启重排、监听器计数恰 4、接线位置、零定时器、--sz 逐粒尺寸、--text-color 禁现且 --primary-color 恰 1、三类渐变必须 currentColor + color-mix、驻留关键帧数、duration 含令牌、delay 长写、ink.ts 零色值）。runtime 复验：esbuild 实包**真组件**（入口放在 `packages/components/` 内以复用其 node_modules，反应式包 react-dom 走 `nodePaths` 回退到 `.pnpm/node_modules`）+ 镜像页注入四主题变量块与 `?mode=coarse|reduce` 的 matchMedia 桩；量测口径全部帧无关（类名记数、自定义属性、池计数、computed color 对表调色板、computed opacity 区间）；笔迹用 `setTimeout` 间隔 12ms 逐步派 `PointerEvent` 驱动（同步循环里 timeStamp 不推进，速度分档会全零）；取证截图前用 `animation-play-state: paused` 定格（无 getAnimations 的环境同样可用）；拼写错的块注释（漏收尾 `*/`）会静默吞掉后续声明并只报 ReferenceError，改完必须抽出 `<script>` 段跑 `node --check`。

## 关联知识
- [设计系统](design-system.md)（纸墨·朱砂、4 主题令牌）
- [动效系统](animation-system.md)（motion 令牌、微光呼吸 × 书写显现）
- [图标系统](icon-system.md)（stroke 几何 + currentColor）
- [布局组件契约](layout-components.md)（同款站独享组件自持 keyframes 先例见 audio-player）
