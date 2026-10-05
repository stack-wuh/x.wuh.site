'use client'

/* 迷你播放器：收起态声源指示（桌面书耳/移动印章）+ 跑马灯标题 + 跳过提示——样式拆至 mini/styles（20261005） */
import React, { useEffect, useState } from 'react'
import { useAudioPlayer } from './provider'
import { formatDuration } from './utils'
import { useLocale } from '@wuh.site/components/locales'
import Progress from '@wuh.site/components/progress'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconListMusic,
  IconPause,
  IconPlay,
  IconSkipBack,
  IconSkipForward
} from '@wuh.site/components/icons'
import { MARQUEE_GAP_PX, MARQUEE_SPEED_PX_PER_S, useMarqueeOverflow } from './useMarquee'
import {
  ActionGroup,
  Artist,
  CollapsedEar,
  Cover,
  CoverFallback,
  EarTab,
  Equalizer,
  IconButton,
  MetaCopy,
  MiniCard,
  MobileActionGroup,
  Notice,
  OpenPanelButton,
  PanelButton,
  PlayButton,
  ProgressRow,
  ProgressText,
  SealButton,
  Title,
  TitleCopy,
  TitleGhost,
  TitleRow,
  TitleTrack
} from './mini/styles'

const COLLAPSE_STORAGE_KEY = 'audio-mini-player-collapsed'


export const AudioMiniPlayer = () => {
  const { t } = useLocale()
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
  const name = currentTrack?.name ?? t('player.mini.waiting')
  const { wrapperRef, ghostRef, metrics } = useMarqueeOverflow(name)
  const marqueeActive = metrics.visible > 0 && metrics.text > metrics.visible
  const marqueeDuration = `${(metrics.text + MARQUEE_GAP_PX) / MARQUEE_SPEED_PX_PER_S}s`
  const totalDuration = Math.max(state.duration || currentTrack?.duration || 0, 0)
  const progressText =
    totalDuration > 0 ? `${formatDuration(state.progress)} / ${formatDuration(totalDuration)}` : t('player.mini.waiting')
  const progressPercent =
    totalDuration > 0 ? Math.min(1, Math.max(0, state.progress / totalDuration)) : 0
  const playing = state.status === 'playing'

  return (
    <>
      <MiniCard $visible={!collapsed} aria-hidden={collapsed}>
        <OpenPanelButton type='button' onClick={togglePanel} aria-label={t('player.mini.openPanel')} tabIndex={collapsed ? -1 : 0}>
          <Cover $src={currentTrack?.coverUrl} aria-hidden='true'>
            {!currentTrack?.coverUrl ? <CoverFallback /> : null}
          </Cover>
          <MetaCopy>
            <TitleRow>
              <Title $marquee={marqueeActive} ref={wrapperRef} title={name}>
                <TitleGhost ref={ghostRef} aria-hidden='true'>{name}</TitleGhost>
                {marqueeActive ? (
                  <TitleTrack $playing={playing} $duration={marqueeDuration}>
                    <TitleCopy>{name}</TitleCopy>
                    <TitleCopy aria-hidden='true'>{name}</TitleCopy>
                  </TitleTrack>
                ) : (
                  name
                )}
              </Title>
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
              <Artist title={currentTrack?.artist ?? ''}>{currentTrack?.artist ?? t('player.mini.loadingDefault')}</Artist>
            )}
          </MetaCopy>
        </OpenPanelButton>

        <ActionGroup>
          <IconButton type='button' aria-label={t('player.mini.previous')} onClick={playPrevious}>
            <IconSkipBack size={18} />
          </IconButton>
          <PlayButton type='button' aria-label={playing ? t('player.mini.pause') : t('player.mini.play')} onClick={togglePlay}>
            {playing ? <IconPause size={20} /> : <IconPlay size={20} />}
          </PlayButton>
          <IconButton type='button' aria-label={t('player.mini.next')} onClick={playNext}>
            <IconSkipForward size={18} />
          </IconButton>
          <PanelButton type='button' aria-label={t('player.mini.openPanel')} onClick={togglePanel}>
            <IconListMusic size={18} />
          </PanelButton>
        </ActionGroup>

        <MobileActionGroup>
          <PlayButton type='button' aria-label={playing ? t('player.mini.pause') : t('player.mini.play')} onClick={togglePlay}>
            {playing ? <IconPause size={20} /> : <IconPlay size={20} />}
          </PlayButton>
          <IconButton type='button' aria-label={t('player.mini.collapse')} onClick={toggleCollapsed}>
            <IconChevronDown size={20} />
          </IconButton>
        </MobileActionGroup>

        <ProgressRow>
          <Progress size='sm' value={progressPercent * 100} label={t('player.mini.progressLabel')} />
          <ProgressText>{progressText}</ProgressText>
        </ProgressRow>

        {/* 桌面书耳：卡片子元素，随卡片开合动画一体移动；移动端隐藏（移动端走 chevron-down 收起） */}
        <EarTab
          type='button'
          aria-label={t('player.mini.collapse')}
          aria-expanded={!collapsed}
          tabIndex={collapsed ? -1 : 0}
          onClick={toggleCollapsed}
        >
          <IconChevronLeft size={16} />
        </EarTab>
      </MiniCard>

      <CollapsedEar
        type='button'
        $visible={collapsed}
        $playing={playing}
        aria-label={t('player.mini.expand')}
        aria-expanded={!collapsed}
        onClick={toggleCollapsed}
      >
        {/* 播放中换装展开卡同款墨柱等化器指示声源，暂停/空闲回落展开箭头 */}
        {playing ? (
          <Equalizer $playing={playing} aria-hidden='true'>
            <span />
            <span />
            <span />
          </Equalizer>
        ) : (
          <IconChevronRight size={16} />
        )}
      </CollapsedEar>

      <SealButton type='button' $visible={collapsed} $playing={playing} aria-label={t('player.mini.expand')} onClick={toggleCollapsed}>
        音
      </SealButton>
    </>
  )
}
