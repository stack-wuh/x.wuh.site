'use client'

/* 面板共享令牌：色墨/motion/结构常量与 css 助手（20261005 自 PlayerPanel.tsx 拆出；声明顺序 = 守卫拼接顺序契约，禁重排） */
import { css } from 'styled-components'

export const HAIRLINE = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'
export const INK_MUTED = 'color-mix(in oklab, var(--text-color) 72%, transparent)'
export const INK_FAINT = 'color-mix(in oklab, var(--text-color) 56%, transparent)'
export const INK_GHOST = 'color-mix(in oklab, var(--text-color) 38%, transparent)'
export const RULE_LINE = 'color-mix(in oklab, var(--text-color) 9%, transparent)'
export const EASE = 'var(--motion-ease-out-soft)'
export const QUICK = 'var(--motion-dur-quick)'
// 面板开合 240ms：由 --motion-dur-quick(150ms) 派生，落在交互规范 150–300ms 区间
export const DUR_PANEL = 'calc(var(--motion-dur-quick) * 1.6)'
/* ===== 队列翻页屏（20261001 定稿，视觉稿 shadow-docs/changes/20261001-style-player-queue-fold/prototype.html）=====
   以右边框为翻页轴：静止斜倚 -40°（= 动画起点，第一帧零跳变）半透明可读不可点，
   hover/聚焦转正 0° 浮起可选曲。宽度恒定，两态只差角度/透明度/可点击/投影——布局零位移。
   曲线走站点注入令牌：引用未定义令牌会让 transition 整条作废回退 all 0s（帧采样实证），守卫钉死 */
export const FOLD_WIDTH_PX = 340
export const FOLD_REST_ANGLE = '-40deg'
export const FOLD_DUR = '520ms'
export const FOLD_LIFT_SHADOW = '-24px 12px 48px color-mix(in oklab, black 22%, transparent)'
/* ===== 墨痕歌词（20261002 定稿，视觉稿 shadow-docs/changes/20261002-style-player-ghost-depth/prototype.html）=====
   竖排五列两翼：左翼当前侧 3 列（当前句 + 前两句，浓墨）+ 右翼淡墨回声 2 列（前 3/前 4 句，右缘已有队列翻页屏）。
   站点锚点为面板百分比常量（均经原型遮挡实测：封面/题名带/题跋/队列屏净空）；
   深度五档经每列 transform 自带 perspective() 投影——GhostLayer 的 overflow:hidden 属 grouping 属性，
   会使 preserve-3d 静默失效，禁走祖先透传路径（铁律②变体，原型帧实测）；
   换句 = 各站按「站+句索引」重挂载，ghostIn 从站深 −150px 浮入（铁律①：起点=站内深度） */
export const GHOST_STATIONS = [
  { x: '27%', top: '6%', maxH: '46%', z: '0px', ink: 15, blur: '0px' },
  { x: '16%', top: '14%', maxH: '54%', z: '-130px', ink: 5.5, blur: '1px' },
  { x: '6%', top: '30%', maxH: '46%', z: '-260px', ink: 4.2, blur: '1.5px' },
  { x: '64.5%', top: '6%', maxH: '51%', z: '-340px', ink: 3.4, blur: '2px' },
  { x: '73%', top: '13%', maxH: '43%', z: '-400px', ink: 2.6, blur: '2.4px' },
]
export const GHOST_LIFT = '150px'
export const GHOST_FONT = 'clamp(26px, 2.9vw, 40px)'
// 纸纹：feTurbulence 噪点叠印，把晕染色场「印」进纸里而非悬浮
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

export const focusRing = css`
  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

export const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    &,
    & * {
      transition-duration: 0.01ms !important;
      animation: none !important;
      scroll-behavior: auto !important;
    }
  }
`

/* 舞台预算分档（按视口高度驱动：面板高 = 100vh − 96px，与宽度无关） */
export const STAGE_TIER_SHORT = 959
export const STAGE_TIER_COMPACT = 859
