'use client'

/* 音量：钮群右端图标钮 + 上弹竖向樂印滑杆小纸卡——外点收起/指针拖拽/键盘步进内聚（20261005 自 PlayerPanel.tsx 拆出；
   volOpen 开合态仍由面板持有，Escape 分层不变） */
import React, { useEffect, useRef } from 'react'
import { IconVolume } from '@wuh.site/components/icons'
import { VolumeButton, VolumePop, VolWrap, VolumePct, VFill, VSlider, VThumb } from './styles/dock'

interface PanelVolumeProps {
  volume: number
  volOpen: boolean
  label: string
  onToggle: () => void
  /** 稳定的 setState 引用——外点收起 effect 依赖须与原 [volOpen] 同形（每次 render 新箭头会反复重挂 listener） */
  setVolOpen: (open: boolean) => void
  setVolume: (volume: number) => void
}

export const PanelVolume = ({ volume, volOpen, label, onToggle, setVolOpen, setVolume }: PanelVolumeProps) => {
  const volWrapRef = useRef<HTMLSpanElement | null>(null)
  const volumePct = Math.round(volume * 100)

  // 外点收起：开态监听 pointerdown，包裹层外点击即收
  useEffect(() => {
    if (!volOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (volWrapRef.current && !volWrapRef.current.contains(event.target as Node)) {
        setVolOpen(false)
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [volOpen, setVolOpen])

  // 竖向滑杆：指针拖拽 + 键盘步进（方向键/Home/End），语义同共享 Progress 的交互态
  const volumeFromPointer = (event: React.PointerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const pct = 1 - (event.clientY - rect.top) / rect.height
    setVolume(Math.min(1, Math.max(0, pct)))
  }

  const onVSliderKeyDown = (event: React.KeyboardEvent) => {
    const step = 0.05
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      setVolume(Math.min(1, volume + step))
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      setVolume(Math.max(0, volume - step))
    } else if (event.key === 'Home') {
      setVolume(0)
    } else if (event.key === 'End') {
      setVolume(1)
    } else {
      return
    }
    event.preventDefault()
  }

  return (
    <VolWrap ref={volWrapRef}>
      {volOpen ? (
        <VolumePop>
          {/* <VolumePopLabel>{label}</VolumePopLabel> */}
          <VSlider
            role='slider'
            tabIndex={0}
            aria-label={label}
            aria-orientation='vertical'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={volumePct}
            onKeyDown={onVSliderKeyDown}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              volumeFromPointer(event)
            }}
            onPointerMove={(event) => {
              if (event.buttons > 0) volumeFromPointer(event)
            }}
          >
            <VFill $fill={volume} />
            <VThumb $fill={volume} aria-hidden='true'>
              樂
            </VThumb>
          </VSlider>
          <VolumePct>{volumePct}</VolumePct>
        </VolumePop>
      ) : null}
      <VolumeButton type='button' aria-label={label} aria-haspopup='true' aria-expanded={volOpen} title={label} onClick={onToggle}>
        <IconVolume size={19} />
      </VolumeButton>
    </VolWrap>
  )
}
