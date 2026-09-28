'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAudioPlayer } from './provider'
import { findActiveLyricIndex, formatDuration, parseLyrics } from './utils'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import {
  IconListMusic,
  IconPause,
  IconPlay,
  IconRepeat,
  IconRepeatOne,
  IconShuffle,
  IconSkipBack,
  IconSkipForward,
  IconVolume,
  IconX
} from '@wuh.site/components/icons'
import type { PlayerMode } from './specs'

const HAIRLINE = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'
const INK_MUTED = 'color-mix(in oklab, var(--text-color) 72%, transparent)'
const INK_FAINT = 'color-mix(in oklab, var(--text-color) 56%, transparent)'
const EASE = 'var(--motion-ease-out-soft)'
const QUICK = 'var(--motion-dur-quick)'
// 面板开合 240ms：由 --motion-dur-quick(150ms) 派生，落在交互规范 150–300ms 区间
const DUR_PANEL = 'calc(var(--motion-dur-quick) * 1.6)'

const focusRing = css`
  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    &,
    & * {
      transition-duration: 0.01ms !important;
      animation: none !important;
      scroll-behavior: auto !important;
    }
  }
`

/* 封面背景：原图直接垫底（绢底印花式水印层），如墨在纸上洇开；无封面时退回素纸。
   亮色主题微提亮、暗色主题压暗；上面的纸色罩负责对比度 */
const CoverWash = styled.div<{ $src?: string }>`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: ${(p) => (p.$src ? `url(${p.$src}) center 75% / cover no-repeat` : 'none')};
  filter: saturate(1.05) brightness(1.04);
  opacity: ${(p) => (p.$src ? 1 : 0)};

  [data-color-scheme='dark'] & {
    filter: saturate(1.05) brightness(0.88);
  }

  /* 竖屏下面 cover 会完整露出图片顶边（封面自带的印刷字），放大一档并下偏裁掉 */
  @media (max-width: ${BREAKPOINTS.mobile}px) {
    background-size: auto 130%;
    background-position: center 75%;
  }
`

/* 纸色罩：压住晕染保证文字对比度，颜色只走主题 token */
const WashScrim = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--background-100) 88%, transparent),
    color-mix(in oklab, var(--background-100) 74%, transparent)
  );
`

const Backdrop = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 2600;
  background: color-mix(in oklab, black 55%, transparent);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity ${DUR_PANEL} ${EASE};
`

const Panel = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 48px;
  z-index: 2610;
  max-width: 1160px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 0.85fr);
  gap: var(--space-2xl);
  padding: var(--space-2xl) var(--space-2xl);
  background: var(--background-100);
  border: 1px solid ${HAIRLINE};
  border-radius: var(--radius-card);
  box-shadow: var(--elevation-card);
  color: var(--text-color);
  font-family: var(--font-sans);
  overflow: hidden;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? '0' : '16px')});
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity ${DUR_PANEL} ${EASE}, transform ${DUR_PANEL} ${EASE}, visibility 0s linear ${(p) => (p.$visible ? '0s' : DUR_PANEL)};
  visibility: ${(p) => (p.$visible ? 'visible' : 'hidden')};

  ${reducedMotion}

  /* 移动端：全屏沉浸页，单列纵向排布（曲名区 / 分段切换 / 歌词或列表撑满余下高度） */
  @media (max-width: ${BREAKPOINTS.mobile}px) {
    inset: 0;
    max-width: none;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto minmax(0, 1fr);
    gap: var(--space-sm);
    padding: calc(var(--space-sm) + env(safe-area-inset-top, 0px)) var(--space-base)
      calc(var(--space-base) + env(safe-area-inset-bottom, 0px));
    border: none;
    border-radius: 0;
    box-shadow: none;
    overflow-y: auto;
  }

  @media (min-width: calc(${BREAKPOINTS.mobile}px + 1px)) and (max-width: ${BREAKPOINTS.tablet}px) {
    inset: 24px;
    gap: var(--space-base);
    padding: var(--space-base);
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: var(--space-base);
  right: var(--space-base);
  z-index: 2;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: 1px solid ${HAIRLINE};
  border-radius: 50%;
  color: ${INK_MUTED};
  cursor: pointer;
  transition: color ${QUICK} ${EASE}, background-color ${QUICK} ${EASE};

  &:hover {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--primary-color) 8%, transparent);
  }

  ${focusRing}
`

/* ===== 左栏：装裱封面 + 曲目 + 控制 ===== */
const NowPlaying = styled.div`
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    align-items: center;
    text-align: center;
  }
`

/* 封面按面板可用高度与栏宽双重收缩，避免左栏总高撑出面板底边或横向压到歌词列 */
const CoverHero = styled.div<{ $src?: string }>`
  width: min(100%, 320px, 42vh);
  aspect-ratio: 1;
  align-self: flex-start;
  border-radius: var(--border-radius-lg);
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'color-mix(in oklab, var(--normal-400) 24%, transparent)')};
  box-shadow: inset 0 0 0 1px ${HAIRLINE}, var(--elevation-soft);

  /* 矮视口（常见 800 高笔记本）：封面再收缩一档，保证音量行完整落在面板内 */
  @media (max-height: 840px) {
    width: min(100%, 240px);
  }

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    width: min(62vw, 240px);
    align-self: center;
  }
`

const TrackHeading = styled.h2`
  margin-top: var(--space-lg);
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 600;
  line-height: var(--line-height-heading);
  color: var(--text-color);
  overflow-wrap: anywhere;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    margin-top: var(--space-base);
    font-size: var(--font-size-lg);
  }
`

const TrackArtist = styled.p`
  margin-top: var(--space-xs);
  font-size: var(--font-size-sm);
  color: ${INK_MUTED};
`

const ProgressWrapper = styled.div`
  margin-top: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: 100%;
`

const Slider = styled.input`
  width: 100%;
  height: 28px;
  margin: 0;
  accent-color: var(--primary-color);
  cursor: pointer;

  @media (pointer: coarse) {
    height: 44px;
  }

  ${focusRing}
`

const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: ${INK_FAINT};
`

const ControlRow = styled.div`
  margin-top: var(--space-base);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`

const SkipButton = styled.button`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: 1px solid ${HAIRLINE};
  border-radius: 50%;
  color: ${INK_MUTED};
  cursor: pointer;
  transition: color ${QUICK} ${EASE}, background-color ${QUICK} ${EASE};

  &:hover {
    color: var(--primary-color);
    background: color-mix(in oklab, var(--primary-color) 8%, transparent);
  }

  ${focusRing}
`

const PlayButton = styled(SkipButton)`
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--background-100);
  box-shadow: var(--elevation-soft);

  &:hover {
    background: var(--primary-600);
    border-color: var(--primary-600);
    color: var(--background-100);
  }

  &:active {
    transform: scale(0.96);
  }
`

const ModeGroup = styled.div`
  margin-top: var(--space-base);
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
`

const ModeButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: ${(p) => (p.$active ? 'color-mix(in oklab, var(--primary-color) 8%, transparent)' : 'transparent')};
  border: 1px solid ${(p) => (p.$active ? 'color-mix(in oklab, var(--primary-color) 45%, transparent)' : HAIRLINE)};
  border-radius: 999px;
  color: ${(p) => (p.$active ? 'var(--primary-color)' : INK_MUTED)};
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  transition: color ${QUICK} ${EASE}, background-color ${QUICK} ${EASE}, border-color ${QUICK} ${EASE};

  &:hover {
    color: var(--primary-color);
    border-color: color-mix(in oklab, var(--primary-color) 45%, transparent);
  }

  ${focusRing}
`

const VolumeRow = styled.div`
  margin-top: var(--space-base);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: ${INK_MUTED};

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* ===== 右侧：歌词 / 播放列表 ===== */
const SectionHeading = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid ${HAIRLINE};
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: 500;
  letter-spacing: 0.14em;
  color: ${INK_MUTED};
`

const DesktopSection = styled.section`
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

const LyricsScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: var(--space-xs);
  scrollbar-gutter: stable;

  @media (pointer: coarse) {
    scrollbar-gutter: auto;
  }
`

const LyricLine = styled.p<{ $active?: boolean }>`
  padding: var(--space-xs) 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  line-height: var(--line-height-body);
  color: ${(p) => (p.$active ? 'var(--primary-color)' : INK_MUTED)};
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  transition: color ${QUICK} ${EASE};
`

const QueueList = styled.ul`
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  scrollbar-gutter: stable;
`

const QueueItem = styled.li<{ $active?: boolean }>`
  background: ${(p) => (p.$active ? 'color-mix(in oklab, var(--primary-color) 8%, transparent)' : 'transparent')};
  border-radius: var(--border-radius-base);

  &:hover {
    background: color-mix(in oklab, var(--text-color) 5%, transparent);
  }
`

const QueueButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  background: none;
  border: none;
  border-radius: inherit;
  color: var(--text-color);
  cursor: pointer;
  font-family: var(--font-sans);
  text-align: left;

  ${focusRing}
`

const QueueName = styled.span<{$active?: boolean}>`
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-sm);
  color: ${(p) => (p.$active ? 'var(--primary-color)' : 'var(--text-color)')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const QueueMeta = styled.span`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: var(--font-size-xs);
  color: ${INK_FAINT};
`

/* ===== 移动端分段：歌词 / 列表 ===== */
const MobileTabs = styled.div`
  position: relative;
  z-index: 1;
  display: none;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: flex;
    gap: var(--space-xs);
    border-bottom: 1px solid ${HAIRLINE};
  }
`

const MobileTab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: var(--space-xs) 0 calc(var(--space-xs) + 2px);
  background: none;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? 'var(--primary-color)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--primary-color)' : INK_MUTED)};
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: color ${QUICK} ${EASE}, border-color ${QUICK} ${EASE};

  ${focusRing}
`

const MobileSection = styled.section<{ $active?: boolean }>`
  position: relative;
  z-index: 1;
  min-height: 0;
  display: none;
  flex-direction: column;
  gap: var(--space-xs);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    ${(p) => (p.$active ? css`display: flex;` : css`display: none;`)}
  }
`

const MODE_LABELS: Record<PlayerMode, string> = {
  order: '顺序',
  'repeat-one': '单曲',
  shuffle: '随机'
}

const MODE_ICONS: Record<PlayerMode, typeof IconRepeat> = {
  order: IconRepeat,
  'repeat-one': IconRepeatOne,
  shuffle: IconShuffle
}

export const AudioPlayerPanel = () => {
  const {
    currentTrack,
    queue,
    state,
    actions: { togglePanel, playNext, playPrevious, togglePlay, seek, setVolume, setMode, playTrack }
  } = useAudioPlayer()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const mobileLyricsRef = useRef<HTMLDivElement | null>(null)
  const desktopQueueRef = useRef<HTMLUListElement | null>(null)
  const mobileQueueRef = useRef<HTMLUListElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const [mobileTab, setMobileTab] = useState<'lyrics' | 'queue'>('lyrics')
  const totalDuration = Math.max(state.duration || currentTrack?.duration || 0, 0.01)

  const lyrics = useMemo(() => parseLyrics(currentTrack?.lyrics), [currentTrack?.lyrics])
  const activeLyric = useMemo(() => findActiveLyricIndex(lyrics, state.progress), [lyrics, state.progress])
  const playing = state.status === 'playing'

  // 弹层交互：打开时焦点移入关闭钮，Escape 关闭，关闭后焦点移回触发元素
  useEffect(() => {
    if (!state.isPanelOpen) return
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        togglePanel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      restoreFocusRef.current?.focus?.()
      restoreFocusRef.current = null
    }
  }, [state.isPanelOpen, togglePanel])

  // 播放列表定位到当前曲：面板打开或切歌时滚动到高亮项
  useEffect(() => {
    if (!state.isPanelOpen) return
    for (const container of [desktopQueueRef.current, mobileQueueRef.current]) {
      container?.querySelector<HTMLLIElement>('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
    }
  }, [state.isPanelOpen, state.currentIndex, mobileTab])

  // 歌词跟随滚动（桌面与移动两份歌词容器都要跟随）；reduced-motion 下退化为瞬时定位
  useEffect(() => {
    if (!state.isPanelOpen) return
    if (activeLyric < 0) return
    const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth'
    for (const container of [scrollRef.current, mobileLyricsRef.current]) {
      const el = container?.querySelector<HTMLDivElement>(`[data-lyric-index="${activeLyric}"]`)
      el?.scrollIntoView({ behavior, block: 'center' })
    }
  }, [activeLyric, state.isPanelOpen])

  return (
    <>
      <Backdrop $visible={state.isPanelOpen} onClick={togglePanel} aria-hidden='true' />
      <Panel
        $visible={state.isPanelOpen}
        role='dialog'
        aria-modal='true'
        aria-label='播放器面板'
        aria-hidden={!state.isPanelOpen}
      >
        <CoverWash $src={currentTrack?.coverUrl} aria-hidden='true' />
        <WashScrim aria-hidden='true' />
        <CloseButton ref={closeRef} type='button' aria-label='关闭播放面板' onClick={togglePanel} tabIndex={state.isPanelOpen ? 0 : -1}>
          <IconX size={20} />
        </CloseButton>

        <NowPlaying>
          <CoverHero $src={currentTrack?.coverUrl} aria-hidden='true' />
          <TrackHeading>{currentTrack?.name ?? '等待播放'}</TrackHeading>
          <TrackArtist>{currentTrack?.artist ?? ' '}</TrackArtist>

          <ProgressWrapper>
            <Slider
              type='range'
              min={0}
              max={totalDuration}
              step={0.1}
              value={Math.min(state.progress, totalDuration)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label='播放进度'
            />
            <TimeRow>
              <span>{formatDuration(state.progress)}</span>
              <span>{formatDuration(totalDuration)}</span>
            </TimeRow>
          </ProgressWrapper>

          <ControlRow>
            <SkipButton type='button' aria-label='上一首' onClick={playPrevious}>
              <IconSkipBack size={20} />
            </SkipButton>
            <PlayButton type='button' aria-label={playing ? '暂停' : '播放'} onClick={togglePlay}>
              {playing ? <IconPause size={24} /> : <IconPlay size={24} />}
            </PlayButton>
            <SkipButton type='button' aria-label='下一首' onClick={playNext}>
              <IconSkipForward size={20} />
            </SkipButton>
          </ControlRow>

          <ModeGroup role='group' aria-label='播放模式'>
            {(Object.keys(MODE_LABELS) as PlayerMode[]).map((mode) => {
              const ModeGlyph = MODE_ICONS[mode]
              return (
                <ModeButton
                  key={mode}
                  type='button'
                  $active={state.mode === mode}
                  aria-pressed={state.mode === mode}
                  onClick={() => setMode(mode)}
                >
                  <ModeGlyph size={13} /> {MODE_LABELS[mode]}
                </ModeButton>
              )
            })}
          </ModeGroup>

          <VolumeRow>
            <IconVolume size={16} aria-hidden='true' />
            <Slider
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={state.volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label='音量'
            />
          </VolumeRow>
        </NowPlaying>

        <DesktopSection aria-label='歌词'>
          <SectionHeading>歌词</SectionHeading>
          <LyricsScroll ref={scrollRef}>
            {lyrics.length ? (
              lyrics.map((line, index) => (
                <LyricLine key={`${line.time}-${index}`} data-lyric-index={index} $active={index === activeLyric}>
                  {line.text}
                </LyricLine>
              ))
            ) : (
              <LyricLine>暂无歌词</LyricLine>
            )}
          </LyricsScroll>
        </DesktopSection>

        <DesktopSection aria-label='播放列表'>
          <SectionHeading>
            <IconListMusic size={13} aria-hidden='true' /> 播放列表
          </SectionHeading>
          <QueueList ref={desktopQueueRef}>
            {queue.map((track) => (
              <QueueItem key={track.id} $active={track.id === currentTrack?.id} data-active={track.id === currentTrack?.id}>
                <QueueButton type='button' onClick={() => playTrack(track.id)}>
                  <QueueName $active={track.id === currentTrack?.id}>{track.name}</QueueName>
                  <QueueMeta>
                    <span>{track.artist}</span>
                    <span>{formatDuration(track.duration ?? 0)}</span>
                  </QueueMeta>
                </QueueButton>
              </QueueItem>
            ))}
          </QueueList>
        </DesktopSection>

        <MobileTabs role='tablist' aria-label='歌词与播放列表切换'>
          <MobileTab
            type='button'
            role='tab'
            $active={mobileTab === 'lyrics'}
            aria-selected={mobileTab === 'lyrics'}
            onClick={() => setMobileTab('lyrics')}
          >
            歌词
          </MobileTab>
          <MobileTab
            type='button'
            role='tab'
            $active={mobileTab === 'queue'}
            aria-selected={mobileTab === 'queue'}
            onClick={() => setMobileTab('queue')}
          >
            播放列表
          </MobileTab>
        </MobileTabs>

        <MobileSection
          role='tabpanel'
          aria-label='歌词'
          $active={mobileTab === 'lyrics'}
          aria-hidden={mobileTab !== 'lyrics'}
        >
          <LyricsScroll ref={mobileLyricsRef}>
            {lyrics.length ? (
              lyrics.map((line, index) => (
                <LyricLine key={`${line.time}-${index}`} data-lyric-index={index} $active={index === activeLyric}>
                  {line.text}
                </LyricLine>
              ))
            ) : (
              <LyricLine>暂无歌词</LyricLine>
            )}
          </LyricsScroll>
        </MobileSection>

        <MobileSection
          role='tabpanel'
          aria-label='播放列表'
          $active={mobileTab === 'queue'}
          aria-hidden={mobileTab !== 'queue'}
        >
          <QueueList ref={mobileQueueRef}>
            {queue.map((track) => (
              <QueueItem key={track.id} $active={track.id === currentTrack?.id} data-active={track.id === currentTrack?.id}>
                <QueueButton type='button' onClick={() => playTrack(track.id)}>
                  <QueueName $active={track.id === currentTrack?.id}>{track.name}</QueueName>
                  <QueueMeta>
                    <span>{track.artist}</span>
                    <span>{formatDuration(track.duration ?? 0)}</span>
                  </QueueMeta>
                </QueueButton>
              </QueueItem>
            ))}
          </QueueList>
        </MobileSection>
      </Panel>
    </>
  )
}
