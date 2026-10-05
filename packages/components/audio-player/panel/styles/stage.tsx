'use client'

/* 桌面舞台：装裱封面碟化 + 题名手卷 + 界格笺题跋（20261005 自 PlayerPanel.tsx 拆出） */
import styled, { css, keyframes } from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { marquee, MARQUEE_GAP_PX } from '../../useMarquee'
import { HAIRLINE, INK_GHOST, INK_MUTED, RULE_LINE, STAGE_TIER_COMPACT, STAGE_TIER_SHORT } from './tokens'

/* ===== 桌面舞台：装裱封面 + 题名手卷 + 界格笺题跋（居中单焦点） ===== */
export const NowStage = styled.div`
  grid-area: stage;
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xl) var(--space-2xl) 0;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* 主舞台后一团主题色暖晕，让居中构图贴住纸面不悬浮 */
export const StageGlow = styled.div`
  position: absolute;
  left: 50%;
  top: 36%;
  transform: translate(-50%, -50%);
  width: min(760px, 90%);
  height: 68%;
  border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--primary-color) 7%, transparent), transparent 70%);
  filter: blur(12px);
  pointer-events: none;
`

export const PlateWrap = styled.div`
  position: relative;
`

/* 竖排 mono 题签「曲 · N / 总数」：伸出纸边的版本信息；拉丁文语境字距降档 */
export const StageTab = styled.span`
  position: absolute;
  top: var(--space-xs);
  left: -14px;
  z-index: 1;
  writing-mode: vertical-rl;
  padding: var(--space-xs) var(--space-4xs);
  background: var(--background-100);
  border: 1px solid ${HAIRLINE};
  border-radius: var(--border-radius-xs);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.22em;
  color: var(--primary-color);

  [lang='en'] & {
    letter-spacing: 0.1em;
  }
`

/* ===== 封面碟化（20261002 定稿）：黑胶大碟嵌方裱（月洞窗构图）=====
   碟面 = 纯 CSS 深色底 + 同心纹刻 + 斜向高光；碟心圆标即封面图（换曲随 coverUrl 换图）。
   播放随转（26s/圈慢转，/music 小黑胶同语言）、暂停冻结当前角度不复位、reduced-motion 静止。
   碟径沿用舞台预算三档帽（唯一因变量关系不破坏） */
export const DISC_REV = '26s'
export const discSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

/* 封面装裱：方形纸裱保留发丝线语言，圆碟嵌中 */
export const Plate = styled.div`
  padding: var(--space-sm);
  background: color-mix(in oklab, var(--background-100) 88%, transparent);
  border: 1px solid ${HAIRLINE};
  border-radius: var(--border-radius-xs);
  box-shadow: var(--elevation-soft);
`


/* 黑胶碟：尺寸是舞台预算的唯一因变量：帽与面板高度同源（min(px, (100vh−96px)×系数)），
   旧裸 32vh 帽与面板高度不同源，矮视口吞题名（生产实锤）。
   旋转由 $playing 驱动 play-state（transient prop 静态规则，显隐纪律）；
   暂停 = paused 冻结当前角度（真实黑胶行为，不复位） */
export const PlateArt = styled.div<{ $playing?: boolean }>`
  position: relative;
  width: min(252px, calc((100vh - 96px) * 0.3));
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 28%, color-mix(in oklab, white 10%, transparent), transparent 42%),
    repeating-radial-gradient(circle at 50% 50%, color-mix(in oklab, white 5%, transparent) 0 1px, transparent 1px 4px),
    radial-gradient(circle, color-mix(in oklab, black 84%, var(--normal-900)) 0 60%, color-mix(in oklab, black 92%, var(--normal-900)) 60% 100%);
  box-shadow: inset 0 0 0 1px ${HAIRLINE}, inset 0 0 26px color-mix(in oklab, black 35%, transparent),
    var(--elevation-soft);
  animation: ${discSpin} ${DISC_REV} linear infinite;
  animation-play-state: ${(p) => (p.$playing ? 'running' : 'paused')};

  @media (max-height: ${STAGE_TIER_SHORT}px) {
    width: min(224px, calc((100vh - 96px) * 0.3));
  }

  @media (max-height: ${STAGE_TIER_COMPACT}px) {
    width: min(184px, calc((100vh - 96px) * 0.26));
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

/* 碟心封面圆标：换曲随 coverUrl 换图 */
export const DiscLabel = styled.div<{ $src?: string }>`
  position: absolute;
  inset: 29%;
  border-radius: 50%;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'color-mix(in oklab, var(--normal-400) 24%, transparent)')};
  box-shadow: inset 0 0 0 1px ${HAIRLINE}, 0 0 0 3px color-mix(in oklab, black 32%, transparent);
`

/* 碟心轴点 */
export const DiscDot = styled.div`
  position: absolute;
  inset: calc(50% - 4px);
  border-radius: 50%;
  background: var(--background-100);
  box-shadow: 0 0 0 1px ${HAIRLINE};
`

/* 题名手卷：溢出才徐展（暂停停走），reduced-motion 回落省略号，title 显全名
   空间承诺：舞台再穷题名/歌手也不可挤压（flex-shrink: 0，封面是唯一因变量） */
export const StageTitle = styled.h2<{ $marquee: boolean }>`
  display: block;
  flex-shrink: 0;
  margin: var(--space-lg) 0 0;
  max-width: 680px;
  width: 100%;
  position: relative;
  min-width: 0;
  text-align: center;
  font-family: var(--font-serif);
  font-size: 25px;
  font-weight: 600;
  line-height: var(--line-height-heading);
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ${(p) => (p.$marquee ? 'clip' : 'ellipsis')};
  mask-image: linear-gradient(90deg, black 0, black calc(100% - 8px), transparent 100%);

  @media (prefers-reduced-motion: reduce) {
    text-overflow: ellipsis;
    mask-image: none;
  }
`

export const StageGhost = styled.span`
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  white-space: nowrap;
`

export const StageTrack = styled.span<{ $playing: boolean; $duration: string }>`
  display: inline-flex;
  min-width: 0;
  white-space: nowrap;
  will-change: transform;
  animation: ${marquee} ${(p) => p.$duration} linear infinite;
  animation-play-state: ${(p) => (p.$playing ? 'running' : 'paused')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const StageCopy = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
  padding-right: ${MARQUEE_GAP_PX}px;
`

export const StageArtist = styled.p`
  flex-shrink: 0;
  margin: var(--space-xs) 0 0;
  max-width: 100%;
  font-size: var(--font-size-sm);
  color: ${INK_MUTED};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 界格笺题跋：三行各落一道发丝界线，当前句大字居格 + 朱砂句读环 */
export const Epigraph = styled.div`
  margin-top: var(--space-lg);
  width: min(400px, 100%);
  mask-image: linear-gradient(180deg, transparent, black 18%, black 86%, transparent);
`

export const EpiRow = styled.p<{ $act?: boolean }>`
  margin: 0;
  padding: var(--space-xs) 0 calc(var(--space-xs) + 2px);
  text-align: center;
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  letter-spacing: 0.06em;
  line-height: 1.8;
  color: ${INK_GHOST};
  border-bottom: 1px solid ${RULE_LINE};

  [lang='en'] & {
    letter-spacing: 0.02em;
  }

  ${(p) =>
    p.$act
      ? css`
          font-size: 22px;
          font-weight: 600;
          color: var(--text-color);

          &::before {
            content: '';
            display: inline-block;
            width: 7px;
            height: 7px;
            border: 1.5px solid var(--primary-color);
            border-radius: 50%;
            margin-right: 14px;
            vertical-align: 5px;
          }
        `
      : css`
          /* 矮视口二档缓冲：题跋降为当前句，非当前句让位给题名/歌手（静态 media query，不涉态驱动禁令） */
          @media (max-height: ${STAGE_TIER_COMPACT}px) {
            display: none;
          }
        `}
`

