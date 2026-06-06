'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useAudioPlayer } from './provider'
import { findActiveLyricIndex, formatDuration, parseLyrics } from './utils'
import type { PlayerMode } from './types'

const Backdrop = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(20px);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity 0.25s ease;
  z-index: 2400;
`

const slideUp = keyframes`
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const Panel = styled.div<{ $visible: boolean; $cover?: string }>`
  position: fixed;
  inset: 40px 48px;
  background: ${(p) =>
    p.$cover
      ? `linear-gradient(120deg, rgba(0,0,0,0.75), rgba(0,0,0,0.25)), url(${p.$cover}) center/cover`
      : 'rgba(12, 12, 18, 0.9)'};
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  gap: 32px;
  padding: 32px 42px;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transform: translateY(${(p) => (p.$visible ? '0' : '20px')});
  transition: opacity 0.28s ease, transform 0.28s ease;
  color: #fff;
  z-index: 2500;
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  font-family: var(--font-sans);
  animation: ${(p) => (p.$visible ? css`${slideUp} 0.35s ease` : 'none')};
`

const Section = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`

const CoverHero = styled.div<{ $src?: string }>`
  width: 380px;
  height: 380px;
  border-radius: 28px;
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'rgba(255, 255, 255, 0.1)')};
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
  margin-bottom: 24px;
`

const Heading = styled.div`
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
`

const SubHeading = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 6px;
`

const ProgressWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Slider = styled.input`
  width: 100%;
  accent-color: #f78361;
`

const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
`

const ControlRow = styled.div`
  margin-top: 28px;
  display: flex;
  align-items: center;
  gap: 18px;
`

const GhostButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const IconButton = styled.button<{ $active?: boolean }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: ${(p) => (p.$active ? '2px solid #f78361' : '1px solid rgba(255,255,255,0.25)')};
  background: ${(p) => (p.$active ? 'rgba(247, 131, 97, 0.2)' : 'transparent')};
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`

const LyricsPanel = styled.div`
  flex: 1;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(0, 0, 0, 0.25);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const LyricsScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 12px;
  scroll-behavior: smooth;
`

const LyricLine = styled.div<{ $active?: boolean }>`
  padding: 6px 0;
  font-size: 16px;
  color: ${(p) => (p.$active ? '#fff' : 'rgba(255, 255, 255, 0.6)')};
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  transform: ${(p) => (p.$active ? 'scale(1.02)' : 'scale(1)')};
  transition: color 0.2s ease, transform 0.2s ease;
`

const QueueList = styled.div`
  flex: 1;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  padding: 18px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const QueueItem = styled.button<{ $active?: boolean }>`
  border: none;
  background: ${(p) => (p.$active ? 'rgba(247, 131, 97, 0.18)' : 'transparent')};
  padding: 10px 12px;
  border-radius: 14px;
  color: #fff;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`

const QueueMeta = styled.div`
  display: flex;
  flex-direction: column;
`

const QueueArtist = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`

const VolumeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`

const ModeGroup = styled.div`
  display: flex;
  gap: 8px;
`

const CloseButton = styled.button`
  position: absolute;
  top: 28px;
  right: 36px;
  border: none;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
`

const MODE_LABELS: Record<PlayerMode, string> = {
  order: '顺序',
  'repeat-one': '单曲',
  shuffle: '随机'
}

export const AudioPlayerPanel = () => {
  const {
    currentTrack,
    queue,
    state,
    actions: { togglePanel, playNext, playPrevious, togglePlay, seek, setVolume, setMode, playTrack }
  } = useAudioPlayer()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const totalDuration = Math.max(state.duration || currentTrack?.duration || 0, 0.01)

  const lyrics = useMemo(() => parseLyrics(currentTrack?.lyrics), [currentTrack?.lyrics])
  const activeLyric = useMemo(() => findActiveLyricIndex(lyrics, state.progress), [lyrics, state.progress])

  useEffect(() => {
    if (!scrollRef.current) return
    if (activeLyric < 0) return
    const el = scrollRef.current.querySelector<HTMLDivElement>(`[data-lyric-index="${activeLyric}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeLyric])

  return (
    <>
      <Backdrop $visible={state.isPanelOpen} onClick={togglePanel} />
      <Panel $visible={state.isPanelOpen} $cover={currentTrack?.coverUrl}>
        <CloseButton onClick={togglePanel}>×</CloseButton>
        <Section style={{ flex: 1.1 }}>
          <CoverHero $src={currentTrack?.coverUrl} />
          <Heading>{currentTrack?.name ?? '等待播放'}</Heading>
          <SubHeading>{currentTrack?.artist}</SubHeading>

          <ProgressWrapper>
            <Slider
              type='range'
              min={0}
              max={totalDuration}
              value={state.progress}
              onChange={(e) => seek(Number(e.target.value))}
            />
            <TimeRow>
              <span>{formatDuration(state.progress)}</span>
              <span>{formatDuration(totalDuration)}</span>
            </TimeRow>
          </ProgressWrapper>

          <ControlRow>
            <IconButton onClick={playPrevious}>⟵</IconButton>
            <IconButton onClick={togglePlay}>{state.status === 'playing' ? '⏸' : '▶'}</IconButton>
            <IconButton onClick={playNext}>⟶</IconButton>
            <GhostButton onClick={togglePanel}>收起面板</GhostButton>
          </ControlRow>

          <VolumeRow>
            <span>音量</span>
            <Slider
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={state.volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </VolumeRow>

          <ModeGroup>
            {(Object.keys(MODE_LABELS) as PlayerMode[]).map((mode) => (
              <GhostButton key={mode} onClick={() => setMode(mode)} style={{ opacity: state.mode === mode ? 1 : 0.6 }}>
                {MODE_LABELS[mode]}
              </GhostButton>
            ))}
          </ModeGroup>
        </Section>

        <Section>
          <LyricsPanel>
            <Heading style={{ fontSize: 20 }}>歌词</Heading>
            <LyricsScroll ref={scrollRef}>
              {lyrics.length ? (
                lyrics.map((line, index) => (
                  <LyricLine key={line.time} data-lyric-index={index} $active={index === activeLyric}>
                    {line.text}
                  </LyricLine>
                ))
              ) : (
                <LyricLine>暂无歌词</LyricLine>
              )}
            </LyricsScroll>
          </LyricsPanel>
        </Section>

        <Section>
          <Heading style={{ fontSize: 20 }}>播放列表</Heading>
          <QueueList>
            {queue.map((track) => (
              <QueueItem key={track.id} onClick={() => playTrack(track.id)} $active={track.id === currentTrack?.id}>
                <span>{track.name}</span>
                <QueueMeta>
                  <QueueArtist>{track.artist}</QueueArtist>
                  <QueueArtist>{formatDuration(track.duration ?? 0)}</QueueArtist>
                </QueueMeta>
              </QueueItem>
            ))}
          </QueueList>
        </Section>
      </Panel>
    </>
  )
}
