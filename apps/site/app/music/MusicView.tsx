'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
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

/* ===== 年鉴书架：书脊朝外，点选在原位让出的缺口里翻开 ===== */

const ShelfWrap = styled.section`
  padding: var(--space-lg) 0 var(--space-base);
`

const ShelfScroll = styled.div`
  overflow-x: auto;
  padding-bottom: var(--space-xs);
  scrollbar-width: thin;
`

const Shelf = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 9px;
  min-width: min-content;
  padding: var(--space-lg) 32px 0 var(--space-base);
  border-bottom: 2px solid color-mix(in oklab, var(--normal-800) 70%, transparent);

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

const SPINE_TINTS = [
  'var(--background-200)',
  'var(--background-300)',
  'color-mix(in oklab, var(--primary-color) 8%, var(--background-100))'
] as const;

const Volume = styled.button<{ $spineWidth: number; $tint: number; $fast: boolean }>`
  position: relative;
  flex: 0 0 auto;
  scroll-snap-align: start;
  background: none;
  border: none;
  padding: 0;
  height: 148px;
  width: ${(p) => p.$spineWidth}px;
  perspective: 900px;
  transition:
    transform var(--motion-dur-quick) var(--motion-ease-out-soft),
    margin-left var(--motion-dur-write) var(--motion-ease-out-soft);

  /* 热区扩大：视觉 26px 书脊，命中区向两侧各扩 4px（间隙 9px 不重叠），竖向再扩 6px */
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    bottom: -6px;
    left: -4px;
    right: -4px;
  }

  &:hover {
    transform: translateY(-6px);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  /* 书架物理学：抽出的书在原位旁让出缺口（margin 动画），翻开在缺口里进行，不盖任何邻居 */
  &[aria-current='true'] {
    margin-left: 106px;
    transform: translateY(-14px);
    z-index: 3;
  }

  ${(p) =>
    p.$fast
      ? css`
          transition:
            transform var(--motion-dur-quick) var(--motion-ease-out-soft),
            margin-left var(--motion-dur-quick) var(--motion-ease-out-soft);
        `
      : ''}

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.01ms;
  }
`

const Book = styled.span<{ $open: boolean; $fast: boolean }>`
  display: block;
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateY(0deg);
  transition: transform var(--motion-dur-write) var(--motion-ease-out-soft);

  ${(p) =>
    p.$open
      ? css`
          transform: rotateY(24deg) translateZ(30px);
          transition: transform var(--motion-dur-write) var(--motion-ease-out-soft) 60ms;
        `
      : ''}
  ${(p) =>
    p.$fast
      ? css`
          transition: transform var(--motion-dur-quick) var(--motion-ease-out-soft);
        `
      : ''}

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.01ms;
  }
`

const Spine = styled.span<{ $tint: number }>`
  display: block;
  position: absolute;
  inset: 0;
  border: 1px solid color-mix(in oklab, var(--normal-500) 45%, transparent);
  border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
  background: ${(p) => SPINE_TINTS[p.$tint % SPINE_TINTS.length]};
  box-shadow:
    inset 3px 0 6px -3px rgba(0, 0, 0, 0.28),
    inset -2px 0 4px -2px rgba(0, 0, 0, 0.16);
  transition:
    background-color var(--motion-dur-quick) ease,
    border-color var(--motion-dur-quick) ease;

  /* 精装书脊的上下捆线带 */
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 4px;
    right: 4px;
    height: 4px;
    background: color-mix(in oklab, var(--primary-color) 28%, transparent);
  }

  &::before {
    top: 10px;
  }

  &::after {
    bottom: 10px;
  }
`

const SpineYear = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  letter-spacing: 0.18em;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  transition: color var(--motion-dur-quick) ease;
`

const CoverFace = styled.span<{ $open: boolean; $fast: boolean }>`
  display: block;
  position: absolute;
  top: 0;
  right: 100%;
  width: 108px;
  height: 100%;
  transform-origin: right center;
  transform: rotateY(-90deg);
  backface-visibility: hidden;
  border: 1px solid color-mix(in oklab, var(--normal-500) 45%, transparent);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  background: var(--background-200);
  box-shadow: var(--elevation-card);
  transition: transform var(--motion-dur-quick) var(--motion-ease-out-soft);

  img {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  ${(p) =>
    p.$open
      ? css`
          /* 展开：从贴脊扇形开到近正面；对点击穿透，被盖书脊始终可点 */
          transform: rotateY(-18deg);
          transition: transform var(--motion-dur-reveal) var(--motion-ease-out-soft) 150ms;
          pointer-events: none;
        `
      : ''}
  ${(p) =>
    p.$fast && p.$open
      ? css`
          transition: transform var(--motion-dur-write) var(--motion-ease-out-soft);
        `
      : ''}

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.01ms;
  }
`

const CoverYearFallback = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: color-mix(in oklab, var(--primary-color) 82%, var(--text-color));
`

const Ribbon = styled.span<{ $open: boolean; $fast: boolean }>`
  display: block;
  position: absolute;
  top: -15px;
  left: 55%;
  width: 8px;
  height: 28px;
  background: linear-gradient(180deg, var(--primary-color), color-mix(in oklab, var(--primary-color) 70%, black));
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%);
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity var(--motion-dur-quick) ease,
    transform var(--motion-dur-quick) var(--motion-ease-out-soft);

  ${(p) =>
    p.$open
      ? css`
          opacity: 1;
          transform: none;
          transition:
            opacity var(--motion-dur-quick) ease 600ms,
            transform var(--motion-dur-quick) var(--motion-ease-out-soft) 600ms;
        `
      : ''}
  ${(p) =>
    p.$fast && p.$open
      ? css`
          transition:
            opacity var(--motion-dur-quick) ease 120ms,
            transform var(--motion-dur-quick) var(--motion-ease-out-soft) 120ms;
        `
      : ''}

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.01ms;
  }
`

/* ===== 当前卷册：封面小图与架上翻开的书同一张封面，缝住书与列表 ===== */

const VolumeView = styled.section<{ $dim: boolean }>`
  padding-top: 0;
  opacity: ${(p) => (p.$dim ? 0.55 : 1)};
  transition: opacity var(--motion-dur-quick) ease;
`

const VolumeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 0 var(--space-sm);
`

const VolumeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-width: 0;
`

const VolumeCover = styled.span`
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border: 1px solid color-mix(in oklab, var(--normal-500) 45%, transparent);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  background: var(--background-200);
  box-shadow: var(--elevation-soft);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

const VolumeCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const VolumeTitle = styled.h2`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  line-height: 1.4;
`

const VolumeSub = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
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

/** 歌单名里的 4 位年份；无年份回退歌单名（书脊/封面兜底文案） */
const yearOf = (name: string): string => name.match(/(?:19|20)\d{2}/)?.[0] ?? name

export default function MusicView({ playlistId, playlist, annualPlaylists, profile }: MusicViewProps) {
  const { currentTrack, actions } = useAudioPlayer()
  const initialId = Number(playlistId)
  const [selectedId, setSelectedId] = useState<number | null>(Number.isFinite(initialId) ? initialId : null)
  const [selectedPlaylist, setSelectedPlaylist] = useState<MusicPlaylist | null>(playlist)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [fastMode, setFastMode] = useState(false)
  const lastSwitchRef = useRef(0)

  const tracks = useMemo(() => selectedPlaylist?.tracks ?? [], [selectedPlaylist])
  const firstYear = useMemo(() => {
    const years = annualPlaylists
      .map((book) => book.name.match(/(?:19|20)\d{2}/)?.[0])
      .filter((year): year is string => Boolean(year))
      .sort()
    return years[0]
  }, [annualPlaylists])

  const selectYear = useCallback(
    async (id: number) => {
      if (id === selectedId || loading) return
      const now = Date.now()
      /* 2 秒内连续切换：书架进入快速档，编排收短 */
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

  const onShelfKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (!annualPlaylists.length) return
      event.preventDefault()
      const idx = annualPlaylists.findIndex((book) => book.id === selectedId)
      const next =
        event.key === 'ArrowRight'
          ? Math.min(annualPlaylists.length - 1, idx + 1)
          : Math.max(0, idx - 1)
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
          <PageSubtitle>网易云年度歌单 · 一年一卷，点选翻开</PageSubtitle>
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

      {annualPlaylists.length ? (
        <ShelfWrap>
          <ShelfScroll>
            <Shelf role="tablist" aria-label="切换年度歌单" onKeyDown={onShelfKeyDown}>
              {annualPlaylists.map((book, index) => (
                <Volume
                  key={book.id}
                  type="button"
                  role="tab"
                  data-year={book.id}
                  aria-current={book.id === selectedId}
                  aria-controls="volume-panel"
                  aria-label={`${book.name}，共 ${book.trackCount} 首`}
                  $spineWidth={Math.max(26, 16 + book.trackCount)}
                  $tint={index}
                  $fast={fastMode}
                  onClick={() => selectYear(book.id)}
                >
                  <Book $open={book.id === selectedId} $fast={fastMode}>
                    <Spine $tint={index}>
                      <SpineYear>{yearOf(book.name)}</SpineYear>
                    </Spine>
                    <CoverFace $open={book.id === selectedId} $fast={fastMode}>
                      <CoverYearFallback aria-hidden="true">{yearOf(book.name)}</CoverYearFallback>
                      {book.coverUrl ? <img src={book.coverUrl} alt="" loading="lazy" /> : null}
                    </CoverFace>
                  </Book>
                  <Ribbon $open={book.id === selectedId} $fast={fastMode} aria-hidden="true" />
                </Volume>
              ))}
            </Shelf>
          </ShelfScroll>
        </ShelfWrap>
      ) : null}

      <VolumeView id="volume-panel" role="tabpanel" aria-label="当前歌单曲目" $dim={loading}>
        <VolumeHeader>
          <VolumeLeft>
            {selectedPlaylist?.coverUrl ? (
              <VolumeCover>
                <img src={selectedPlaylist.coverUrl} alt="" />
              </VolumeCover>
            ) : null}
            <VolumeCopy>
              <VolumeTitle>{selectedPlaylist?.name ?? '歌单'}</VolumeTitle>
              <VolumeSub>
                共 {tracks.length} 首
                {loadError ? ' · 这一卷暂时取不到，稍后再试' : ''}
              </VolumeSub>
            </VolumeCopy>
          </VolumeLeft>
        </VolumeHeader>

        {tracks.length ? (
          renderTracks(tracks)
        ) : (
          <TracksEmpty role="status">
            {loadError ? '这一卷暂时取不到，稍后再试' : '这个歌单暂时没有曲目'}
          </TracksEmpty>
        )}
      </VolumeView>
    </Section>
  )
}
