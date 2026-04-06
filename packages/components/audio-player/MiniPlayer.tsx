'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useAudioPlayer } from './provider'
import { formatDuration } from './utils'

const MiniPlayerShell = styled.div<{ $collapsed: boolean }>`
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: ${(p) => (p.$collapsed ? '220px' : '360px')};
  min-height: ${(p) => (p.$collapsed ? '64px' : '120px')};
  background: rgba(15, 15, 20, 0.78);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  color: var(--background-100, #f2f2f2);
  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.35);
  padding: ${(p) => (p.$collapsed ? '12px 18px' : '18px 22px')};
  display: flex;
  flex-direction: ${(p) => (p.$collapsed ? 'row' : 'column')};
  gap: 12px;
  align-items: ${(p) => (p.$collapsed ? 'center' : 'stretch')};
  z-index: 2500;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  font-family: var(--font-geist-sans, 'Geist', system-ui);
`

const TrackMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Cover = styled.div<{ $src?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  flex-shrink: 0;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'rgba(255, 255, 255, 0.18)')};
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  color: #fff;
`

const Artist = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
`

const Controls = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? 'flex-end' : 'space-between')};
  gap: ${(p) => (p.$collapsed ? '10px' : '16px')};
  width: 100%;
`

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`

const PrimaryButton = styled(IconButton)`
  width: 44px;
  height: 44px;
  background: linear-gradient(120deg, #f54b64, #f78361);
  box-shadow: 0 10px 25px rgba(245, 75, 100, 0.5);
`

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const Slider = styled.input`
  flex: 1;
  accent-color: #f78361;
`

const TimeLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`

const PanelTrigger = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

export const AudioMiniPlayer = () => {
  const {
    currentTrack,
    state,
    actions: { togglePlay, playNext, playPrevious, seek, togglePanel }
  } = useAudioPlayer()
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => setCollapsed((prev) => !prev)
  const totalDuration = Math.max(state.duration || currentTrack?.duration || 0, 0.01)

  if (!currentTrack) {
    return (
      <MiniPlayerShell $collapsed={collapsed}>
        <TrackMeta>
          <Cover />
          <div>
            <Title>等待播放</Title>
            <Artist>加载默认歌单...</Artist>
          </div>
        </TrackMeta>
      </MiniPlayerShell>
    )
  }

  return (
    <MiniPlayerShell $collapsed={collapsed}>
      <TrackMeta>
        <Cover $src={currentTrack.coverUrl} />
        <div>
          <Title>{currentTrack.name}</Title>
          <Artist>{currentTrack.artist}</Artist>
        </div>
      </TrackMeta>

      {!collapsed && (
        <ProgressWrapper>
          <TimeLabel>{formatDuration(state.progress)}</TimeLabel>
          <Slider
            type='range'
            min={0}
            max={totalDuration}
            value={state.progress}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <TimeLabel>{formatDuration(totalDuration)}</TimeLabel>
        </ProgressWrapper>
      )}

      <Controls $collapsed={collapsed}>
        <IconButton aria-label='切换模式' onClick={toggleCollapsed}>
          {collapsed ? '⤢' : '⤡'}
        </IconButton>
        {!collapsed && (
          <IconButton aria-label='上一首' onClick={playPrevious}>
            ‹
          </IconButton>
        )}
        <PrimaryButton aria-label='播放/暂停' onClick={togglePlay}>
          {state.status === 'playing' ? '⏸' : '▶'}
        </PrimaryButton>
        {!collapsed && (
          <IconButton aria-label='下一首' onClick={playNext}>
            ›
          </IconButton>
        )}
        <PanelTrigger onClick={togglePanel}>面板</PanelTrigger>
      </Controls>
    </MiniPlayerShell>
  )
}
