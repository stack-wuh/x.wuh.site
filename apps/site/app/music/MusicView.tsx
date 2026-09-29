'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import Empty from '@wuh.site/components/empty'
import { useAudioPlayer } from '@wuh.site/components/audio-player'
import { SITE_NAME } from '@wuh.site/core'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { fetcher } from '@wuh.site/hooks/useFetch/fetcher'
import {
  formatTrackDuration,
  type MusicPlaylist,
  type MusicPlaylistTrack,
  type MusicUserProfile,
  type MusicUserPlaylistSummary
} from './specs'

const Section = styled.section`
  width: min(960px, 100%);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-base) var(--space-3xl);
  font-family: var(--font-sans);
  color: var(--text-color);
`

/* ===== 页头：站点 PageHeader 语言，右侧放网易云身份 ===== */

const PageHeader = styled.header`
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

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0;
`

const PageTitle = styled.h1`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.03em;
`

const PageSubtitle = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
`

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex-shrink: 0;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    align-self: flex-end;
  }
`

const Avatar = styled.img`
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: 1px solid color-mix(in oklab, var(--normal-500) 45%, transparent);
  border-radius: 50%;
  object-fit: cover;
  display: block;
`

const SealAvatar = styled.span`
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

const IdentityName = styled.span`
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
`

const LvBadge = styled.span`
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  padding: 1px 6px;
  border-radius: var(--border-radius-xs);
  border: 1px solid color-mix(in oklab, var(--accent-color) 55%, transparent);
  color: color-mix(in oklab, var(--accent-color) 78%, var(--text-color));
`

const Since = styled.span`
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    display: none;
  }
`

/* ==========================================================================
   年轮编年：左侧衬线年份纵轨（距当前越远越淡），右侧内容压超大水印年份；
   面板头是一张小黑胶——歌单封面做碟心圆标，切年轻转换面，播放时慢转。
   ========================================================================== */

const Chronicle = styled.div`
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

const Rail = styled.div`
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

const RailItem = styled.button`
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

const RailYear = styled.span<{ $dist: number }>`
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

const RailCount = styled.span`
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

const Content = styled.div`
  position: relative;
  min-width: 0;
`

const Watermark = styled.span`
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

const ContentInner = styled.div`
  position: relative;
  z-index: 1;
`

const PanelHead = styled.div`
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
const CoverDisc = styled.span<{ $rotation: number; $fading: boolean; $spinning: boolean; $fast: boolean }>`
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

const DiscLabel = styled.span`
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

const PanelCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

const PanelTitle = styled.h2`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  line-height: 1.4;
`

const PanelSub = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
`

/* 歌单描述 + 标签：站长自留地（描述来自网易云歌单简介；标签服务端后续补字段即点亮） */
const Intro = styled.p`
  margin: 0 0 var(--space-xs);
  max-width: 56ch;
  font-size: var(--font-size-sm);
  line-height: 1.9;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
`

const IntroTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 var(--space-sm);
`

const TagChip = styled.span`
  padding: 0 8px;
  font-size: var(--font-size-xs);
  line-height: 1.7;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  border: 1px solid color-mix(in oklab, var(--normal-400) 70%, transparent);
  border-radius: var(--border-radius-xs);
  background: color-mix(in oklab, var(--normal-300) 28%, transparent);
`

/* 按语：本卷播放次数最高的一首，像志书页脚的纪年按语 */
const Epigraph = styled.p`
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

const TrackList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`

const TrackRow = styled.li`
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

const TrackIndex = styled.span`
  position: relative;
  width: 2.2em;
  height: 20px;
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);
`

const IndexNum = styled.span.attrs({ className: 'track-idx-num' })`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  transition: opacity var(--motion-dur-quick) ease;
`

const IndexPlay = styled.span.attrs({ className: 'track-idx-play' })`
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

const PlayingDot = styled.span<{ $playing: boolean }>`
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--primary-color);
  opacity: ${(p) => (p.$playing ? 1 : 0)};
`

const TrackButton = styled.button`
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

const TrackName = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--font-size-sm);
  transition: color var(--motion-dur-quick) ease;
`

const TrackArtist = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  font-size: var(--font-size-xs);
  flex-shrink: 1;
`

const TrackPlays = styled.span`
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

const FavSlot = styled.span`
  width: 40px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
`

const FavBadge = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  font-size: var(--font-size-xs);
  line-height: 1.6;
  color: var(--primary-color);
  border: 1px solid color-mix(in oklab, var(--primary-color) 45%, transparent);
  border-radius: var(--border-radius-xs);
  background: color-mix(in oklab, var(--primary-color) 7%, var(--background-100));
`

const TrackDuration = styled.span`
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);
`

const TracksEmpty = styled.p`
  margin: 0;
  padding: var(--space-lg) 0;
  text-align: center;
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--text-color) 55%, transparent);
`

type MusicViewProps = {
  playlistId: string
  playlist: MusicPlaylist | null
  annualPlaylists: MusicUserPlaylistSummary[]
  profile?: MusicUserProfile
}

/** 歌单名里的 4 位年份；无年份回退歌单名（纵轨/水印兜底文案） */
const yearOf = (name: string): string => name.match(/(?:19|20)\d{2}/)?.[0] ?? name

export default function MusicView({ playlistId, playlist, annualPlaylists, profile }: MusicViewProps) {
  const { state, currentTrack, actions } = useAudioPlayer()
  const initialId = Number(playlistId)
  const [selectedId, setSelectedId] = useState<number | null>(Number.isFinite(initialId) ? initialId : null)
  const [selectedPlaylist, setSelectedPlaylist] = useState<MusicPlaylist | null>(playlist)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [fastMode, setFastMode] = useState(false)
  const [discRotation, setDiscRotation] = useState(0)
  const [discFading, setDiscFading] = useState(false)
  const lastSwitchRef = useRef(0)
  const discTimerRef = useRef<number | null>(null)

  const tracks = useMemo(() => selectedPlaylist?.tracks ?? [], [selectedPlaylist])
  const firstYear = useMemo(() => {
    const years = annualPlaylists
      .map((item) => item.name.match(/(?:19|20)\d{2}/)?.[0])
      .filter((year): year is string => Boolean(year))
      .sort()
    return years[0]
  }, [annualPlaylists])

  const selectedYear = useMemo(
    () => (selectedPlaylist?.name ? yearOf(selectedPlaylist.name) : ''),
    [selectedPlaylist]
  )

  const selectedIndex = useMemo(
    () => annualPlaylists.findIndex((item) => item.id === selectedId),
    [annualPlaylists, selectedId]
  )

  /* 按语：本卷播放次数最高的一首（playCount 缺省时不展示） */
  const favTrack = useMemo(() => {
    const maxPlays = tracks.reduce((max, track) => Math.max(max, track.playCount ?? 0), 0)
    if (maxPlays <= 0) return null
    return tracks.find((track) => (track.playCount ?? 0) === maxPlays) ?? null
  }, [tracks])

  /* 碟心慢转：正在播放且播的是这一卷的曲目 */
  const isQueuePlaying =
    state.status === 'playing' && !!currentTrack && tracks.some((track) => track.id === currentTrack.id)

  /* 切年换面：碟面淡出 → 轻转 120°（累计）→ 淡入；2 秒内连续切换自动收短 */
  useEffect(() => {
    if (discTimerRef.current) {
      window.clearTimeout(discTimerRef.current)
      discTimerRef.current = null
    }
    if (!selectedYear) return
    setDiscFading(true)
    discTimerRef.current = window.setTimeout(() => {
      setDiscRotation((deg) => deg + 120)
      setDiscFading(false)
    }, fastMode ? 60 : 160)
    return () => {
      if (discTimerRef.current) {
        window.clearTimeout(discTimerRef.current)
        discTimerRef.current = null
      }
    }
    // selectedPlaylist 变化即换面（首帧也走一次，把换面当作开场）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaylist?.playlistId])

  const selectYear = useCallback(
    async (id: number) => {
      if (id === selectedId || loading) return
      const now = Date.now()
      /* 2 秒内连续切换：快速档，换面收短 */
      setFastMode(now - lastSwitchRef.current < 2000)
      lastSwitchRef.current = now

      const previousId = selectedId
      setSelectedId(id)
      setLoadError(false)

      /* 首屏 SSR 已带该卷数据时直接展示，否则按需取数并同步 URL */
      if (playlist && playlist.playlistId === id) return

      setLoading(true)
      const { data, error } = await fetcher<MusicPlaylist>('/api/music/playlist', {
        query: { playlistId: String(id) }
      })
      setLoading(false)

      if (error || !data || !Array.isArray(data.tracks)) {
        setLoadError(true)
        setSelectedId(previousId)
        return
      }
      setSelectedPlaylist(data)
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/music?playlist=${id}`)
      }
    },
    [selectedId, loading, playlist]
  )

  const onRailKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
      if (!annualPlaylists.length) return
      event.preventDefault()
      const idx = annualPlaylists.findIndex((item) => item.id === selectedId)
      const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight'
      const next = forward ? Math.min(annualPlaylists.length - 1, idx + 1) : Math.max(0, idx - 1)
      const target = annualPlaylists[next]
      if (!target || target.id === selectedId) return
      selectYear(target.id)
      requestAnimationFrame(() => {
        event.currentTarget.querySelector<HTMLButtonElement>(`[data-year="${target.id}"]`)?.focus()
      })
    },
    [annualPlaylists, selectedId, selectYear]
  )

  const playFrom = useCallback(
    (index: number) => {
      if (!tracks.length) return
      actions.loadQueue(tracks, { startIndex: index, autoPlay: true })
    },
    [tracks, actions]
  )

  const renderTracks = (list: MusicPlaylistTrack[]) => {
    const maxPlays = list.reduce((max, track) => Math.max(max, track.playCount ?? 0), 0)
    return (
      <TrackList>
        {list.map((track, index) => {
          const isPlaying = currentTrack?.id === track.id
          const isFav = (track.playCount ?? 0) === maxPlays && maxPlays > 0
          return (
            <TrackRow key={`${track.id}-${index}`} onClick={() => playFrom(index)}>
              <TrackIndex aria-hidden="true">
                <IndexNum>{String(index + 1).padStart(2, '0')}</IndexNum>
                <IndexPlay>
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2 1.2v9.6L10.4 6z" />
                  </svg>
                </IndexPlay>
              </TrackIndex>
              <PlayingDot $playing={isPlaying} aria-hidden="true" />
              <TrackButton
                type="button"
                aria-label={`播放 ${track.name}${track.artist ? ` - ${track.artist}` : ''}`}
                aria-current={isPlaying ? 'true' : undefined}
              >
                <TrackName className="track-name">{track.name}</TrackName>
                <TrackArtist>{track.artist}</TrackArtist>
              </TrackButton>
              <TrackPlays title={track.playCount != null ? `播放 ${track.playCount} 次` : '暂无播放记录'}>
                {track.playCount != null ? (
                  <>
                    {track.playCount}
                    <span className="unit">次</span>
                  </>
                ) : (
                  '—'
                )}
              </TrackPlays>
              <TrackDuration>{formatTrackDuration(track.duration)}</TrackDuration>
              <FavSlot>{isFav ? <FavBadge title="该卷播放次数最高">最爱</FavBadge> : null}</FavSlot>
            </TrackRow>
          )
        })}
      </TrackList>
    )
  }

  /* SSR 歌单加载失败：保留可见失败态而不是让页面报错 */
  if (!selectedPlaylist) {
    return (
      <Section>
        <Empty
          title="歌单加载失败"
          description="网易云歌单暂时取不到，可以稍后刷新重试。"
          actions={[{ label: '刷新重试', href: `/music?playlist=${playlistId}` }]}
        />
      </Section>
    )
  }

  return (
    <Section>
      <PageHeader>
        <TitleGroup>
          <PageTitle>音乐</PageTitle>
          <PageSubtitle>网易云年度歌单 · 一年一卷编年</PageSubtitle>
        </TitleGroup>
        {profile && (profile.nickname || profile.avatarUrl) ? (
          <Identity>
            {profile.avatarUrl ? (
              <Avatar src={profile.avatarUrl} alt="" />
            ) : (
              <SealAvatar aria-hidden="true">{(profile.nickname ?? SITE_NAME).charAt(0)}</SealAvatar>
            )}
            <IdentityName>{profile.nickname ?? SITE_NAME}</IdentityName>
            {profile.level ? <LvBadge>Lv.{profile.level}</LvBadge> : null}
            {firstYear ? <Since>自 {firstYear} 年记录</Since> : null}
          </Identity>
        ) : null}
      </PageHeader>

      <Chronicle>
        {annualPlaylists.length ? (
          <Rail role="tablist" aria-label="切换年度歌单" aria-orientation="vertical" onKeyDown={onRailKeyDown}>
            {annualPlaylists.map((item, index) => (
              <RailItem
                key={item.id}
                type="button"
                role="tab"
                data-year={item.id}
                aria-current={item.id === selectedId}
                aria-controls="volume-panel"
                aria-label={`${item.name}，共 ${item.trackCount} 首`}
                onClick={() => selectYear(item.id)}
              >
                <RailYear $dist={selectedIndex < 0 ? 2 : Math.abs(index - selectedIndex)}>
                  {yearOf(item.name)}
                </RailYear>
                <RailCount>{item.trackCount} 首</RailCount>
              </RailItem>
            ))}
          </Rail>
        ) : null}

        <Content id="volume-panel" role="tabpanel" aria-label="当前歌单曲目">
          <Watermark aria-hidden="true">{selectedYear}</Watermark>
          <ContentInner>
            <PanelHead>
              <CoverDisc
                aria-hidden="true"
                $rotation={discRotation}
                $fading={discFading}
                $spinning={isQueuePlaying}
                $fast={fastMode}
              >
                <DiscLabel
                  style={
                    selectedPlaylist.coverUrl ? { backgroundImage: `url(${selectedPlaylist.coverUrl})` } : undefined
                  }
                />
              </CoverDisc>
              <PanelCopy>
                <PanelTitle>{selectedPlaylist.name ?? '歌单'}</PanelTitle>
                <PanelSub>
                  共 {tracks.length} 首
                  {selectedYear ? ` · ${selectedYear} 年度` : ''}
                  {loadError ? ' · 这一卷暂时取不到，稍后再试' : ''}
                </PanelSub>
              </PanelCopy>
            </PanelHead>

            {selectedPlaylist.description ? <Intro>{selectedPlaylist.description}</Intro> : null}
            {selectedPlaylist.tags?.length ? (
              <IntroTags>
                {selectedPlaylist.tags.map((tag) => (
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
              </IntroTags>
            ) : null}
            {favTrack ? (
              <Epigraph>
                这一年循环最多的是<span className="em">《{favTrack.name}》</span>
                ，听了 {favTrack.playCount} 遍。
              </Epigraph>
            ) : null}

            {tracks.length ? (
              renderTracks(tracks)
            ) : (
              <TracksEmpty role="status">
                {loadError ? '这一卷暂时取不到，稍后再试' : '这个歌单暂时没有曲目'}
              </TracksEmpty>
            )}
          </ContentInner>
        </Content>
      </Chronicle>
    </Section>
  )
}
