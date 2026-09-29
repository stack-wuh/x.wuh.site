import styled, { css, keyframes } from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

/* ==========================================================================
   /music 页样式（与组件逻辑分离，样式集中导出）
   —— 年轮编年·碟心封面：左侧衬线年份纵轨 + 超大水印年份 +
   面板头小黑胶（封面做碟心圆标）+ 按语 + 曲目行（次数/最爱）
   ========================================================================== */

export const Section = styled.section`
  width: min(960px, 100%);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-base) var(--space-3xl);
  font-family: var(--font-sans);
  color: var(--text-color);
`

/* ===== 页头：站点 PageHeader 语言，右侧放网易云身份 ===== */

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-lg);
  flex-wrap: wrap;
  padding-bottom: var(--space-md);
  border-bottom: 1px solid color-mix(in oklab, var(--normal-400) 55%, transparent);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
`

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.03em;
`

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
`

export const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex-shrink: 0;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    align-self: flex-end;
  }
`

export const Avatar = styled.img`
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: 1px solid color-mix(in oklab, var(--normal-500) 45%, transparent);
  border-radius: 50%;
  object-fit: cover;
  display: block;
`

export const SealAvatar = styled.span`
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in oklab, var(--primary-color) 45%, transparent);
  border-radius: var(--border-radius-xs);
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color);
`

export const IdentityName = styled.span`
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
`

export const LvBadge = styled.span`
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  padding: 1px 6px;
  border-radius: var(--border-radius-xs);
  border: 1px solid color-mix(in oklab, var(--accent-color) 55%, transparent);
  color: color-mix(in oklab, var(--accent-color) 78%, var(--text-color));
`

export const Since = styled.span`
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* ==========================================================================
   年轮编年：纵轨 / 水印 / 碟心封面 / 按语
   ========================================================================== */

export const Chronicle = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr);
  gap: var(--space-lg);
  padding-top: var(--space-lg);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-md);
  }
`

export const Rail = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;

  /* 纵轨基线 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: color-mix(in oklab, var(--normal-400) 45%, transparent);
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    flex-direction: row;
    gap: 4px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: thin;

    &::before {
      display: none;
    }
  }
`

export const RailItem = styled.button`
  position: relative;
  z-index: 1;
  display: block;
  background: none;
  border: none;
  padding: 2px 0 2px 18px;
  cursor: pointer;
  text-align: left;

  /* 轨上节点 */
  &::before {
    content: '';
    position: absolute;
    left: -3px;
    top: 50%;
    width: 7px;
    height: 7px;
    margin-top: -3.5px;
    border-radius: 50%;
    background: var(--background-color);
    border: 1px solid color-mix(in oklab, var(--normal-500) 60%, transparent);
    transition:
      background-color var(--motion-dur-quick) ease,
      border-color var(--motion-dur-quick) ease,
      box-shadow var(--motion-dur-quick) ease;
  }

  &:hover {
    background: none;
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  &[aria-current='true']::before {
    background: var(--primary-color);
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary-color) 18%, transparent);
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    flex: 0 0 auto;
    padding: 4px 10px;
    border: 1px solid color-mix(in oklab, var(--normal-400) 55%, transparent);
    border-radius: var(--border-radius-base);

    &::before {
      display: none;
    }

    &[aria-current='true'] {
      border-color: color-mix(in oklab, var(--primary-color) 60%, transparent);
    }
  }
`

export const RailYear = styled.span<{ $dist: number }>`
  display: block;
  font-family: var(--font-serif);
  font-weight: ${(p) => (p.$dist === 0 ? 600 : 500)};
  letter-spacing: 0.04em;
  font-size: var(--font-size-lg);
  line-height: 1.5;
  color: ${(p) =>
    p.$dist === 0
      ? 'var(--primary-color)'
      : p.$dist === 1
        ? 'color-mix(in oklab, var(--text-color) 44%, transparent)'
        : 'color-mix(in oklab, var(--text-color) 26%, transparent)'};
  transition: color 240ms var(--motion-ease-out-soft);

  ${RailItem}:hover & {
    color: color-mix(in oklab, var(--text-color) 70%, transparent);
  }

  ${RailItem}[aria-current='true'] & {
    color: var(--primary-color);
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    font-size: var(--font-size-base);
  }
`

export const RailCount = styled.span`
  display: block;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 45%, transparent);
  padding-left: 2px;

  ${RailItem}[aria-current='true'] & {
    color: color-mix(in oklab, var(--primary-color) 75%, var(--text-color));
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

export const Content = styled.div`
  position: relative;
  min-width: 0;
`

export const Watermark = styled.span`
  position: absolute;
  top: -30px;
  right: -6px;
  z-index: 0;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(120px, 22vw, 210px);
  line-height: 1;
  letter-spacing: -0.02em;
  color: color-mix(in oklab, var(--text-color) 6%, transparent);
  pointer-events: none;
  user-select: none;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

export const ContentInner = styled.div`
  position: relative;
  z-index: 1;
`

export const PanelHead = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 0 var(--space-sm);
`

const discSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

/* 碟心封面：小黑胶，歌单封面做圆标；切年淡出→轻转 120°→淡入，播放时慢转 */
export const CoverDisc = styled.span<{
  $rotation: number
  $fading: boolean
  $spinning: boolean
  $fast: boolean
}>`
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    conic-gradient(
        from 210deg,
        rgba(255, 255, 255, 0.09),
        transparent 26%,
        rgba(255, 255, 255, 0.05) 48%,
        transparent 62%,
        rgba(255, 255, 255, 0.08) 82%,
        transparent
      ),
    repeating-radial-gradient(circle at 50% 50%, #171310 0 1.5px, #221b15 1.5px 3px),
    #14100c;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.28),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  opacity: ${(p) => (p.$fading ? 0 : 1)};
  transform: rotate(${(p) => p.$rotation}deg);
  transition:
    transform ${(p) => (p.$fast ? 240 : 620)}ms var(--motion-ease-out-soft),
    opacity ${(p) => (p.$fast ? 60 : 160)}ms ease;

  /* 主轴孔 */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 6px;
    height: 6px;
    margin: -3px 0 0 -3px;
    border-radius: 50%;
    background: #0e0b09;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
  }

  ${(p) =>
    p.$spinning
      ? css`
          animation: ${discSpin} 5s linear infinite;
        `
      : ''}

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    width: 56px;
    height: 56px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.01ms;
    animation: none;
  }
`

export const DiscLabel = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.45);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    width: 26px;
    height: 26px;
  }
`

export const PanelCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const PanelTitle = styled.h2`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  line-height: 1.4;
`

export const PanelSub = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
`

/* 歌单描述 + 标签：站长自留地（描述来自网易云歌单简介；标签服务端后续补字段即点亮） */
export const Intro = styled.p`
  margin: 0 0 var(--space-xs);
  max-width: 56ch;
  font-size: var(--font-size-sm);
  line-height: 1.9;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
`

export const IntroTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 var(--space-sm);
`

export const TagChip = styled.span`
  padding: 0 8px;
  font-size: var(--font-size-xs);
  line-height: 1.7;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  border: 1px solid color-mix(in oklab, var(--normal-400) 70%, transparent);
  border-radius: var(--border-radius-xs);
  background: color-mix(in oklab, var(--normal-300) 28%, transparent);
`

/* 按语：本卷播放次数最高的一首，像志书页脚的纪年按语 */
export const Epigraph = styled.p`
  margin: 0 0 var(--space-sm);
  padding: 2px 0 2px var(--space-sm);
  border-left: 2px solid color-mix(in oklab, var(--primary-color) 45%, transparent);
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  line-height: 1.9;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);

  .em {
    color: var(--primary-color);
  }
`

/* ===== 曲目列表 ===== */

export const TrackList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const TrackRow = styled.li`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 9px var(--space-xs);
  border-bottom: 1px solid color-mix(in oklab, var(--normal-400) 30%, transparent);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color var(--motion-dur-quick) ease;

  &:hover {
    background: color-mix(in oklab, var(--primary-color) 5%, transparent);
  }

  /* 悬停行：编号淡出、翻出播放键（点击行即播） */
  &:hover .track-idx-num {
    opacity: 0;
  }

  &:hover .track-idx-play {
    opacity: 1;
  }

  &:hover .track-name {
    color: var(--primary-color);
  }
`

export const TrackIndex = styled.span`
  position: relative;
  width: 2.2em;
  height: 20px;
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);
`

export const IndexNum = styled.span.attrs({ className: 'track-idx-num' })`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  transition: opacity var(--motion-dur-quick) ease;
`

export const IndexPlay = styled.span.attrs({ className: 'track-idx-play' })`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  opacity: 0;
  color: var(--primary-color);
  transition: opacity var(--motion-dur-quick) ease;

  svg {
    width: 11px;
    height: 11px;
    fill: currentColor;
  }
`

export const PlayingDot = styled.span<{ $playing: boolean }>`
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--primary-color);
  opacity: ${(p) => (p.$playing ? 1 : 0)};
`

export const TrackButton = styled.button`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  color: inherit;
  font-family: inherit;

  &:hover .track-name {
    color: var(--primary-color);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

export const TrackName = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--font-size-sm);
  transition: color var(--motion-dur-quick) ease;
`

export const TrackArtist = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  font-size: var(--font-size-xs);
  flex-shrink: 1;
`

export const TrackPlays = styled.span`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  min-width: 3.4em;
  text-align: right;
  font-variant-numeric: tabular-nums;

  .unit {
    margin-left: 2px;
    color: color-mix(in oklab, var(--text-color) 45%, transparent);
  }
`

export const FavSlot = styled.span`
  width: 40px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
`

export const FavBadge = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  font-size: var(--font-size-xs);
  line-height: 1.6;
  color: var(--primary-color);
  border: 1px solid color-mix(in oklab, var(--primary-color) 45%, transparent);
  border-radius: var(--border-radius-xs);
  background: color-mix(in oklab, var(--primary-color) 7%, var(--background-100));
`

export const TrackDuration = styled.span`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);
`

export const TracksEmpty = styled.p`
  margin: 0;
  padding: var(--space-lg) 0;
  text-align: center;
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);
`
