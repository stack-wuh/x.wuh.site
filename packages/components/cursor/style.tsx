import { createGlobalStyle } from 'styled-components'
import { cursorUri } from './tints'

/**
 * 光标「一页书」全局样式：
 * ① 降级链——pointer:fine 下 4 主题 × 6 态静态 SVG 光标（data URI，实色由 tints oklab 预混，禁 CSS 变量/color-mix）；
 * ② 接管——跟随层激活时 html.bk-cursor-active 隐藏系统光标；
 * ③ 跟随层动效——六态 + idle 全部只动 transform/opacity，时长/缓动走 --motion-* 令牌。
 * 规则序：breeze(ambient) → idle → 交互态——hover/输入/拖拽必须能压过自读书。
 */
const themes: Record<'base' | 'plain' | 'dark' | 'plainDark', { sel: string; key: 'wl' | 'pl' | 'wd' | 'pd' }> = {
  base: { sel: 'html', key: 'wl' },
  plain: { sel: 'html[data-theme-family=' + "'plain'" + ']', key: 'pl' },
  dark: { sel: 'html[data-color-scheme=' + "'dark'" + ']', key: 'wd' },
  plainDark: { sel: "html[data-theme-family='plain'][data-color-scheme='dark']", key: 'pd' },
}

const staticRules = (t: (typeof themes)[keyof typeof themes]) => {
  const cur = (s: Parameters<typeof cursorUri>[1]) => `${cursorUri(t.key, s)}`
  return `
  ${t.sel} body { cursor: ${cur('default')} 4 4, default; }
  ${t.sel} a[href], ${t.sel} button, ${t.sel} [role='button'] { cursor: ${cur('pointer')} 4 4, pointer; }
  ${t.sel} input, ${t.sel} textarea, ${t.sel} [contenteditable='true'] { cursor: ${cur('text')} 4 4, text; }
  ${t.sel} [data-cursor='wait'] { cursor: ${cur('wait')} 4 4, wait; }
  ${t.sel} [data-cursor='grab'] { cursor: ${cur('grab')} 4 4, grab; }
  ${t.sel} [data-cursor='grab']:active { cursor: ${cur('grabbing')} 4 4, grabbing; }
  `
}

export const CursorStyles = createGlobalStyle`
  /* ===== ① 降级链：触控/reduced-motion/JS 未激活时，系统光标位显示主题静帧 ===== */
  @media (pointer: fine) {
    ${Object.values(themes).map(staticRules).join('\n')}

    /* ===== ② 跟随层激活：交还书形，隐藏系统光标 ===== */
    html.bk-cursor-active, html.bk-cursor-active * { cursor: none !important; }
  }

  /* ===== ③ 跟随层 ===== */
  .bk-cursor {
    position: fixed;
    left: 0;
    top: 0;
    width: 30px;
    height: 30px;
    pointer-events: none;
    z-index: 9999;
    display: none;
    color: var(--text-color);
    /* 热点 = 锚 (4,4)：位移由 JS 按此换算，书形自画布 (6,6) 起绘、明显浮于指针右下（R4） */
  }
  .bk-cursor.on { display: block; }
  .bk-cursor svg { display: block; overflow: visible; }

  .bk-cursor .pl, .bk-cursor .pr {
    stroke: currentColor;
    stroke-width: 1.2;
    stroke-linejoin: round;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
    transform-box: fill-box;
  }
  /* 纸色三面（决策 D5）：正面 30% / 背面 18% / 翻页 38%，primary 混 background-100 */
  .bk-cursor .pl { fill: color-mix(in oklab, var(--primary-color) 30%, var(--background-100)); transform-origin: 100% 50%; }
  .bk-cursor .pr { fill: color-mix(in oklab, var(--primary-color) 18%, var(--background-100)); transform-origin: 0% 50%; }
  .bk-cursor .pt { transform-box: fill-box; transform-origin: 0% 50%; }
  .bk-cursor .pt .face {
    fill: color-mix(in oklab, var(--primary-color) 38%, var(--background-100));
    stroke: currentColor; stroke-width: 1.2; stroke-linejoin: round; stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
  .bk-cursor .pt .edge { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; vector-effect: non-scaling-stroke; }
  .bk-cursor .spine { fill: none; stroke: var(--primary-color); stroke-width: 1.25; stroke-linecap: round; }
  .bk-cursor .pin { fill: var(--primary-color); }
  .bk-cursor .rules { opacity: 0; transition: opacity var(--motion-dur-quick, 150ms) var(--motion-ease-out-soft, cubic-bezier(0.22, 1, 0.36, 1)); }
  .bk-cursor .rules path { fill: none; stroke: currentColor; stroke-width: 1; stroke-linecap: round; opacity: 0.42; vector-effect: non-scaling-stroke; }
  .bk-cursor .base {
    fill: var(--primary-color);
    transform-box: fill-box;
    transform-origin: 0% 50%;
    transform: scaleX(0);
    transition: transform 240ms var(--motion-ease-out-soft, cubic-bezier(0.22, 1, 0.36, 1));
  }

  /* 离散状态形变：reduced-motion 下同样成立（只是不动） */
  .bk-cursor[data-state='text'] .pl, .bk-cursor[data-state='text'] .pr { transform: scaleY(0.36); transform-origin: 100% 100%; }
  .bk-cursor[data-state='text'] .pr { transform-origin: 0% 100%; }
  .bk-cursor[data-state='text'] .pt, .bk-cursor[data-state='grab'] .pt { display: none; }
  .bk-cursor[data-state='text'] .base { transform: scaleX(1); }
  .bk-cursor[data-state='text'] .rules { opacity: 0.5; }
  .bk-cursor[data-state='pointer'] .pr { fill: color-mix(in oklab, var(--primary-color) 26%, var(--background-100)); }
  .bk-cursor[data-state='pointer'] .rules { opacity: 1; }
  .bk-cursor[data-state='grab'] .pl { transform: scaleX(0.5); }
  .bk-cursor[data-state='grab'] .pr { transform: scaleX(0.4); }

  @keyframes bk-breeze {
    0%, 56% { transform: scaleX(1); opacity: 0; }
    61% { transform: scaleX(0.78); opacity: 1; }
    66% { transform: scaleX(0.5); opacity: 1; }
    71% { transform: scaleX(0.9); opacity: 1; }
    78% { transform: scaleX(0.12); opacity: 1; }
    87% { transform: scaleX(-0.42); opacity: 1; }
    93%, 100% { transform: scaleX(1); opacity: 0; }
  }
  /* idle 自读书（D7）：静止 ≥5s 后整页翻——掀起→越脊→落左页→化去 */
  @keyframes bk-idle-turn {
    0%, 26% { transform: scaleX(1); opacity: 0; }
    34% { transform: scaleX(0.6); opacity: 1; }
    55% { transform: scaleX(-0.7); opacity: 1; }
    66%, 84% { transform: scaleX(-1); opacity: 1; }
    92%, 100% { transform: scaleX(-1); opacity: 0; }
  }
  @keyframes bk-lift {
    50% { transform: scaleX(0.08); opacity: 1; }
  }
  @keyframes bk-turn {
    to { transform: scaleX(-1); opacity: 1; }
  }
  @keyframes bk-close-l {
    50% { transform: scaleX(0.3); opacity: 1; }
  }
  @keyframes bk-press-r {
    50% { transform: scaleX(0.44) scaleY(0.72); opacity: 1; }
  }

  @media (prefers-reduced-motion: no-preference) {
    .bk-cursor .pt { animation: bk-breeze 5.4s var(--motion-ease-in-out-soft, cubic-bezier(0.45, 0, 0.25, 1)) infinite; }
    /* idle 必须先于交互态：hover/输入/拖拽覆盖自读书 */
    .bk-cursor.idle .pt { animation: bk-idle-turn 3.4s var(--motion-ease-in-out-soft, cubic-bezier(0.45, 0, 0.25, 1)) infinite; }
    .bk-cursor[data-state='pointer'] .pt { animation: bk-lift 1.05s var(--motion-ease-in-out-soft, cubic-bezier(0.45, 0, 0.25, 1)) infinite; opacity: 1; }
    .bk-cursor[data-state='wait'] .pt { animation: bk-turn 0.52s var(--motion-ease-in-out-soft, cubic-bezier(0.45, 0, 0.25, 1)) infinite alternate; opacity: 1; }
    .bk-cursor[data-state='grabbing'] .pl { animation: bk-close-l 0.3s var(--motion-ease-in-out-soft, cubic-bezier(0.45, 0, 0.25, 1)) infinite; }
    .bk-cursor[data-state='grabbing'] .pr { animation: bk-press-r 0.3s var(--motion-ease-in-out-soft, cubic-bezier(0.45, 0, 0.25, 1)) infinite; }
    .bk-cursor.popping .pt { animation: none; }
    .bk-cursor.popping .pl { animation: bk-close-l 260ms var(--motion-ease-out-soft, cubic-bezier(0.22, 1, 0.36, 1)); }
  }
  /* reduced-motion / 未接管环境：翻页件与行林静默，书保持摊开静帧 */
  @media (prefers-reduced-motion: reduce) {
    .bk-cursor .pt { display: none; }
  }
`
