'use client'

/* 迷你播放器样式：纸卡 dock + 书耳/印章 + 跑马灯标题 + 等化器/涟漪（20261005 自 MiniPlayer.tsx 拆出） */
import styled, { css, keyframes } from 'styled-components'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { IconMusic } from '@wuh.site/components/icons'
import { marquee, MARQUEE_GAP_PX } from '../useMarquee'

export const CARD_HEIGHT = '96px'
export const HAIRLINE = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'
export const INK_MUTED = 'color-mix(in oklab, var(--text-color) 72%, transparent)'
export const INK_FAINT = 'color-mix(in oklab, var(--text-color) 56%, transparent)'
export const EASE = 'var(--motion-ease-out-soft)'
export const QUICK = 'var(--motion-dur-quick)'

// 开合只做透明度/位移/可见性过渡；可见性延迟到过渡结束后再切换，避免 hidden 元素吃掉退场动画
export const showHide = (hiddenTransform: string) => css<{ $visible: boolean }>`
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  visibility: ${(p) => (p.$visible ? 'visible' : 'hidden')};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transform: ${(p) => (p.$visible ? 'none' : hiddenTransform)};
  transition: opacity ${QUICK} ${EASE}, transform ${QUICK} ${EASE},
    visibility 0s linear ${(p) => (p.$visible ? '0s' : QUICK)};
`

export const equalize = keyframes`
  0%, 100% { transform: scaleY(0.35); }
  50% { transform: scaleY(1); }
`

/* 印章涟漪：朱砂环自印缘扩散消散，只在播放态运行（收起态声源指示） */
export const ripple = keyframes`
  from { transform: scale(1); opacity: 0.55; }
  to { transform: scale(1.55); opacity: 0; }
`

/* ===== 展开态：桌面 dock 卡 / 移动端全宽底栏 ===== */
export const MiniCard = styled.div<{ $visible: boolean }>`
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 2500;
  width: 440px;
  height: ${CARD_HEIGHT};
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    'open actions'
    'progress progress';
  align-items: center;
  column-gap: var(--space-sm);
  row-gap: var(--space-xs);
  padding: var(--space-sm) var(--space-base) var(--space-sm);
  background: var(--background-100);
  border: 1px solid ${HAIRLINE};
  border-radius: var(--border-radius-lg);
  box-shadow: var(--elevation-soft);
  color: var(--text-color);
  font-family: var(--font-sans);

  ${showHide('translateY(14px)')}

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    height: auto;
    grid-template-areas: 'open actions';
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    padding-bottom: calc(var(--space-xs) + env(safe-area-inset-bottom, 0px));
    border: none;
    border-top: 1px solid ${HAIRLINE};
    border-radius: 0;
    box-shadow: none;
  }
`

/* 耳页共享交互语言：墨转朱砂、纸面染淡朱砂 */
export const earHover = css`
  &:hover {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--primary-color) 6%, var(--background-100));
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

/* 桌面书耳：卡片子元素，从右缘长出、垂直居中；不透明纸面盖住身后那段发丝线（边框在耳后断开） */
export const EarTab = styled.button`
  position: absolute;
  left: calc(100% - 1px);
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: var(--background-100);
  color: ${INK_MUTED};
  border: 1px solid ${HAIRLINE};
  border-left: none;
  border-radius: 0 var(--border-radius-base) var(--border-radius-base) 0;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: color ${QUICK} ${EASE}, background-color ${QUICK} ${EASE};

  /* 命中区外扩：视觉 24×44，可点约 32×52 */
  &::before {
    content: '';
    position: absolute;
    inset: -4px 0 -4px -8px;
  }

  ${earHover}

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* 收起态小耳：耳页从卡片上脱落，贴屏幕左缘、与展开耳同一水平线；播放中换装墨柱等化器指示声源 */
export const CollapsedEar = styled.button<{ $visible: boolean; $playing: boolean }>`
  position: fixed;
  left: 0;
  bottom: 48px;
  z-index: 2500;
  width: 28px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: var(--background-100);
  color: ${INK_MUTED};
  border: 1px solid ${HAIRLINE};
  border-radius: 0 var(--border-radius-base) var(--border-radius-base) 0;
  cursor: pointer;
  font-family: var(--font-sans);

  ${showHide('translateX(-8px)')}

  /* 命中区外扩：视觉 28×48，可点 36×48 */
  &::before {
    content: '';
    position: absolute;
    inset: 0 -8px 0 0;
  }

  ${earHover}

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* 收起态（移动端）：朱砂「音」印章钮；播放中外圈泛涟漪环提示声源 */
export const SealButton = styled.button<{ $visible: boolean; $playing: boolean }>`
  position: fixed;
  right: var(--space-base);
  bottom: calc(var(--space-base) + env(safe-area-inset-bottom, 0px));
  z-index: 2500;
  width: 48px;
  height: 48px;
  display: none;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: var(--background-100);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  line-height: 1;
  box-shadow:
    0 0 0 2px var(--background-color),
    0 0 0 3px color-mix(in oklab, var(--primary-color) 45%, transparent),
    var(--elevation-soft);

  ${showHide('scale(0.8)')}

  &:hover {
    background: var(--primary-600);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 3px;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--primary-color);
    opacity: 0;
    pointer-events: none;
    animation: ${(p) => (p.$playing ? css`${ripple} 2.2s var(--motion-ease-out-soft) infinite` : 'none')};
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: inline-flex;
  }
`

/* 封面 + 曲名区：整体可点开面板 */
export const OpenPanelButton = styled.button`
  grid-area: open;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  text-align: left;
  border-radius: var(--border-radius-base);

  &:hover {
    background: color-mix(in oklab, var(--text-color) 5%, transparent);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

export const Cover = styled.div<{ $src?: string }>`
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: var(--border-radius-base);
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'color-mix(in oklab, var(--normal-400) 24%, transparent)')};
  box-shadow: inset 0 0 0 1px ${HAIRLINE};

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    width: 44px;
    height: 44px;
  }
`

export const CoverFallback = styled(IconMusic).attrs({ size: 18, 'aria-hidden': true })`
  position: absolute;
  inset: 0;
  margin: auto;
  color: ${INK_FAINT};
`

export const MetaCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  min-width: 0;
`

export const Title = styled.span<{ $marquee: boolean }>`
  position: relative;
  min-width: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  line-height: 1.25;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ${(p) => (p.$marquee ? 'clip' : 'ellipsis')};

  @media (prefers-reduced-motion: reduce) {
    text-overflow: ellipsis;
  }
`

/* 隐形量尺：始终渲染单份文本，提供与滚动无关的自然宽度 */
export const TitleGhost = styled.span`
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  white-space: nowrap;
`

/* 滚动轨道：双份拷贝 + 0→-50% 循环；暂停时停走，与 Equalizer 语义一致 */
export const TitleTrack = styled.span<{ $playing: boolean; $duration: string }>`
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

export const TitleCopy = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
  padding-right: ${MARQUEE_GAP_PX}px;
`

/* 播放态指示：三根跳动的墨柱，替代原霓虹徽标 */
export const Equalizer = styled.span<{ $playing: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;

  span {
    width: 3px;
    height: 100%;
    border-radius: 1px;
    background: var(--primary-color);
    transform-origin: bottom;
    animation: ${equalize} 0.9s ease-in-out infinite;
  }

  span:nth-child(2) {
    animation-delay: 0.18s;
  }

  span:nth-child(3) {
    animation-delay: 0.36s;
  }

  ${(p) => !p.$playing && css`
    span {
      animation-play-state: paused;
      transform: scaleY(0.35);
      opacity: 0.5;
    }
  `}

  @media (prefers-reduced-motion: reduce) {
    span {
      animation: none;
      transform: scaleY(0.6);
    }
  }
`

export const Artist = styled.span`
  font-size: var(--font-size-xs);
  color: ${INK_MUTED};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 跳过提示占用歌手行，卡片高度不变（music-player.md 降级语义） */
export const Notice = styled.span`
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 桌面：进度与时间独占卡片底行；移动端：进度线吸附到栏顶 */
export const ProgressRow = styled.div`
  grid-area: progress;
  display: flex;
  align-items: center;
  gap: var(--space-xs);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
`

/* 进度线由共享 Progress size="sm" 承担（@wuh.site/components/progress），此处只保留布局行与时间文案 */

export const ProgressText = styled.span`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: ${INK_FAINT};
  white-space: nowrap;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

export const ActionGroup = styled.div`
  grid-area: actions;
  display: flex;
  align-items: center;
  gap: var(--space-xs);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

export const MobileActionGroup = styled.div`
  grid-area: actions;
  display: none;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }
`

export const IconButton = styled.button`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  color: ${INK_MUTED};
  cursor: pointer;
  transition: color ${QUICK} ${EASE}, background-color ${QUICK} ${EASE};

  &:hover {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--primary-color) 8%, transparent);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    width: 44px;
    height: 44px;
  }
`

/* 朱砂印主播放钮 */
export const PlayButton = styled(IconButton)`
  background: var(--primary-color);
  color: var(--background-100);
  box-shadow: var(--elevation-soft);

  &:hover {
    background: var(--primary-600);
    color: var(--background-100);
  }

  &:active {
    transform: scale(0.96);
  }
`

export const PanelButton = styled(IconButton)`
  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* 标题溢出测量与滚动轨道由 useMarquee 共享基建承担（./useMarquee） */

