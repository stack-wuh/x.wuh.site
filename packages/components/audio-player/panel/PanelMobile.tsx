'use client'

/* 移动端册页：下滑手柄 + 横翻对页（词页/目次）+ 页缘翻页钮（20261005 自 PlayerPanel.tsx 拆出）。
   mobilePage 态、翻页/拖拽关闭手势、词窗跟随与移动队列定位随迁本组件——面板关闭不卸载，态跨开合持续，
   与拆分前一致；拖拽位移（dragY）驱动面板壳 transform，态仍由主文件持有，手柄经 props 接线 */
import React, { useEffect, useRef, useState } from 'react'
import { useLocale } from '@wuh.site/components/locales'
import type { LyricLine } from '../utils'
import type { Track } from '../types'
import { QueueRows } from './PanelQueue'
import { INK_STATIONS } from './styles/ghost'
import {
  GrabHandle,
  InkCol,
  InkLayer,
  LeafArtist,
  LeafPage,
  LeafPages,
  LeafPlate,
  LeafPlateArt,
  LeafTitle,
  PageTick,
  PageTicks,
  PlateNo,
  WordBloom,
  WordEmpty,
  WordLine,
  WordWindow
} from './styles/mobile'
import { QueueList, SectionHeading } from './styles/queue'

interface PanelMobileProps {
  lyrics: LyricLine[]
  activeLyric: number
  stageName: string
  artist: string
  coverUrl?: string
  queue: Track[]
  currentTrack?: Track | null
  currentIndex: number
  queueLength: number
  isPanelOpen: boolean
  seek: (seconds: number) => void
  playTrack: (trackId: number) => void
  /** 真实播放态（目次 QueueRows 等化器暂停停走用） */
  playing: boolean
  /** 播放进度（秒）——墨柱生命期时钟（暂停停走：progress 停走即冻结） */
  progress: number
  onDragStart: (event: React.TouchEvent) => void
  onDragMove: (event: React.TouchEvent) => void
  onDragEnd: () => void
}

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const PanelMobile = ({
  lyrics,
  activeLyric,
  stageName,
  artist,
  coverUrl,
  queue,
  currentTrack,
  currentIndex,
  queueLength,
  isPanelOpen,
  seek,
  playTrack,
  playing,
  progress,
  onDragStart,
  onDragMove,
  onDragEnd
}: PanelMobileProps) => {
  const { t } = useLocale()
  const mobileLyricsRef = useRef<HTMLDivElement | null>(null)
  const mobileBloomRef = useRef<HTMLDivElement | null>(null)
  const mobileQueueRef = useRef<HTMLUListElement | null>(null)
  const pagesRef = useRef<HTMLDivElement | null>(null)
  const [mobilePage, setMobilePage] = useState<'words' | 'queue'>('words')

  // 词窗三态：加载中（缺曲/曲目未解析——streamUrl 与歌词同批落位）→「全体欣赏音乐」；
  // 解析毕无词 →「纯音乐 · 请欣赏」；有词 → 正常渲染
  const wordPhase: 'loading' | 'pure' | 'lines' =
    !currentTrack || !currentTrack.streamUrl ? 'loading' : lyrics.length ? 'lines' : 'pure'

  // 墨柱生命期时钟：句 tenure = 当前行 time → 下一行 time；progress 停走即冻结（暂停停走纪律）
  const inkIdx = activeLyric >= 0 ? activeLyric : 0
  const inkStart = lyrics[inkIdx]?.time ?? 0
  const inkEnd = lyrics[inkIdx + 1]?.time ?? inkStart + 8
  const inkFrac = Math.min(Math.max((progress - inkStart) / Math.max(inkEnd - inkStart, 0.001), 0), 1)

  // 站 0 生命期样式：入墨(0–25%) 晕开锐化 → 定影(25–72%) 墨迹缓洇 → 化墨(72–100%) 烟散上浮；
  // 只写背景墨柱（前景歌词零动画）
  const inkLifeStyle = (frac: number): React.CSSProperties => {
    let o: number, s: number, b: number, ty: number
    if (frac < 0.25) {
      const t = frac / 0.25
      o = 0.04 + t * 0.14; s = 0.72 + t * 0.28; b = 6 * (1 - t); ty = 0
    } else if (frac < 0.72) {
      const t = (frac - 0.25) / 0.47
      o = 0.18 - t * 0.03; s = 1 + t * 0.05; b = 0; ty = 0
    } else {
      const t = (frac - 0.72) / 0.28
      o = 0.15 * (1 - t); s = 1.05 + t * 0.05; b = 10 * t; ty = -10 * t
    }
    return {
      opacity: o.toFixed(3),
      transform: `translateY(-50%) scale(${s.toFixed(3)}) translateY(${ty.toFixed(1)}px)`,
      filter: `blur(${b.toFixed(1)}px)`,
    }
  }

  // 拖拽关闭：手柄与图版是拖拽面（位移态在主文件 dragY，驱动面板壳 transform），松手过阈值关闭、否则回弹
  const dragHandlers = {
    onTouchStart: onDragStart,
    onTouchMove: onDragMove,
    onTouchEnd: onDragEnd,
  }

  // 册页横翻：swipe 由 scroll-snap 承担，onScroll 把页缘钮选中态同步回来
  const handlePagesScroll = () => {
    const el = pagesRef.current
    if (!el || !el.clientWidth) return
    const page = Math.round(el.scrollLeft / el.clientWidth) === 1 ? 'queue' : 'words'
    setMobilePage((prev) => (prev === page ? prev : page))
  }

  const gotoPage = (page: 'words' | 'queue') => {
    setMobilePage(page)
    const el = pagesRef.current
    if (!el) return
    el.scrollTo({ left: page === 'queue' ? el.clientWidth : 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // 移动词窗跟随：手动垂直 scrollTop（定位纪律全文件禁原生滚动定位 API）；墨晕随当前句位移。
  // 桌面歌词定位由词卷跟随 effect 承担（同手册动滚动）
  useEffect(() => {
    if (!isPanelOpen) return
    if (activeLyric < 0) {
      mobileBloomRef.current?.classList.remove('on')
      return
    }
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    const mContainer = mobileLyricsRef.current
    const mEl = mContainer?.querySelector<HTMLElement>(`[data-lyric-index="${activeLyric}"]`)
    if (mEl && mContainer) {
      mContainer.scrollTo({
        top: mEl.offsetTop - mContainer.clientHeight / 2 + mEl.clientHeight / 2,
        behavior,
      })
      if (mobileBloomRef.current) {
        mobileBloomRef.current.style.transform = `translateY(${mEl.offsetTop - 10}px)`
        mobileBloomRef.current.classList.add('on')
      }
    }
  }, [activeLyric, isPanelOpen])

  // 播放列表定位到当前曲（移动目次页）：手动 scrollTop 居中。抽屉（桌面）定位留守主文件——
  // 原单 effect 双列表重定位互不可见，按依赖拆分等价（brief 决策）
  useEffect(() => {
    if (!isPanelOpen) return
    const mList = mobileQueueRef.current
    const mItem = mList?.querySelector<HTMLLIElement>('[data-active="true"]')
    if (mList && mItem) {
      mList.scrollTop = Math.max(0, mItem.offsetTop - mList.clientHeight / 2 + mItem.clientHeight / 2)
    }
  }, [isPanelOpen, currentIndex, mobilePage])

  return (
    <>
      {/* 下滑关闭手柄：拖拽跟手，松手过阈值关闭、否则回弹（reduced-motion 由面板级降级压制过渡） */}
      <GrabHandle aria-hidden='true' data-testid='panel-grab-handle' {...dragHandlers} />
      <LeafPages ref={pagesRef} onScroll={handlePagesScroll} aria-label={t('player.panel.pagesAria')}>
        <LeafPage aria-label={t('player.panel.wordsPage')} aria-hidden={mobilePage !== 'words'} inert={mobilePage !== 'words'}>
          <LeafPlate data-testid='panel-plate' {...dragHandlers}>
            <LeafPlateArt $src={coverUrl} aria-hidden='true' />
            <PlateNo>
              {t('player.panel.plateNo', {
                index: String((currentIndex ?? 0) + 1).padStart(2, '0'),
                total: String(queueLength).padStart(2, '0'),
              })}
            </PlateNo>
          </LeafPlate>
          <LeafTitle title={stageName}>{stageName}</LeafTitle>
          <LeafArtist title={artist}>{artist}</LeafArtist>
          <WordWindow ref={mobileLyricsRef}>
            {/* 移动墨柱：只在有词态铺底（无词自动隐去）；生命期写行内样式，前景歌词零动画 */}
            {wordPhase === 'lines' && (
              <InkLayer aria-hidden='true'>
                {INK_STATIONS.map((station, k) => {
                  const lineIdx = Math.max(inkIdx - k, 0)
                  const line = lyrics[lineIdx]
                  if (!line) return null
                  return (
                    <InkCol
                      key={`${k}-${lineIdx}`}
                      style={
                        {
                          '--ink-gx': station.gx,
                          '--ink-gs': station.gs,
                          '--ink-go': station.go,
                          ...(k === 0 ? inkLifeStyle(inkFrac) : {}),
                        } as React.CSSProperties
                      }
                    >
                      {line.text}
                    </InkCol>
                  )
                })}
              </InkLayer>
            )}
            <WordBloom ref={mobileBloomRef} aria-hidden='true' />
            {wordPhase === 'lines' ? (
              lyrics.map((line, index) => (
                <WordLine
                  key={`${line.time}-${index}`}
                  type='button'
                  data-lyric-index={index}
                  $active={index === activeLyric}
                  $near={Math.abs(index - activeLyric) === 1}
                  onClick={() => seek(line.time)}
                >
                  {line.text}
                </WordLine>
              ))
            ) : (
              /* 加载中/纯音乐共用印框：key 换态/换曲重挂载重钤（钤印进场动画） */
              <WordEmpty key={`${wordPhase}-${currentTrack?.id ?? 'idle'}`}>
                <span>{t(wordPhase === 'pure' ? 'player.panel.pureMusic' : 'player.panel.wordEmpty')}</span>
              </WordEmpty>
            )}
          </WordWindow>
        </LeafPage>
        <LeafPage aria-label={t('player.panel.queuePage')} aria-hidden={mobilePage !== 'queue'} inert={mobilePage !== 'queue'}>
          <SectionHeading>{t('player.panel.queueHeadingMobile')}</SectionHeading>
          <QueueList ref={mobileQueueRef}>
            <QueueRows queue={queue} currentTrack={currentTrack} playTrack={playTrack} playing={playing} />
          </QueueList>
        </LeafPage>
      </LeafPages>

      {/* 页缘翻页钮：swipe 的键盘/读屏等价路径；点号激活走行内自定义属性（显隐纪律） */}
      <PageTicks role='group' aria-label={t('player.panel.ticksAria')}>
        <PageTick
          type='button'
          style={
            mobilePage === 'words'
              ? ({
                  '--tick-line': 'var(--primary-color)',
                  '--tick-halo': 'color-mix(in oklab, var(--primary-color) 45%, transparent)',
                  '--tick-ring': 'transparent',
                  '--tick-dim': 1,
                } as React.CSSProperties)
              : undefined
          }
          aria-current={mobilePage === 'words' ? 'true' : undefined}
          aria-label={t('player.panel.wordsPage')}
          onClick={() => gotoPage('words')}
        />
        <PageTick
          type='button'
          style={
            mobilePage === 'queue'
              ? ({
                  '--tick-line': 'var(--primary-color)',
                  '--tick-halo': 'color-mix(in oklab, var(--primary-color) 45%, transparent)',
                  '--tick-ring': 'transparent',
                  '--tick-dim': 1,
                } as React.CSSProperties)
              : undefined
          }
          aria-current={mobilePage === 'queue' ? 'true' : undefined}
          aria-label={t('player.panel.queuePage')}
          onClick={() => gotoPage('queue')}
        />
      </PageTicks>
    </>
  )
}
