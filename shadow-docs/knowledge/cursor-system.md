---
title: 全站光标系统（一页书跟随层）
domain: components
keywords: [光标, cursor, 一页书, 跟随层, bk-cursor, 热点, data-URI, idle, 翻书, 墨迹, 粒子, 拖尾, 溅墨, 墨尘, 晕圈]
scope: [packages/components/cursor, apps/site/app/layout.tsx]
status: active
source:
  - changes/20261006-feature-custom-cursor/brief.md
  - changes/20261006-fix-cursor-follow-spring/brief.md
  - changes/20261006-feature-cursor-ink-trail/brief.md
  - changes/20261007-feature-cursor-ink-dust/brief.md
verified: 2026-10-07
verified-depth: runtime
verified-scope: 守卫 node --test 13/13（引擎断言 useMotionValue/useSpring/jump + 无自持 rAF + 初始类不含 on + 接管仅 takeover + armIdle clearTimeout 序 + 第 12 条墨层断言（池 32→48 round-robin/6px 节流/addEventListener 计数恰 4/四类 keyframes/粒子色仅 token/animation-delay 长写）+ 第 13 条尘晕断言（window.setInterval 恰 1/clearInterval 恰 1/start 幂等/takeover 起钟·leave+cleanup 双停钟/halo 恰 1/dust·halo keyframes/--o/hot 朱砂）；R4 热点锚 (4,4)+OFFSET(6,6)）；域 tsc 0 错误；镜像页量测四轮：v1（真实 style.tsx CSS + book.tsx SSR 标记 + 逐字引擎）指针点与书页间隙 6.3px/14.1px、六态映射全对、idle 时间线 breeze→5.4s→bk-idle-turn→一动回、24 条 data-URI 静帧 + 双 @media 门控；v2（esbuild 实包真组件 + 真 framer-motion 11.18.2）延迟接管首 pointermove 同帧精确落位 matrix=指针位−HOT 零扫移、30 连发跨 8s idle 泄漏 0、静止 5.21s 触发 idle、leave 重武装重入落位、700px 远跳终值精确收敛；v3（实包 worktree 真组件含墨层，注入 PointerEvent + defineProperty 合成 timeStamp 速度钟）慢爬 3 步恰 3 粒 dot、300px 传送 0 出生、快移 27 粒 floss、急停 bead、点击 speck、100 连发池恒 32 全员复用、leave/重入 on 与 jump 落位、?mode=coarse|reduce 双环境 0 粒子、四主题各 32 粒四类齐；v4（含尘晕，:8916）静止 2s 尘 7 粒拍出、快移后尘拖曳 mean x=518.8<指针 540、点击 halo=1 speck=6、leave 1.5s 全 48 槽冻结停钟、重入复发、双降级零粒零晕、四主题 seek 定格 design/mirror-v4-{wl,wd,pl,pd}.png（观察点另含 design/shots/mirror-*.png、/tmp/cursor-mirror-v2、/tmp/cursor-mirror-v3、/tmp/cursor-mirror-v4）
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
- **墨迹粒子层**（`ink.ts` 的 `InkField` + `.bk-ink` 池 ×48，v1.4.69 起逐步追加）：指 = 笔尖、轨迹 = 纸上残墨——粒子出生在世界坐标后不再移位，只按 keyframes 洇开淡出（非悬在指针后的跟随链）。事件语义：`onMove` 距上一出生点 ≥6px 钉一粒（平滑速度 <1.2px/ms 圆墨点 / 以上沿速度向拉长墨丝，连续快移墨丝相接成笔触）；速度自 ≥1.5 断崖跌破 <0.2px/ms 甩 1–2 粒墨珠；`onDown`（与 popping 同源）溅 5–8 粒朱砂墨渣错峰淡灭 + **恰一粒 `halo` 落笔晕圈**（透明心 currentColor 细描边环，scale .4→2.8 放大淡出，-50% 自居于点击位）；>140px 跳变视为传送只重锚不连线。**环绕墨尘 `dust`**（v1.4.74）：接管后 `setInterval` 单发射钟（200ms × P0.8）在指针位环带 10–24px 出生缓升微尘（`--dy` 负升 12–30px、`--dx` 摆 ±3、`--o` 逐粒浓淡 0.05–0.18、1/6 概率朱砂 `hot` 尘）；平滑速度 ≥0.3px/ms 时出生点向速度反方向拖曳（最多退 24px，静止后仍按末速度偏置=视觉上「尘继续落在身后」，属特性非缺陷）；leave/cleanup 双停钟（stop 幂等清零 timer，start 见 timer 直接 return）。引擎纪律：**零新监听器 + 域内唯一发射钟**（`window.setInterval`/`clearInterval` 各恰一处，守卫钉死；生命周期绑 takeover/leave/cleanup）、round-robin 池复用运行期零 DOM 增删、几何全部经 `--px/--py/--ang/--dx/--dy/--dl/--o` 自定义属性内联、动画重启机制同 popping（清类→`void offsetWidth`→重挂）、`animation-delay` 禁入 shorthand（简写会把 var 错峰延迟重置为 0，全类长写）。颜色仅两 token：墨 = `--text-color`（currentColor 继承）、朱砂渣/热尘 = `--primary-color`；与书形同在 fine∧noReduce 门控内，降级环境 0 粒子（v3 拖尾/v4 尘晕双 mode 实测）；静态帧降级链不含粒子（CSS cursor 无法承载，属接管态专属装饰）。

## 执行约束

- 只动 transform/opacity；时长/缓动走 `--motion-*` 令牌；禁 scroll/resize listener；禁布局属性动画。
- 禁无开关设置项（propose 已定：不关闭、不配置）。
- 表现层文件禁裸 hex——颜色只走 CSS 变量或 `tints.ts` 推导表；data URI 禁 CSS 变量/color-mix（SVG 光标独立解析路径）。
- 静态帧必须与动效层同步维护：改几何改 `tints.ts` d 常量 + `book.tsx` 结构 + 守卫快照三处，缺一即漂移。
- 触控设备零影响：全部行为在 `@media (pointer: fine)` 与 `prefers-reduced-motion` 门控内。
- 墨层零新监听器、单发射钟：粒子只能由 CursorLayer 既有 onMove/onDown/onLeave 喂（守卫钉 `.addEventListener` 计数恰 4），周期出生只准 `InkField.start()/stop()` 内域内唯一的 `window.setInterval`（守卫钉 setInterval/clearInterval 各恰 1，起停只挂 takeover/leave/cleanup）；新增事件语义先扩 InkField 方法，不开新 listener、不起第二个钟；池位数量改 `INK_POOL` 必须与 JSX `Array.from({ length: INK_POOL })` 同源（两处常量同源即安全，禁手写第二份数字）。
- 实现期发现视觉稿错漏，先修 `design/cursor-v4.html` 再改代码。

## 适用边界

全站桌面端。不适用于：触屏/触控板 coarse 指针（自动静态帧）、reduced-motion 用户（静帧摊开书，翻页件隐藏）、`<video>`/canvas 等要求系统光标语义的场景（如需要原生 grab 手势可临时 `data-cursor` 豁免——当前站点无此需求）。

## 验证方式

```bash
node --test packages/components/cursor/cursor.test.mjs      # 纪律守卫 13 条（勿以 node --test <目录>/ 方式跑：Node 24 会把目录当模块 require 报假 MODULE_NOT_FOUND）
node --test packages/components/cursor/typecheck.test.mjs   # 域类型清零（根 tsc 不覆盖 packages/components，域守卫配方见 build-config.md）
```
断言覆盖：d 值快照、path/line/circle/rect 结构计数、keyframes 属性白名单、双 @media 门控、data-URI 禁变量、idle 规则序 + armIdle clearTimeout 序、热点锚 (4,4)+OFFSET (6,6)、tints==oklabMix 交叉验证、无 localStorage/scroll/resize、跟随引擎（framer 三件套 + jump + 无自持 rAF/translate3d 手抄 + 初始类不含 on + 接管仅在 takeover 内 + leave 重武装）、墨迹粒子层（池上限/节流阈值/round-robin 取模/重启重排/传送防护/监听器计数/接线位置/token 色/delay 长写）、尘晕（`window.setInterval`·`clearInterval` 各恰 1/start 幂等/takeover 起钟·leave+cleanup 停钟/halo 恰 1 粒/dust·halo keyframes/--o 逐粒/hot 朱砂/ink.ts 零色值）。runtime 复验用 `/tmp/build-mirror-v4.mjs`（esbuild 实包真组件，含墨层尘晕；`?mode=coarse|reduce` 验降级）重建镜像页 + 浏览器量测——粒子层断言全部帧无关（类名/自定义属性/池计数）；速度分类用 `Object.defineProperty(ev,'timeStamp')` 合成事件钟驱动，与渲染钟解耦；尘节拍用真实时间窗（静止 2s 计数出生）而非帧计数；CSS 动画视觉取证用 `getAnimations()` pause+seek 定格再截图；镜像帧钟须保持 setTimeout 自动泵链存活（初始静默暂停会冻死 framer 帧循环，SGN-003 二坑）；弹簧毫秒级收敛曲线仍不可测（SGN-004 帧饥饿 + framer 真实时间线，跟手感归 field；模式同 SGN-003）。

## 关联知识
- [设计系统](design-system.md)（纸墨·朱砂、4 主题令牌）
- [动效系统](animation-system.md)（motion 令牌、微光呼吸 × 书写显现）
- [图标系统](icon-system.md)（stroke 几何 + currentColor）
- [布局组件契约](layout-components.md)（同款站独享组件自持 keyframes 先例见 audio-player）
