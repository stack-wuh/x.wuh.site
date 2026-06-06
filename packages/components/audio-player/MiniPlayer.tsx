'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAudioPlayer } from './provider'
import { formatDuration } from './utils'

const COLLAPSE_STORAGE_KEY = 'audio-mini-player-collapsed'
const EXPANDED_CARD_WIDTH = 420

const MiniPlayerDock = styled.div<{ $collapsed: boolean }>`
  position: fixed;
  left: ${(p) => (p.$collapsed ? '0px' : '24px')};
  bottom: 24px;
  display: flex;
  align-items: stretch;
  z-index: 2500;
  font-family: var(--font-geist-sans, 'Geist', system-ui);

  @media (max-width: 640px) {
    left: ${(p) => (p.$collapsed ? '0px' : '12px')};
    bottom: 12px;
  }
`

const ToggleRail = styled.button<{ $collapsed: boolean }>`
  width: 56px;
  min-width: 56px;
  height: 92px;
  border: none;
  border-radius: 0 20px 20px 0;
  background: linear-gradient(180deg, rgba(43, 11, 15, 0.98), rgba(23, 10, 12, 0.96));
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: none;
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.35),
    inset 1px 0 0 rgba(255, 255, 255, 0.08);
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: linear-gradient(180deg, rgba(74, 18, 26, 1), rgba(38, 11, 16, 0.98));
    transform: translateX(1px);
    box-shadow:
      0 22px 48px rgba(0, 0, 0, 0.38),
      inset 1px 0 0 rgba(255, 255, 255, 0.12);
  }

  @media (max-width: 640px) {
    height: 84px;
  }
`

const ToggleGlyph = styled.span`
  font-size: 18px;
  line-height: 1;
`

const CardViewport = styled.div<{ $collapsed: boolean }>`
  width: ${(p) => (p.$collapsed ? '0px' : `${EXPANDED_CARD_WIDTH}px`)};
  height: 92px;
  overflow: hidden;
  transition: width 0.32s ease;

  @media (max-width: 640px) {
    width: ${(p) => (p.$collapsed ? '0px' : 'min(348px, calc(100vw - 80px))')};
    height: 84px;
  }
`

const CardShell = styled.div<{ $collapsed: boolean }>`
  width: ${EXPANDED_CARD_WIDTH}px;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 16px;
  padding: 0 18px;
  background:
    radial-gradient(circle at top left, rgba(229, 45, 75, 0.24), transparent 36%),
    linear-gradient(135deg, rgba(29, 12, 16, 0.96), rgba(14, 14, 18, 0.94) 58%, rgba(10, 10, 14, 0.96));
  backdrop-filter: blur(16px);
  color: var(--background-100, #f2f2f2);
  border-radius: 20px 0 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-right: none;
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  opacity: ${(p) => (p.$collapsed ? 0 : 1)};
  transform: translateX(${(p) => (p.$collapsed ? '18px' : '0px')});
  transform-origin: right center;
  transition: opacity 0.22s ease, transform 0.32s ease;

  @media (max-width: 640px) {
    width: min(348px, calc(100vw - 80px));
    padding: 0 14px;
    gap: 12px;
  }
`

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 77, 109, 0.4), rgba(255, 255, 255, 0.02));
`

const TrackMeta = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 14px;
`

const Cover = styled.div<{ $src?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  flex-shrink: 0;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'rgba(255, 255, 255, 0.16)')};
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
`

const MetaCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

const Title = styled.div`
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StatusBadge = styled.span`
  flex-shrink: 0;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 77, 109, 0.14);
  border: 1px solid rgba(255, 77, 109, 0.28);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 214, 221, 0.88);
`

const Artist = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.64);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
`

const ProgressValue = styled.div<{ $value: number }>`
  width: ${(p) => `${p.$value}%`};
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff375f, #ff6a3d);
`

const ProgressText = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
`

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    gap: 6px;
  }
`

const IconButton = styled.button<{ $primary?: boolean }>`
  width: ${(p) => (p.$primary ? '40px' : '34px')};
  height: ${(p) => (p.$primary ? '40px' : '34px')};
  border-radius: 50%;
  border: none;
  background: ${(p) =>
    p.$primary ? 'linear-gradient(135deg, #ff375f, #ff6a3d)' : 'rgba(255, 255, 255, 0.08)'};
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(p) => (p.$primary ? '0 10px 24px rgba(255, 55, 95, 0.34)' : 'none')};
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${(p) =>
      p.$primary ? 'linear-gradient(120deg, #ff637b, #ff9474)' : 'rgba(255, 255, 255, 0.16)'};
    transform: translateY(-1px);
  }
`

const PanelTrigger = styled.button`
  height: 34px;
  padding: 0 12px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
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
    totalDuration > 0 ? Math.min(100, Math.max(0, (state.progress / totalDuration) * 100)) : 0

  return (
    <MiniPlayerDock $collapsed={collapsed}>
      <CardViewport $collapsed={collapsed} aria-hidden={collapsed}>
        <CardShell $collapsed={collapsed}>
          <TrackMeta>
            <Cover $src={currentTrack?.coverUrl} />
            <MetaCopy>
              <TitleRow>
                <Title>{currentTrack?.name ?? '等待播放'}</Title>
                <StatusBadge>{state.status === 'playing' ? 'ON AIR' : 'PLAYER'}</StatusBadge>
              </TitleRow>
              <Artist>{currentTrack?.artist ?? '加载默认歌单...'}</Artist>
              <ProgressBar aria-hidden='true'>
                <ProgressValue $value={progressPercent} />
              </ProgressBar>
              <ProgressText>{progressText}</ProgressText>
            </MetaCopy>
          </TrackMeta>

          <Divider />

          <ActionGroup>
            <IconButton type='button' aria-label='上一首' onClick={playPrevious}>
              ‹
            </IconButton>
            <IconButton type='button' $primary aria-label='播放/暂停' onClick={togglePlay}>
              {state.status === 'playing' ? '⏸' : '▶'}
            </IconButton>
            <IconButton type='button' aria-label='下一首' onClick={playNext}>
              ›
            </IconButton>
            <PanelTrigger type='button' onClick={togglePanel}>
              面板
            </PanelTrigger>
          </ActionGroup>
        </CardShell>
      </CardViewport>

      <ToggleRail
        type='button'
        $collapsed={collapsed}
        aria-label={collapsed ? '展开播放器' : '收起播放器'}
        aria-expanded={!collapsed}
        onClick={toggleCollapsed}
      >
        <ToggleGlyph>{collapsed ? '❯' : '❮'}</ToggleGlyph>
      </ToggleRail>
    </MiniPlayerDock>
  )
}
