'use client'

/* 队列区：遮罩 + 翻页屏 + 队列行（20261005 自 PlayerPanel.tsx 拆出）。
   抽屉定位 effect 留守主文件——drawerListRef 经 props 传入；
   QueueRows 供桌面翻页屏与移动目次页共用（渲染零差异）。
   queueOpen/foldLatch 沿原标识符命名（守卫切片锚点语义）；行内样式驱动不变（显隐纪律） */
import React from 'react'
import { useLocale } from '@wuh.site/components/locales'
import { IconListMusic, IconPlay } from '@wuh.site/components/icons'
import { formatDuration } from '../utils'
import type { Track } from '../specs'
import { FOLD_LIFT_SHADOW } from './styles/tokens'
import {
  DrawerScrim,
  QScreen,
  QZone,
  QueueArtist,
  QueueButton,
  QueueItem,
  QueueList,
  QueueMeta,
  QueueName,
  QueueNo,
  SectionHeading
} from './styles/queue'

interface QueueRowsProps {
  queue: Track[]
  currentTrack?: Track | null
  playTrack: (trackId: number) => void
}

export const QueueRows = ({ queue, currentTrack, playTrack }: QueueRowsProps) => (
  <>
    {queue.map((track, index) => (
      <QueueItem
        key={track.id}
        data-active={track.id === currentTrack?.id}
        style={{ '--q-active': track.id === currentTrack?.id ? 1 : 0 } as React.CSSProperties}
      >
        <QueueButton type='button' onClick={() => playTrack(track.id)}>
          <QueueNo>
            <span className='q-no-face'>{String(index + 1).padStart(2, '0')}</span>
            <span className='q-no-play' aria-hidden='true'>
              <IconPlay size={10} />
            </span>
          </QueueNo>
          <QueueName title={track.name}>{track.name}</QueueName>
          <QueueMeta>
            <QueueArtist title={track.artist}>{track.artist}</QueueArtist>
            <span>{formatDuration(track.duration ?? 0)}</span>
          </QueueMeta>
        </QueueButton>
      </QueueItem>
    ))}
  </>
)

interface PanelQueueProps {
  queue: Track[]
  currentTrack?: Track | null
  /** pinned（列表钮 aria-expanded） */
  queueOpen: boolean
  /** 粘性开合锁存（指针在面板内漫游不收拢，离板才折回） */
  foldLatch: boolean
  drawerListRef: React.RefObject<HTMLUListElement | null>
  setQueueOpen: (open: boolean) => void
  setFoldLatch: (latch: boolean) => void
  playTrack: (trackId: number) => void
}

export const PanelQueue = ({ queue, currentTrack, queueOpen, foldLatch, drawerListRef, setQueueOpen, setFoldLatch, playTrack }: PanelQueueProps) => {
  const { t } = useLocale()
  return (
    <>
      <DrawerScrim
        aria-hidden='true'
        tabIndex={-1}
        style={
          queueOpen
            ? ({ opacity: 1, pointerEvents: 'auto', visibility: 'visible', transitionDelay: '0s' } as React.CSSProperties)
            : undefined
        }
        onClick={() => setQueueOpen(false)}
      />
      <QZone onPointerEnter={() => setFoldLatch(true)}>
        <QScreen
          data-fold-screen='true'
          role='group'
          aria-label={t('player.panel.queueDrawer')}
          style={
            queueOpen || foldLatch
              ? ({
                  transform: 'rotateY(0deg)',
                  opacity: 1,
                  pointerEvents: 'auto',
                  boxShadow: FOLD_LIFT_SHADOW,
                } as React.CSSProperties)
              : undefined
          }
        >
          <SectionHeading>
            <IconListMusic size={13} aria-hidden='true' /> {t('player.panel.queue')}
          </SectionHeading>
          <QueueList ref={drawerListRef}>
            <QueueRows queue={queue} currentTrack={currentTrack} playTrack={playTrack} />
          </QueueList>
        </QScreen>
      </QZone>
    </>
  )
}
