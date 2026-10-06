'use client'

/**
 * 全站「一页书」光标跟随层（决策 D2）：
 * CSS cursor 无法动画 → pointer:fine ∧ no-reduced-motion 环境下隐藏系统光标，
 * 由本组件以单一 rAF + translate3d 合成器层实时跟手；六态经 closest 委托按角色切换，
 * 静止 ≥5s 进入 idle 自读书（整页翻），一动立即收回（D7）。
 * 环境不满足时本组件不挂载任何动效——静态帧（CursorStyles ① 降级链）顶替，触控零影响。
 */
import { useEffect, useRef } from 'react'
import BookCursor from './book'
import { CursorStyles } from './style'
import { HOT } from './tints'

const STATE_SELECTOR = 'a[href],button,[role=button],input,textarea,[contenteditable=true],[data-cursor=wait],[data-cursor=grab]'
const IDLE_DELAY = 5000

export default function CursorLayer() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const noReduce = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (!fine || !noReduce) return

    const layer = layerRef.current
    if (!layer) return

    document.documentElement.classList.add('bk-cursor-active')
    let tx = -50
    let ty = -50
    let raf = 0
    let idleTimer = 0

    const place = () => {
      // 热点 = 锚 (4,4)：位移使 (4,4) 落在真实指针位，书形自画布 (6,6) 起绘 → 右下明显错开（R4）
      layer.style.transform = `translate3d(${tx - HOT[0]}px,${ty - HOT[1]}px,0)`
      raf = 0
    }

    const stateFor = (target: EventTarget | null, buttons: number) => {
      const el = target instanceof Element ? target.closest(STATE_SELECTOR) : null
      if (!el) return 'default'
      if (el.matches('input,textarea,[contenteditable=true]')) return 'text'
      if (el.matches('[data-cursor=wait]')) return 'wait'
      if (el.matches('[data-cursor=grab]')) return buttons > 0 ? 'grabbing' : 'grab'
      return 'pointer'
    }

    const armIdle = () => {
      layer.classList.remove('idle')
      idleTimer = window.setTimeout(() => layer.classList.add('idle'), IDLE_DELAY)
    }

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      const st = stateFor(e.target, e.buttons)
      if (layer.dataset.state !== st) layer.dataset.state = st
      layer.classList.add('on')
      if (!raf) raf = requestAnimationFrame(place)
      armIdle()
    }
    const onDown = (e: PointerEvent) => {
      layer.classList.remove('popping')
      void layer.offsetWidth
      layer.classList.add('popping')
      if (layer.dataset.state === 'grab') layer.dataset.state = 'grabbing'
    }
    const onUp = () => {
      if (layer.dataset.state === 'grabbing') layer.dataset.state = 'grab'
    }
    const onLeave = () => {
      layer.classList.remove('on', 'idle', 'popping')
      layer.dataset.state = 'default'
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.clearTimeout(idleTimer)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('bk-cursor-active')
    }
  }, [])

  return (
    <>
      <CursorStyles />
      <div ref={layerRef} className='bk-cursor on' data-state='default' aria-hidden='true'>
        <BookCursor />
      </div>
    </>
  )
}
