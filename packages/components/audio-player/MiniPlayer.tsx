'use client'

import React, { useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useAudioPlayer } from './provider'
import { formatDuration } from './utils'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconListMusic,
  IconMusic,
  IconPause,
  IconPlay,
  IconSkipBack,
  IconSkipForward
} from '@wuh.site/components/icons'

const COLLAPSE_STORAGE_KEY = 'audio-mini-player-collapsed'
const CARD_HEIGHT = '96px'

const HAIRLINE = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'
const INK_MUTED = 'color-mix(in oklab, var(--text-color) 72%, transparent)'
const INK_FAINT = 'color-mix(in oklab, var(--text-color) 56%, transparent)'
const EASE = 'var(--motion-ease-out-soft)'
const QUICK = 'var(--motion-dur-quick)'

// 开合只做透明度/位移/可见性过渡；可见性延迟到过渡结束后再切换，避免 hidden 元素吃掉退场动画
const showHide = (hiddenTransform: string) => css<{ $visible: boolean }>`
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  visibility: ${(p) => (p.$visible ? 'visible' : 'hidden')};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transform: ${(p) => (p.$visible ? 'none' : hiddenTransform)};
  transition: opacity ${QUICK} ${EASE}, transform ${QUICK} ${EASE},
    visibility 0s linear ${(p) => (p.$visible ? '0s' : QUICK)};
`

const equalize = keyframes`
  0%, 100% { transform: scaleY(0.35); }
  50% { transform: scaleY(1); }
`

/* ===== 展开态：桌面 dock 卡 / 移动端全宽底栏 ===== */
const MiniCard = styled.div<{ $visible: boolean }>`
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

/* 桌面收拢钮：贴在卡片右缘的窄栏 */
const CollapseRail = styled.button<{ $visible: boolean }>`
  position: fixed;
  left: 464px;
  bottom: 24px;
  z-index: 2500;
  width: 32px;
  height: ${CARD_HEIGHT};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--background-100);
  color: ${INK_MUTED};
  border: 1px solid ${HAIRLINE};
  border-left: none;
  border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
  cursor: pointer;
  font-family: var(--font-sans);

  ${showHide('translateX(-8px)')}

  &:hover {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--primary-color) 6%, var(--background-100));
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* 收起态（桌面）：左缘窄栏 */
const CollapsedRail = styled(CollapseRail)`
  left: 0;
  width: 36px;
  border-left: 1px solid ${HAIRLINE};
`

/* 收起态（移动端）：朱砂「音」印章钮 */
const SealButton = styled.button<{ $visible: boolean }>`
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

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: inline-flex;
  }
`

/* 封面 + 曲名区：整体可点开面板 */
const OpenPanelButton = styled.button`
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

const Cover = styled.div<{ $src?: string }>`
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

const CoverFallback = styled(IconMusic).attrs({ size: 18, 'aria-hidden': true })`
  position: absolute;
  inset: 0;
  margin: auto;
  color: ${INK_FAINT};
`

const MetaCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  min-width: 0;
`

const Title = styled.span`
  min-width: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  line-height: 1.25;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 播放态指示：三根跳动的墨柱，替代原霓虹徽标 */
const Equalizer = styled.span<{ $playing: boolean }>`
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

const Artist = styled.span`
  font-size: var(--font-size-xs);
  color: ${INK_MUTED};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 跳过提示占用歌手行，卡片高度不变（music-player.md 降级语义） */
const Notice = styled.span`
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

/* 桌面：进度与时间独占卡片底行；移动端：进度线吸附到栏顶 */
const ProgressRow = styled.div`
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

const ProgressTrack = styled.div`
  position: relative;
  flex: 1;
  height: 2px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--normal-400) 35%, transparent);
  overflow: hidden;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    border-radius: 0;
  }
`

const ProgressValue = styled.div<{ $value: number }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--primary-color), color-mix(in oklab, var(--primary-color) 65%, var(--accent-color)));
  transform: scaleX(${(p) => p.$value});
  transform-origin: left center;
  transition: transform 0.25s linear;
`

const ProgressText = styled.span`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: ${INK_FAINT};
  white-space: nowrap;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

const ActionGroup = styled.div`
  grid-area: actions;
  display: flex;
  align-items: center;
  gap: var(--space-xs);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

const MobileActionGroup = styled.div`
  grid-area: actions;
  display: none;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }
`

const IconButton = styled.button`
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
const PlayButton = styled(IconButton)`
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

const PanelButton = styled(IconButton)`
  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

export const AudioMiniPlayer = () => {
  const {
    currentTrack,
    state,
    actions: { togglePlay, playNext, playPrevious, togglePanel }
  } = useAudioPlayer()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(collapsed))
  }, [collapsed])

  const toggleCollapsed = () => setCollapsed((prev) => !prev)
  const totalDuration = Math.max(state.duration || currentTrack?.duration || 0, 0)
  const progressText =
    totalDuration > 0 ? `${formatDuration(state.progress)} / ${formatDuration(totalDuration)}` : '等待播放'
  const progressPercent =
    totalDuration > 0 ? Math.min(1, Math.max(0, state.progress / totalDuration)) : 0
  const playing = state.status === 'playing'

  return (
    <>
      <MiniCard $visible={!collapsed} aria-hidden={collapsed}>
        <OpenPanelButton type='button' onClick={togglePanel} aria-label='打开播放面板' tabIndex={collapsed ? -1 : 0}>
          <Cover $src={currentTrack?.coverUrl} aria-hidden='true'>
            {!currentTrack?.coverUrl ? <CoverFallback /> : null}
          </Cover>
          <MetaCopy>
            <TitleRow>
              <Title>{currentTrack?.name ?? '等待播放'}</Title>
              <Equalizer $playing={playing} aria-hidden='true'>
                <span />
                <span />
                <span />
              </Equalizer>
            </TitleRow>
            {/* 提示占用歌手行，卡片高度不变；下一首正常起播后错误位自动清空 */}
            {state.error ? (
              <Notice role='status'>{state.error}</Notice>
            ) : (
              <Artist>{currentTrack?.artist ?? '加载默认歌单...'}</Artist>
            )}
          </MetaCopy>
        </OpenPanelButton>

        <ActionGroup>
          <IconButton type='button' aria-label='上一首' onClick={playPrevious}>
            <IconSkipBack size={18} />
          </IconButton>
          <PlayButton type='button' aria-label={playing ? '暂停' : '播放'} onClick={togglePlay}>
            {playing ? <IconPause size={20} /> : <IconPlay size={20} />}
          </PlayButton>
          <IconButton type='button' aria-label='下一首' onClick={playNext}>
            <IconSkipForward size={18} />
          </IconButton>
          <PanelButton type='button' aria-label='打开播放面板' onClick={togglePanel}>
            <IconListMusic size={18} />
          </PanelButton>
        </ActionGroup>

        <MobileActionGroup>
          <PlayButton type='button' aria-label={playing ? '暂停' : '播放'} onClick={togglePlay}>
            {playing ? <IconPause size={20} /> : <IconPlay size={20} />}
          </PlayButton>
          <IconButton type='button' aria-label='收起播放器' onClick={toggleCollapsed}>
            <IconChevronDown size={20} />
          </IconButton>
        </MobileActionGroup>

        <ProgressRow>
          <ProgressTrack aria-hidden='true'>
            <ProgressValue $value={progressPercent} />
          </ProgressTrack>
          <ProgressText>{progressText}</ProgressText>
        </ProgressRow>
      </MiniCard>

      <CollapseRail
        type='button'
        $visible={!collapsed}
        aria-label='收起播放器'
        aria-expanded={!collapsed}
        onClick={toggleCollapsed}
      >
        <IconChevronLeft size={16} />
      </CollapseRail>

      <CollapsedRail
        type='button'
        $visible={collapsed}
        aria-label='展开播放器'
        aria-expanded={!collapsed}
        onClick={toggleCollapsed}
      >
        <IconChevronRight size={16} />
      </CollapsedRail>

      <SealButton type='button' $visible={collapsed} aria-label='展开播放器' onClick={toggleCollapsed}>
        音
      </SealButton>
    </>
  )
}
