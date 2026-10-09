# 光标特效改版 · 水波 + 墨晕（设计决策清单）

> 视觉稿：`prototype.html`（常驻预览 http://127.0.0.1:8770/prototype.html）
> 定稿构型：**S1 一滴水** · 用户 2026-10-09 认可（「效果不错，开始实现吧」）
> 否决留档：S2 墨洇长痕 / S3 涟漪场 / S4 界格涟漪（同页可切，未采纳但保留可回溯）

## 设计立场

- 站点设计语言 = 纸墨·朱砂「一页书」；本次把通用控件翻译进这套语言：
  mouse trail → **运笔残墨**；click ripple → **落纸一滴**；speed feedback → **行笔疾徐**。
- 唯一签名件 = **落笔一晕**（splash + 同心水波），其余全安静：零发光、零阴影、零第四强调色。
- 自检否决方向：彩虹发光粒子（现状的近亲）、SVG feTurbulence 湍流（性能与纪律双越界）、Canvas 水墨场（为装饰重写引擎，评级升 L）。

## 决策清单（逐条映射实现文件与守卫断言）

| # | 决策 | 实现文件 | 守卫断言 |
|---|---|---|---|
| D1 | 触发映射：移动 = 墨晕 bleed；点击 = splash 1 粒 + wave 3 圈错峰 0/140/280ms；`dot/floss/bead/speck/halo/dust/hot` 全退役 | `ink.ts` | Kind 联合仅 `bleed\|wave\|splash`；旧类名在 cursor 域内出现次数 = 0 |
| D2 | 颜色口径：整层 `color: var(--primary-color)`，禁 `--text-color`；浓淡一律 `color-mix(in oklab, currentColor N%, transparent)` 分层 | `style.tsx` | `.bk-ink` 块内 `--text-color` 计数 = 0、`--primary-color` 恰 1；`ink.ts` 零色值 |
| D3 | 柔边元件：bleed 三段（92% 0–26% / 42% 52% / transparent 80%）、wave 靠边柔环（transparent 0–70% / 54% 84% / transparent 97%）、splash 四段长尾 | `style.tsx` | keyframes 属性白名单仍只 transform/opacity；background 只出现在类规则 |
| D4 | 驻留段：bk-bleed 0/32/100%（32% 处 opacity = --o×.92）、bk-wave 0/22/100%，修掉 ease-out 提前淡没 | `style.tsx` | bk-bleed 与 bk-wave 各含 3 个关键帧 |
| D5 | 出生密度：`SPAWN_GAP` 6→11px、新增 `--sz` 逐粒尺寸；`INK_POOL` 48、`MAX_PER_MOVE` 8、`TELEPORT` 140 不变 | `ink.ts` | SPAWN_GAP=11、池与 JSX `Array.from({length:INK_POOL})` 同源 |
| D6 | 起笔一晕：`takeover()` 落点补一记 bleed（o = oMax×.85）——原型实测根因，接管首帧只重锚会让轨迹没有起头 | `ink.ts` | takeover 内恰一次出生且 kind = bleed |
| D7 | 发射钟退役：删 `DUST_INTERVAL/DUST_PROB/start()/stop()` 的 setInterval，生命周期纯事件驱动 | `ink.ts` `index.tsx` | `setInterval`/`clearInterval` 计数由「各恰 1」改为「各恰 0」 |
| D8 | 降级链与跟随引擎零改动：24 条静帧 data-URI、`pointer:fine ∧ no-reduced-motion` 门控、framer 三件套、HOT(4,4)+OFFSET(6,6) | 不改 | 原有静帧/热点/引擎断言全部保持绿 |
| D9 | 时长令牌化：bleed 900ms=reveal×1.5、wave 1080ms=reveal×1.8、splash 1200ms=reveal×2；`animation-delay` 长写 | `style.tsx` | 墨层 duration 表达式必须含 `--motion-dur-`；delay 禁入 shorthand |

## 取证

- `shots/S1-drop-{wl,wd,pl,pd}.png` 四主题定格帧（自动笔迹 + 落笔一晕）。
- `shots/S0-current-wl.png` 现状对照：酒红明下拖尾几乎不可见（`--text-color` 近黑硬点），即用户「颜色不是主题色」的现场证据。
- DOM 量测：修复注释未闭合 bug 后 `bleed` 瞬时 16 粒在位、opacity .20–.34、控制台 0 错误。
- 原型期踩坑（须带进实现）：块注释漏收尾 `*/` 会静默吞掉后续声明，只报 ReferenceError；改完必须 `node --check` 抽出的 script 段。
