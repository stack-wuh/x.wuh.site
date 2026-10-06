'use client'

/* 卷题签姊妹列（20261006 设计定稿 B，视觉稿 shadow-docs/designs/20261006-playlist-name-seal/）：
   装裱左缘竖排卷名 + 列脚「卷」印——右曲次、左卷名，立轴一卷一曲对读。
   长度封顶走「墨尽」渐隐（同 GhostLine 语言）；印面恒单字（宽度不随名长变化）；
   空态由 PlayerPanel 条件渲染整位隐去。移动态无需媒体查询：NowStage ≤mobile 整段 display:none，
   卷题签随舞台同隐（与曲题签同命，空间承诺一致）。 */
import styled from 'styled-components'
import { INK_FAINT } from './tokens'

/* 外层：绝对定位挂 PlateWrap（position: relative），装裱左缘 26px 处竖排成列——
   与曲题签 box（left -14 起向板内）错身；离 x27% 墨痕站实测净空 ~42px（原型量测）。
   行内流：卷名列（竖排）→ 列脚印，禁状态驱动显隐（条件渲染在 JSX 侧） */
export const VolumeTab = styled.span`
  position: absolute;
  right: calc(100% + 26px);
  bottom: -4px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-serif);
  font-size: var(--font-size-xs);
  letter-spacing: 0.3em;
  color: ${INK_FAINT};

  & > .volume-name {
    writing-mode: vertical-rl;
    max-height: 208px;
    width: 22px;
    overflow: hidden;
    /* 墨尽渐隐：超长卷名底部淡出（同 GhostLine mask 语言），全名经 title 悬浮 */
    mask-image: linear-gradient(180deg, black 78%, transparent);
  }

  [lang='en'] & {
    letter-spacing: 0.08em;
  }
`

/* 列脚卷印：朱砂描边阴文（静配重——面板唯一饱和件纪律，禁实心白文），
   形制同「全体欣赏音乐」空态印框语言：1px 框 + 主色衬线字 */
export const VolumeSeal = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-top: 7px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 55%, transparent);
  border-radius: 4px;
  color: var(--primary-color);
  font-size: 12px;
  line-height: 1;
`
