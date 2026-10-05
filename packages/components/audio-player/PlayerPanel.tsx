'use client'

/* 播放面板组合入口：状态 / effects / Escape 分层 / 滚动锁 + JSX 骨架——样式按区块拆至 panel/styles/*（20261005 拆分） */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAudioPlayer } from './provider'
import { findActiveLyricIndex, formatDuration, parseLyrics } from './utils'
import { useLocale } from '@wuh.site/components/locales'
import Progress from '@wuh.site/components/progress'
import { MARQUEE_GAP_PX, MARQUEE_SPEED_PX_PER_S, useMarqueeOverflow } from './useMarquee'
import {
  IconListMusic,
  IconPause,
  IconPlay,
  IconRepeat,
  IconRepeatOne,
  IconShuffle,
  IconSkipBack,
  IconSkipForward,
  IconX
} from '@wuh.site/components/icons'
import type { PlayerMode } from './specs'
import { GHOST_STATIONS } from './panel/styles/tokens'
import { Backdrop, CloseButton, DrawerButton, Panel, PaperVeil, TopTools, WashSrc, WordsToggle } from './panel/styles/shell'
import { GhostLayer, GhostLine } from './panel/styles/ghost'
import {
  DiscDot,
  DiscLabel,
  Epigraph,
  EpiRow,
  NowStage,
  Plate,
  PlateArt,
  PlateWrap,
  StageArtist,
  StageCopy,
  StageGhost,
  StageGlow,
  StageTab,
  StageTitle,
  StageTrack
} from './panel/styles/stage'
import { ControlRow, ModeButton, NowDock, PlayButton, ProgressRow, SkipButton, TimeCode } from './panel/styles/dock'
import { WordsArtist, WordsHead, WordsHeadArt, WordsHeadPlate, WordsLine, WordsTitle, WordsVerse, WordsView } from './panel/styles/words'
import { PanelVolume } from './panel/PanelVolume'
import { PanelQueue } from './panel/PanelQueue'
import { PanelMobile } from './panel/PanelMobile'

const MODE_CYCLE: PlayerMode[] = ['order', 'repeat-one', 'shuffle']

const MODE_LABEL_KEYS: Record<PlayerMode, string> = {
  order: 'player.panel.modeOrder',
  'repeat-one': 'player.panel.modeRepeatOne',
  shuffle: 'player.panel.modeShuffle'
}

const MODE_ICONS: Record<PlayerMode, typeof IconRepeat> = {
  order: IconRepeat,
  'repeat-one': IconRepeatOne,
  shuffle: IconShuffle
}

export const AudioPlayerPanel = () => {
  const { t } = useLocale()
  const {
    currentTrack,
    queue,
    state,
    actions: { togglePanel, playNext, playPrevious, togglePlay, seek, setVolume, setMode, playTrack }
  } = useAudioPlayer()
  const drawerListRef = useRef<HTMLUListElement | null>(null)
  const wordsVerseRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const dragStartYRef = useRef<number | null>(null)
  const dragYRef = useRef(0)
  const [dragY, setDragY] = useState<number | null>(null)
  const [wordsOpen, setWordsOpen] = useState(false)
  const [queueOpen, setQueueOpen] = useState(false)
  const [volOpen, setVolOpen] = useState(false)
  // 粘性开合（20261005 边界修订）：进入右缘 340px 列表栏即锁存「开」，移出该栏即折回（解除点在 PanelQueue 的 QZone）。
  // React 态 → 视觉走行内样式（显隐纪律）；与 queueOpen（pinned）并集驱动 QScreen
  const [foldLatch, setFoldLatch] = useState(false)
  const totalDuration = Math.max(state.duration || currentTrack?.duration || 0, 0.01)
  const progressPct = (Math.min(state.progress, totalDuration) / totalDuration) * 100

  const lyrics = useMemo(() => parseLyrics(currentTrack?.lyrics), [currentTrack?.lyrics])
  const activeLyric = useMemo(() => findActiveLyricIndex(lyrics, state.progress), [lyrics, state.progress])
  const playing = state.status === 'playing'
  // 无词/前奏期（activeLyric<0）回落到首句，题跋与墨痕始终有可渲染行
  const lyricIdx = activeLyric >= 0 ? activeLyric : 0
  const epiPrev = lyrics[lyricIdx - 1]
  const epiAct = lyrics[lyricIdx]
  const epiNext = lyrics[lyricIdx + 1]
  const stageName = currentTrack?.name ?? t('player.panel.waiting')
  // 显式泛型：wrapperRef 挂在 styled.h2 上，Ref<HTMLElement> 装不进 Ref<HTMLHeadingElement>（域类型守卫存量错误就地修复）
  const stageTitle = useMarqueeOverflow<HTMLHeadingElement>(stageName)
  const titleMarquee = stageTitle.metrics.visible > 0 && stageTitle.metrics.text > stageTitle.metrics.visible
  const titleDuration = `${(stageTitle.metrics.text + MARQUEE_GAP_PX) / MARQUEE_SPEED_PX_PER_S}s`
  const ModeIcon = MODE_ICONS[state.mode]
  // 最爱印：本卷播放次数最高曲目播放时进度印换「愛」——口径与 /music 最爱徽标同源（含并列）
  const favorite = useMemo(() => {
    const maxPlays = queue.reduce((max, track) => Math.max(max, track.playCount ?? 0), 0)
    return maxPlays > 0 && currentTrack?.playCount === maxPlays
  }, [queue, currentTrack])

  const prefersReducedMotion = () =>
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 弹层交互：打开时焦点移入关闭钮，Escape 按层收起（popover → 抽屉 → 词卷 → 面板），关闭后焦点移回
  useEffect(() => {
    if (!state.isPanelOpen) return
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (volOpen) {
        setVolOpen(false)
      } else if (queueOpen) {
        setQueueOpen(false)
      } else if (wordsOpen) {
        setWordsOpen(false)
      } else {
        togglePanel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      restoreFocusRef.current?.focus?.()
      restoreFocusRef.current = null
    }
  }, [state.isPanelOpen, volOpen, queueOpen, wordsOpen, togglePanel])

  // 面板关闭时复位桌面覆盖层状态
  useEffect(() => {
    if (state.isPanelOpen) return
    setWordsOpen(false)
    setQueueOpen(false)
    setVolOpen(false)
    setFoldLatch(false)
  }, [state.isPanelOpen])

  // 弹层滚动锁：面板打开期间锁 body 滚动（复用 Dialog 的 lockScroll 配方，position:fixed 兼顾 iOS），关闭还原滚动位置
  useEffect(() => {
    if (!state.isPanelOpen || typeof document === 'undefined') return
    const scrollY = window.scrollY
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = originalWidth
      window.scrollTo(0, scrollY)
    }
  }, [state.isPanelOpen])

  // 播放列表定位到当前曲（抽屉）：手动 scrollTop。定位一律手动只滚目标容器，禁用原生滚动定位 API
  // （scroll-into-view 类）——它沿祖先链滚动所有可滚容器：桌面会连带滚走 overflow 壳的面板
  // （生产实证眉标被裁、底边露晕染色带）。抽屉 nearest 语义：可见不动，越界才对齐；
  // 移动目次页定位随册页拆至 PanelMobile（原双列表重定位互不可见，按依赖拆分等价）
  useEffect(() => {
    if (!state.isPanelOpen) return
    const dList = drawerListRef.current
    const dItem = dList?.querySelector<HTMLLIElement>('[data-active="true"]')
    if (dList && dItem) {
      const itemTop = dItem.offsetTop
      const itemBottom = itemTop + dItem.offsetHeight
      if (itemTop < dList.scrollTop) {
        dList.scrollTop = itemTop
      } else if (itemBottom > dList.scrollTop + dList.clientHeight) {
        dList.scrollTop = itemBottom - dList.clientHeight
      }
    }
  }, [state.isPanelOpen, state.currentIndex, queueOpen])

  // 词卷跟随：当前句列滚到视口中部。手动 scrollTo 只滚词卷容器（面板壳 overflow: clip 后不是滚动容器，
  // 但定位纪律仍全文件禁原生滚动定位 API）；竖排 vertical-rl 的 scrollLeft 为负向域，
  // 按几何换算目标列居中；en 横排回退用同构的 top 公式
  useEffect(() => {
    if (!state.isPanelOpen || !wordsOpen) return
    const container = wordsVerseRef.current
    const el = container?.querySelector<HTMLElement>(`[data-words-index="${lyricIdx}"]`)
    if (!container || !el) return
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    const vertical = getComputedStyle(container).writingMode.startsWith('vertical')
    if (vertical) {
      container.scrollTo({
        left: container.clientWidth / 2 - el.offsetWidth / 2 - el.offsetLeft,
        top: 0,
        behavior,
      })
    } else {
      container.scrollTo({
        top: el.offsetTop - container.clientHeight / 2 + el.offsetHeight / 2,
        behavior,
      })
    }
  }, [state.isPanelOpen, wordsOpen, lyricIdx])

  // 下滑关闭：手柄与图版是拖拽面（册页在 PanelMobile，位移态留主文件——dragY 驱动面板壳 transform），
  // 跟手位移，松手过阈值关闭、否则回弹
  const onDragTouchStart = (event: React.TouchEvent) => {
    dragStartYRef.current = event.touches[0]?.clientY ?? null
  }

  const onDragTouchMove = (event: React.TouchEvent) => {
    const startY = dragStartYRef.current
    if (startY == null) return
    dragYRef.current = Math.max(0, (event.touches[0]?.clientY ?? startY) - startY)
    setDragY(dragYRef.current)
  }

  const onDragTouchEnd = () => {
    dragStartYRef.current = null
    if (dragYRef.current > 96) {
      togglePanel()
    }
    dragYRef.current = 0
    setDragY(null)
  }

  const cycleMode = () => {
    const next = MODE_CYCLE[(MODE_CYCLE.indexOf(state.mode) + 1) % MODE_CYCLE.length]
    setMode(next)
  }

  const wordsAvailable = lyrics.length > 0

  return (
    <>
      <Backdrop $visible={state.isPanelOpen} onClick={togglePanel} aria-hidden='true' />
      <Panel
        $visible={state.isPanelOpen}
        $drag={dragY}
        role='dialog'
        aria-modal='true'
        aria-label={t('player.panel.title')}
        aria-hidden={!state.isPanelOpen}
      >
        <WashSrc $src={currentTrack?.coverUrl} aria-hidden='true' />
        <PaperVeil aria-hidden='true' />

        {/* 墨痕歌词：竖排五列两翼（当前句+前四句站点化，GHOST_STATIONS 锚点常量），
            播放中且有词才上纸底；词卷展开时让位。纯装饰层 */}
        {playing && wordsAvailable && !wordsOpen ? (
          <GhostLayer aria-hidden='true'>
            {GHOST_STATIONS.map((station, ti) => {
              const lineIdx = lyricIdx - ti
              const text = lineIdx >= 0 ? lyrics[lineIdx]?.text : undefined
              if (!text) return null
              return (
                <GhostLine
                  key={`ghost-${station.x}-${lineIdx}`}
                  style={
                    {
                      '--ghost-x': station.x,
                      '--ghost-top': station.top,
                      '--ghost-max-h': station.maxH,
                      '--ghost-z': station.z,
                      '--ghost-ink': String(station.ink),
                      '--ghost-blur': station.blur,
                    } as React.CSSProperties
                  }
                >
                  {text}
                </GhostLine>
              )
            })}
          </GhostLayer>
        ) : null}

        <CloseButton ref={closeRef} type='button' aria-label={t('player.panel.close')} onClick={togglePanel} tabIndex={state.isPanelOpen ? 0 : -1}>
          <IconX size={20} />
        </CloseButton>

        <TopTools>
          <WordsToggle
            type='button'
            aria-pressed={wordsOpen}
            aria-label={t('player.panel.wordsToggle')}
            title={t('player.panel.wordsToggle')}
            style={
              wordsOpen
                ? ({
                    color: 'var(--primary-color)',
                    borderColor: 'color-mix(in oklab, var(--primary-color) 45%, transparent)',
                  } as React.CSSProperties)
                : undefined
            }
            onClick={() => {
              setQueueOpen(false)
              setVolOpen(false)
              setWordsOpen((prev) => !prev)
            }}
          >
            詞
          </WordsToggle>
          <DrawerButton
            type='button'
            aria-expanded={queueOpen}
            aria-label={t('player.panel.queueDrawer')}
            title={t('player.panel.queueDrawer')}
            onClick={() => {
              setWordsOpen(false)
              setVolOpen(false)
              setQueueOpen((prev) => !prev)
            }}
          >
            <IconListMusic size={18} />
          </DrawerButton>
        </TopTools>

        {/* 桌面舞台：装裱封面 + 题名手卷 + 界格笺题跋 */}
        <NowStage>
          <StageGlow aria-hidden='true' />
          <PlateWrap>
            <StageTab aria-hidden='true'>
              {t('player.panel.plateNo', {
                index: String((state.currentIndex ?? 0) + 1).padStart(2, '0'),
                total: String(queue.length).padStart(2, '0')
              })}
            </StageTab>
            <Plate>
              <PlateArt $playing={playing} aria-hidden='true'>
                <DiscLabel $src={currentTrack?.coverUrl} />
                <DiscDot />
              </PlateArt>
            </Plate>
          </PlateWrap>
          <StageTitle ref={stageTitle.wrapperRef} $marquee={titleMarquee} title={stageName}>
            <StageGhost ref={stageTitle.ghostRef} aria-hidden='true'>
              {stageName}
            </StageGhost>
            {titleMarquee ? (
              <StageTrack $playing={playing} $duration={titleDuration}>
                <StageCopy>{stageName}</StageCopy>
                <StageCopy aria-hidden='true'>{stageName}</StageCopy>
              </StageTrack>
            ) : (
              stageName
            )}
          </StageTitle>
          <StageArtist title={currentTrack?.artist ?? ''}>{currentTrack?.artist ?? ' '}</StageArtist>
          <Epigraph>
            {epiPrev ? <EpiRow>{epiPrev.text}</EpiRow> : null}
            {epiAct ? <EpiRow $act>{epiAct.text}</EpiRow> : <EpiRow>{t('player.panel.noLyrics')}</EpiRow>}
            {epiNext ? <EpiRow>{epiNext.text}</EpiRow> : null}
          </Epigraph>
        </NowStage>

        {/* dock：進度 + 单行钮群（桌面/移动共用） */}
        <NowDock>
          <ProgressRow>
            <TimeCode $now>{formatDuration(state.progress)}</TimeCode>
            {/* progressPct 已是 0–100 百分数，直传即可——二次 ×100 会被钳到 100、光标钉死末端（进度双重百分比教训） */}
            <Progress
              value={progressPct}
              onChange={(pct) => seek((pct / 100) * totalDuration)}
              thumb
              glyph={favorite ? '愛' : '樂'}
              breathing={playing}
              label={t('player.panel.progressLabel')}
            />
            <TimeCode>{formatDuration(totalDuration)}</TimeCode>
          </ProgressRow>

          <ControlRow>
            <ModeButton
              type='button'
              aria-label={t('player.panel.modeDialLabel', { mode: t(MODE_LABEL_KEYS[state.mode]) })}
              title={t('player.panel.modeDialLabel', { mode: t(MODE_LABEL_KEYS[state.mode]) })}
              onClick={cycleMode}
            >
              <ModeIcon size={19} />
            </ModeButton>
            <SkipButton type='button' aria-label={t('player.panel.previous')} onClick={playPrevious}>
              <IconSkipBack size={20} />
            </SkipButton>
            <PlayButton type='button' aria-label={playing ? t('player.panel.pause') : t('player.panel.play')} onClick={togglePlay}>
              {playing ? <IconPause size={24} /> : <IconPlay size={24} />}
            </PlayButton>
            <SkipButton type='button' aria-label={t('player.panel.next')} onClick={playNext}>
              <IconSkipForward size={20} />
            </SkipButton>
            <PanelVolume
              volume={state.volume}
              volOpen={volOpen}
              label={t('player.panel.volumeLabel')}
              onToggle={() => setVolOpen((prev) => !prev)}
              setVolOpen={setVolOpen}
              setVolume={setVolume}
            />
          </ControlRow>
        </NowDock>

        {/* 词卷展开态（桌面）：题头小装裱 + 竖排朱丝栏词卷；点行跳播 */}
        {wordsOpen ? (
          <WordsView>
            <WordsHead>
              <WordsHeadPlate>
                <WordsHeadArt $src={currentTrack?.coverUrl} aria-hidden='true' />
              </WordsHeadPlate>
              <div style={{ minWidth: 0 }}>
                <WordsTitle title={stageName}>{stageName}</WordsTitle>
                <WordsArtist>{currentTrack?.artist ?? ' '}</WordsArtist>
              </div>
            </WordsHead>
            <WordsVerse ref={wordsVerseRef}>
              {lyrics.map((line, index) => (
                <WordsLine
                  key={`${line.time}-${index}`}
                  data-words-index={index}
                  $act={index === lyricIdx}
                  onClick={() => seek(line.time)}
                >
                  {line.text}
                </WordsLine>
              ))}
            </WordsVerse>
          </WordsView>
        ) : null}

        {/* 队列翻页屏（桌面）：右缘热区内静止斜倚，hover/聚焦转正浮起可选曲；
            pinned 由 queueOpen 行内样式驱动（显隐纪律），遮罩仅 pinned 态呈现点击收回 */}
        <PanelQueue
          queue={queue}
          currentTrack={currentTrack}
          queueOpen={queueOpen}
          foldLatch={foldLatch}
          drawerListRef={drawerListRef}
          setQueueOpen={setQueueOpen}
          setFoldLatch={setFoldLatch}
          playTrack={playTrack}
        />

        {/* 移动端册页：词页（装裱图版 + 短词窗）横翻目次对页；页缘钮为键盘/读屏等价路径 */}
        <PanelMobile
          lyrics={lyrics}
          activeLyric={activeLyric}
          stageName={stageName}
          artist={currentTrack?.artist ?? ' '}
          coverUrl={currentTrack?.coverUrl}
          queue={queue}
          currentTrack={currentTrack}
          currentIndex={state.currentIndex ?? 0}
          queueLength={queue.length}
          isPanelOpen={state.isPanelOpen}
          seek={seek}
          playTrack={playTrack}
          onDragStart={onDragTouchStart}
          onDragMove={onDragTouchMove}
          onDragEnd={onDragTouchEnd}
        />
      </Panel>
    </>
  )
}
