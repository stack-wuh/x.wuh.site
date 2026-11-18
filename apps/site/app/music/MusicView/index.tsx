'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Empty from '@wuh.site/components/empty'
import { Equalizer, useAudioPlayer } from '@wuh.site/components/audio-player'
import { useLocale } from '@wuh.site/components/locales'
import { useEventListener } from '@wuh.site/hooks/useEventListener'
import { useViewTransition } from '@wuh.site/hooks/useViewTransition'
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
  IntroSkeleton,
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
  SkeletonBar,
  SkeletonIndex,
  SkeletonMain,
  SkeletonRow,
  SkeletonSide,
  SkeletonStatus,
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
  const { withTransition } = useViewTransition()
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

  /* 取数期间面板头先显目标卷（纵轨选中项），与水印年份、列表骨架三者同源，
     避免「已翻到 2025、卷名/水印仍压 2026」的错位感；数据到达后统一由真卷接管 */
  const targetSummary = loading ? annualPlaylists.find((item) => item.id === selectedId) : undefined
  const watermarkYear = targetSummary ? yearOf(targetSummary.name) : selectedYear
  const panelTitle = targetSummary?.name ?? selectedPlaylist?.name ?? t('music.page.playlistFallback')

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

  /* 切年换面：碟面淡出 → 轻转 120°（累计）→ 淡入；2 秒内连续切换自动收短。
     取数反馈由列表骨架承担，面板头（含碟面）在取数期间保持不动，只在数据到达时换面 */
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

      /* 首屏 SSR 已带该卷数据时仍经换幕提交（修复切回首屏年时面板滞留旧卷），否则按需取数并同步 URL */
      if (playlist && playlist.playlistId === id) {
        withTransition(() => {
          setSelectedPlaylist(playlist)
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `/music?playlist=${id}`)
          }
        })
        return
      }

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
      /* 换幕层 1：数据提交经 startViewTransition 交叉淡化（回落分支不影响失败路径语义） */
      withTransition(() => {
        setSelectedPlaylist(data)
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `/music?playlist=${id}`)
        }
      })
    },
    [selectedId, loading, playlist, withTransition]
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
  // (pointer: fine) 门控按原实现语义在挂载时求值一次（会话内切换输入设备不重判）
  const [finePointer] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)
  const railDragRef = useRef({ dragging: false, moved: false, startX: 0, startLeft: 0 })

  const onRailPointerDown = (event: PointerEvent) => {
    const rail = railRef.current
    if (!rail) return
    if (event.pointerType !== 'mouse') return
    railDragRef.current.dragging = true
    railDragRef.current.moved = false
    railDragRef.current.startX = event.clientX
    railDragRef.current.startLeft = rail.scrollLeft
  }
  const onRailPointerMove = (event: PointerEvent) => {
    const rail = railRef.current
    if (!rail) return
    const drag = railDragRef.current
    if (!drag.dragging) return
    const dx = event.clientX - drag.startX
    if (Math.abs(dx) > 4) {
      drag.moved = true
      rail.setPointerCapture(event.pointerId)
      rail.scrollLeft = drag.startLeft - dx
    }
  }
  const onRailPointerUp = () => {
    railDragRef.current.dragging = false
  }
  const onRailClickCapture = (event: MouseEvent) => {
    const drag = railDragRef.current
    if (!drag.moved) return
    event.preventDefault()
    event.stopPropagation()
    drag.moved = false
  }

  useEventListener('pointerdown', onRailPointerDown, railRef, { enabled: finePointer })
  useEventListener('pointermove', onRailPointerMove, railRef, { enabled: finePointer })
  useEventListener('pointerup', onRailPointerUp, railRef, { enabled: finePointer })
  useEventListener('click', onRailClickCapture, railRef, { enabled: finePointer, capture: true })

  const playFrom = useCallback(
    (index: number) => {
      if (!tracks.length) return
      // 卷名随队列流入面板卷题签（本卷语义与年轮编年同源）
      actions.loadQueue(tracks, { startIndex: index, autoPlay: true, playlistName: selectedPlaylist?.name })
    },
    [tracks, actions, selectedPlaylist?.name]
  )

  /* 错峰入场延迟：快速档清零整块同升（复用全局 .mount-rise，不新造 keyframes） */
  const riseStyle = (ms: number) => (fastMode ? undefined : { animationDelay: `${ms}ms` })

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
            <TrackRow
              key={`${track.id}-${index}`}
              className="mount-rise"
              style={riseStyle(150 + Math.min(index, 10) * 24)}
              onClick={() => playFrom(index)}
            >
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
          <Watermark key={`wm-${watermarkYear}`} aria-hidden="true" className="mount-rise">
            {watermarkYear}
          </Watermark>
          {/* 换幕层 2：按卷身份重挂，子级错峰入场重播（先例 weread/guestbook）；
              key 加前缀避免与水印年份 key 撞车（同父兄弟 key 必须唯一） */}
          <ContentInner key={`vol-${selectedPlaylist.playlistId}`}>
            <PanelHead className="mount-rise">
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
                <PanelTitle>{panelTitle}</PanelTitle>
                <PanelSub>
                  {loading ? (
                    /* 取数期间曲目数/年份未知：面板副题也走骨架占位，不报旧卷数字 */
                    <>
                      <SkeletonBar $h={10} $w="64px" />
                    </>
                  ) : (
                    <>
                      {t('music.page.panelSubCount', { count: tracks.length })}
                      {selectedYear ? t('music.page.panelYearSuffix', { year: selectedYear }) : ''}
                      {loadError ? t('music.page.panelErrorSuffix') : ''}
                    </>
                  )}
                </PanelSub>
              </PanelCopy>
            </PanelHead>

            {/* 取数期间：面板头（碟面 + 卷名）先显目标卷保持不变；
                描述/标签/按语/曲目列表都属旧卷内容，收进骨架边界一起换成占位 */}
            {loading ? (
              <>
                {/* 描述占位：与真实 Intro 同语言（一条正文宽度的淡条），下间距对齐描述文本 */}
                <IntroSkeleton className="mount-rise">
                  <SkeletonBar $h={13} $w="56%" />
                </IntroSkeleton>
                <TrackList className="is-sweeping" aria-busy="true">
                  <SkeletonStatus role="status">{t('music.page.tracksLoading')}</SkeletonStatus>
                  {Array.from({ length: 8 }, (_, index) => (
                    <SkeletonRow key={index} aria-hidden="true">
                      <SkeletonIndex $h={12} />
                      <SkeletonMain $h={13} $w={`${82 - (index % 3) * 16}%`} />
                      <SkeletonSide>
                        <SkeletonBar $h={11} $w="24px" />
                        <SkeletonBar $h={11} $w="34px" />
                      </SkeletonSide>
                    </SkeletonRow>
                  ))}
                </TrackList>
              </>
            ) : (
              <>
                {selectedPlaylist.description ? (
                  <Intro className="mount-rise" style={riseStyle(60)}>
                    {selectedPlaylist.description}
                  </Intro>
                ) : null}
                {selectedPlaylist.tags?.length ? (
                  <IntroTags className="mount-rise" style={riseStyle(90)}>
                    {selectedPlaylist.tags.map((tag) => (
                      <TagChip key={tag}>{tag}</TagChip>
                    ))}
                  </IntroTags>
                ) : null}
                {favTrack ? (
                  <Epigraph className="mount-rise" style={riseStyle(120)}>
                    {t('music.page.epigraphPrefix')}
                    <span className="em">{favTrack.name}</span>
                    {t('music.page.epigraphSuffix', { count: favTrack.playCount ?? 0 })}
                  </Epigraph>
                ) : null}

                {tracks.length ? (
                  renderTracks(tracks)
                ) : (
                  <TracksEmpty role="status" className="mount-rise" style={riseStyle(150)}>
                    {loadError ? t('music.page.volumeError') : t('music.page.noTracks')}
                  </TracksEmpty>
                )}
              </>
            )}
          </ContentInner>
        </Content>
      </Chronicle>
    </Section>
  )
}
