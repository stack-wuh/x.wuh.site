/**
 * 光标「一页书」资产层：几何 d 值 + 四题静态帧（data-URI 降级链）+ 纸色表。
 * 纯数据模块（零 import）：node 可直读（守卫交叉验证用），styled 层只做接线。
 *
 * 几何逐字移植自视觉稿 shadow-docs/changes/20261006-feature-custom-cursor/design/cursor-v4.html，
 * cursor.test.mjs 钉 d 值快照，防实现期静默偏离（视觉稿即规格）。
 *
 * 配色推导（决策 D5）：纸面正/背/翻页 = color-mix(in oklab, --primary-color {30,18,38}%, --background-100)。
 * 动效层直接写 CSS color-mix + 变量；静态帧走 `cursor: url(data-uri)`——SVG 光标是独立解析路径，
 * CSS 变量与 color-mix 皆不可用，故离线预混成实色落表。
 * 每行出处 = packages/components/themes/generator-color.ts（调色板单一事实源）：
 *   wl primary-500 #C94A44 / background-100 #FFFBF8 · normal-900 #2A1E16（L22-35）
 *   wd primary-500 #E36A64 / background-100 #111111（generate('#0a0404','dark')[0]）· text-color 暗态=normal-500 #adadad（L37）
 *   pl primary-600 #A87348 / background-100 #FFFDF9 · normal-900 #2A2218（L50-76）
 *   pd primary-600 #deb896 / background-100 #1c1814 · normal-900 rgba(255,255,255,.72)（L55-81）
 * 混色值由守卫测试以独立 oklab 实现交叉验证，调色板漂移即红。
 */
export type CursorThemeKey = 'wl' | 'wd' | 'pl' | 'pd'
export type CursorState = 'default' | 'pointer' | 'text' | 'wait' | 'grab' | 'grabbing'

/* ===== 几何常量（30×30 画布）=====
   热点 = 锚 (4,4)；书形整体右下平移 +6/+6（OFFSET）——指针对位点与书页之间留出
   ~6px 视觉间隙，明显错开（R4：常态下书不得压住正在指的东西）。 */
export const OFFSET: [number, number] = [6, 6]
export const HOT: [number, number] = [4, 4]
/** 左页（正面）：上缘向书口扬起、书口微外凸、下缘镜像回落 */
export const P1 = 'M11.5 6.5C9 5.2 6.4 4.6 4.3 4.9L4.3 14.7C6.4 14.4 9 15 11.5 16.2Z'
/** 右页（背面，淡一档） */
export const P2 = 'M12.5 6.5C15 5.2 17.6 4.6 19.7 4.9L19.7 14.7C17.6 14.4 15 15 12.5 16.2Z'
/** 翻页纸口弧边（右页版） */
export const EDGE = 'M19.7 4.9C20 8 20 11.8 19.7 14.7'
/** hover 掀起的窄叶 */
export const LIFT = 'M12.5 6.5C13.9 5.7 14.9 5.2 15.8 4.9L15.8 14.9C14.9 14.7 13.9 15.2 12.5 16.2Z'
/** 翻过书脊落在左页的窄叶 + 其纸口弧边（左页版） */
export const FLIP = 'M12.5 6.5C10 5.2 7.4 4.6 5.3 4.9L5.3 14.7C7.4 14.4 10 15 12.5 16.2Z'
export const FLIP_EDGE = 'M5.3 4.9C5 8 5 11.8 5.3 14.7'
/** 合卷两叶（grab） */
export const GRAB_L = 'M11.5 6.5C9.9 5.6 8.5 5.1 7 5.1L7 14.8C8.5 14.6 9.9 15.2 11.5 16.2Z'
export const GRAB_R = 'M12.5 6.5C14.1 5.6 15.2 5.1 16.3 5.1L16.3 14.8C15.2 14.6 14.1 15.2 12.5 16.2Z'
/** 压紧书叠（grabbing） */
export const GB_L = 'M11.5 8C10.2 7.2 9 6.8 8 6.9L8 14.4C9 14.3 10.2 14.8 11.5 15.6Z'
export const GB_R = 'M12.5 8C13.8 7.2 15 6.8 16 6.9L16 14.4C15 14.3 13.8 14.8 12.5 15.6Z'
/** 输入态压平的扁叶（书即一行文本） */
export const TB_L = 'M4.3 14.3C6.6 13.9 9.2 14.7 11.5 15.6L11.5 16.6C9.2 15.8 6.6 15.1 4.3 15.4Z'
export const TB_R = 'M19.7 14.3C17.4 13.9 14.8 14.7 12.5 15.6L12.5 16.6C14.8 15.8 17.4 15.1 19.7 15.4Z'
/** 底页三行弧字（hover/输入态浮出） */
export const RULES = [
  'M14 8.3C15.7 7.7 17.4 7.4 18.9 7.5',
  'M14 10.6C15.7 10 17.4 9.7 18.9 9.8',
  'M14 12.9C15.4 12.4 16.7 12.1 17.7 12.1',
]

/* ===== 四题色表（推导见文件头；守卫交叉验证 oklabMix(paper→primary, w)） ===== */
export const PRIMARY: Record<CursorThemeKey, string> = {
  wl: '#C94A44', wd: '#E36A64', pl: '#A87348', pd: '#deb896',
}
export const INK: Record<CursorThemeKey, string> = {
  wl: '#2A1E16', wd: '#adadad', pl: '#2A2218', pd: 'rgba(255,255,255,.72)',
}
/** 三面纸色：正面 30% / 背面 18% / 翻页 38%（primary 混入 background-100） */
export const PAPER: Record<CursorThemeKey, { pg: string; pgb: string; pgf: string }> = {
  wl: { pg: '#de8279', pgb: '#d66d64', pgf: '#e39087' },
  wd: { pg: '#9d4e49', pgb: '#b95954', pgf: '#8c4743' },
  pl: { pg: '#c39b7c', pgb: '#b88b67', pgf: '#caa68a' },
  pd: { pg: '#9e836b', pgb: '#b7987c', pgf: '#8d7660' },
}

/* ===== 六态静态帧（降级链资产：触控 / reduced-motion / JS 未激活时顶替跟随层） ===== */
const svgWrap = (inner: string) =>
  `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'><g transform='translate(${OFFSET[0]},${OFFSET[1]})'>${inner}</g></svg>`

export function stateSvg(theme: CursorThemeKey, state: CursorState): string {
  const ink = INK[theme]
  const acc = PRIMARY[theme]
  const { pg, pgb, pgf } = PAPER[theme]
  const leaf = (d: string, fill: string) => `<path d='${d}' fill='${fill}' stroke='${ink}' stroke-width='1.2' stroke-linejoin='round' stroke-linecap='round'/>`
  const rulePaths = (o: number) => `<g fill='none' opacity='${o}' stroke='${ink}' stroke-width='1' stroke-linecap='round'>${RULES.map((d) => `<path d='${d}'/>`).join('')}</g>`
  const spine = (y1 = 4.6, y2 = 16.6) => `<line x1='12' y1='${y1}' x2='12' y2='${y2}' stroke='${acc}' stroke-width='1.25' stroke-linecap='round'/><circle cx='12' cy='3.6' r='.78' fill='${acc}'/>`
  const edge = (d: string) => `<path d='${d}' fill='none' stroke='${ink}' stroke-width='1.5' stroke-linecap='round'/>`
  const open = (right: string) => leaf(P1, pg) + leaf(P2, right)
  switch (state) {
    case 'default':
      return svgWrap(open(pgb) + spine())
    case 'pointer':
      return svgWrap(open(pgf) + rulePaths(0.42) + leaf(LIFT, pgf) + edge('M15.8 4.9C16.1 8 16.1 11.8 15.8 14.7') + spine())
    case 'text':
      return svgWrap(leaf(TB_L, pg) + leaf(TB_R, pgb) + `<rect x='4.3' y='17.9' width='15.4' height='1.3' rx='.65' fill='${acc}'/>` + spine(14.9, 16.6))
    case 'wait':
      return svgWrap(open(pgf) + leaf(FLIP, pgf) + edge(FLIP_EDGE) + spine())
    case 'grab':
      return svgWrap(leaf(GRAB_L, pg) + leaf(GRAB_R, pgb) + spine())
    case 'grabbing':
      return svgWrap(leaf(GB_L, pg) + leaf(GB_R, pgb) + spine(6.6, 15.8))
  }
}

/** data URI 光标图：`cursor: url()` 独立解析路径，全部实色，禁 CSS 变量 / color-mix（D5） */
export const cursorUri = (theme: CursorThemeKey, state: CursorState) =>
  `url("data:image/svg+xml,${encodeURIComponent(stateSvg(theme, state))}")`
