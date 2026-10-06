'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Empty from '@wuh.site/components/empty'
import { Equalizer, useAudioPlayer } from '@wuh.site/components/audio-player'
import { useLocale } from '@wuh.site/components/locales'
import { fetcher } from '@wuh.site/hooks/useFetch/fetcher'
import {
  formatTrackDuration,
  type MusicPlaylist,
  type MusicPlaylistTrack,
  type MusicUserPlaylistSummary
} from '../specs'
import {
  Chronicle,
  Content,
  ContentInner,
  CoverDisc,
  DiscLabel,
  Epigraph,
  FavBadge,
  FavSlot,
  IndexNum,
  IndexPlay,
  Intro,
  IntroTags,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PanelCopy,
  PanelHead,
  PanelSub,
  PanelTitle,
  PlayingSlot,
  Rail,
  RailCount,
  RailItem,
  RailYear,
  Section,
  TagChip,
  TitleGroup,
  TrackArtist,
  TrackButton,
  TrackDuration,
  TrackIndex,
  TrackList,
  TrackName,
  TrackPlays,
  TrackRow,
  TrackSide,
  TracksEmpty,
  Watermark
} from '../styles'

type MusicViewProps = {
  playlistId: string
  playlist: MusicPlaylist | null
  annualPlaylists: MusicUserPlaylistSummary[]
}

/** 歌单名里的 4 位年份；无年份回退歌单名（纵轨/水印兜底文案） */
const yearOf = (name: string): string => name.match(/(?:19|20)\d{2}/)?.[0] ?? name

export default function MusicView({ playlistId, playlist, annualPlaylists }: MusicViewProps) {
  const { t } = useLocale()
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
  const railRef = useRef<HTMLDivElement | null>(null)

  const tracks = useMemo(() => selectedPlaylist?.tracks ?? [], [selectedPlaylist])

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

      /* 移动端刻度带：把选中年份滚到居中（reduced-motion 下瞬移） */
      requestAnimationFrame(() => {
        const target = railRef.current?.querySelector<HTMLButtonElement>(`[data-year="${id}"]`)
        const reduce =
          typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
      })

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

  /* 移动刻度带在桌面鼠标下不可滚：pointer 拖拽横滑，拖动后拦截误触点击（触屏走原生滚动不介入） */
  useEffect(() => {
    const rail = railRef.current
    if (!rail || typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let dragging = false
    let moved = false
    let startX = 0
    let startLeft = 0

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      dragging = true
      moved = false
      startX = event.clientX
      startLeft = rail.scrollLeft
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      const dx = event.clientX - startX
      if (Math.abs(dx) > 4) {
        moved = true
        rail.setPointerCapture(event.pointerId)
        rail.scrollLeft = startLeft - dx
      }
    }
    const onPointerUp = () => {
      dragging = false
    }
    const onClickCapture = (event: MouseEvent) => {
      if (!moved) return
      event.preventDefault()
      event.stopPropagation()
      moved = false
    }

    rail.addEventListener('pointerdown', onPointerDown)
    rail.addEventListener('pointermove', onPointerMove)
    rail.addEventListener('pointerup', onPointerUp)
    rail.addEventListener('click', onClickCapture, true)
    return () => {
      rail.removeEventListener('pointerdown', onPointerDown)
      rail.removeEventListener('pointermove', onPointerMove)
      rail.removeEventListener('pointerup', onPointerUp)
      rail.removeEventListener('click', onClickCapture, true)
    }
  }, [])

  const playFrom = useCallback(
    (index: number) => {
      if (!tracks.length) return
      // 卷名随队列流入面板卷题签（本卷语义与年轮编年同源）
      actions.loadQueue(tracks, { startIndex: index, autoPlay: true, playlistName: selectedPlaylist?.name })
    },
    [tracks, actions, selectedPlaylist?.name]
  )

  const renderTracks = (list: MusicPlaylistTrack[]) => {
    const maxPlays = list.reduce((max, track) => Math.max(max, track.playCount ?? 0), 0)
    return (
      <TrackList>
        {list.map((track, index) => {
          // isCurrent 是「当前行」（命名修复：旧码误名 isPlaying，暂停红点不消失即此因）；
          // 等化器跳动/冻结取真实播放态 isQueuePlaying（暂停停走纪律）
          const isCurrent = currentTrack?.id === track.id
          const playing = isCurrent && isQueuePlaying
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
              <PlayingSlot aria-hidden="true">
                {isCurrent ? <Equalizer $playing={playing}><span /><span /><span /></Equalizer> : null}
              </PlayingSlot>
              <TrackButton
                type="button"
                aria-label={track.artist
                  ? t('music.page.playTrackArtistAria', { name: track.name, artist: track.artist })
                  : t('music.page.playTrackAria', { name: track.name })}
                aria-current={isCurrent ? 'true' : undefined}
              >
                <TrackName className="track-name">{track.name}</TrackName>
                <TrackArtist>{track.artist}</TrackArtist>
              </TrackButton>
              <TrackSide>
                <TrackPlays
                  title={track.playCount != null
                    ? t('music.page.playsTitle', { count: track.playCount })
                    : t('music.page.playsTitleEmpty')}
                >
                  {track.playCount != null ? (
                    <>
                      {track.playCount}
                      <span className="unit">{t('music.page.playsUnit')}</span>
                    </>
                  ) : (
                    '—'
                  )}
                </TrackPlays>
                <TrackDuration>{formatTrackDuration(track.duration)}</TrackDuration>
                <FavSlot>
                  {isFav ? (
                    <FavBadge title={t('music.page.favBadgeTitle')}>{t('music.page.favBadge')}</FavBadge>
                  ) : null}
                </FavSlot>
              </TrackSide>
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
          title={t('music.page.loadFailedTitle')}
          description={t('music.page.loadFailedDesc')}
          actions={[{ label: t('music.page.retry'), href: `/music?playlist=${playlistId}` }]}
        />
      </Section>
    )
  }

  return (
    <Section>
      <PageHeader>
        <TitleGroup>
          <PageTitle>{t('music.page.title')}</PageTitle>
          <PageSubtitle>{t('music.page.subtitle')}</PageSubtitle>
        </TitleGroup>
      </PageHeader>

      <Chronicle>
        {annualPlaylists.length ? (
          <Rail
            ref={railRef}
            role="tablist"
            aria-label={t('music.page.railAria')}
            aria-orientation="vertical"
            onKeyDown={onRailKeyDown}
          >
            {annualPlaylists.map((item, index) => (
              <RailItem
                key={item.id}
                type="button"
                role="tab"
                data-year={item.id}
                aria-current={item.id === selectedId}
                aria-controls="volume-panel"
                aria-label={t('music.page.railItemAria', { name: item.name, count: item.trackCount })}
                onClick={() => selectYear(item.id)}
              >
                <RailYear $dist={selectedIndex < 0 ? 2 : Math.abs(index - selectedIndex)}>
                  {yearOf(item.name)}
                </RailYear>
                <RailCount>{t('music.page.railCount', { count: item.trackCount })}</RailCount>
              </RailItem>
            ))}
          </Rail>
        ) : null}

        <Content id="volume-panel" role="tabpanel" aria-label={t('music.page.panelAria')}>
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
                <PanelTitle>{selectedPlaylist.name ?? t('music.page.playlistFallback')}</PanelTitle>
                <PanelSub>
                  {t('music.page.panelSubCount', { count: tracks.length })}
                  {selectedYear ? t('music.page.panelYearSuffix', { year: selectedYear }) : ''}
                  {loadError ? t('music.page.panelErrorSuffix') : ''}
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
                {t('music.page.epigraphPrefix')}
                <span className="em">{favTrack.name}</span>
                {t('music.page.epigraphSuffix', { count: favTrack.playCount ?? 0 })}
              </Epigraph>
            ) : null}

            {tracks.length ? (
              renderTracks(tracks)
            ) : (
              <TracksEmpty role="status">
                {loadError ? t('music.page.volumeError') : t('music.page.noTracks')}
              </TracksEmpty>
            )}
          </ContentInner>
        </Content>
      </Chronicle>
    </Section>
  )
}
