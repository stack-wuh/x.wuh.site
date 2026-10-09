'use client'

/**
 * 全站「一页书」光标跟随层（决策 D2；跟随引擎 v2 = framer-motion 弹簧随动）：
 * CSS cursor 无法动画 → pointer:fine ∧ no-reduced-motion 环境下隐藏系统光标，
 * 由本组件以 useMotionValue/useSpring 驱动合成器层随动（framer 统一帧调度写 transform、静止自动停写），
 * 六态经 closest 委托按角色切换，静止 ≥5s 进入 idle 自读书（整页翻），一动立即收回（D7）。
 * 延迟接管（D1）：指针未动时浏览器无任何 API 可读指针位置，故首个 pointermove 之前系统箭头保持可见；
 * 首跳将源值与弹簧 jump 落位再隐藏系统光标——刷新后不再钉在左上角，leave 后重入同样 jump 落位。
 * 墨晕层（ink）：指 = 笔尖，onMove/onDown 同时喂 InkField——位移节流沿轨迹生出连续重叠的柔边墨晕（bleed）、
 * 点击落笔一晕（splash）加三圈同心水波（wave 错峰 0/140/280ms）；池复用零 DOM 增删、
 * 零 React 渲染、零新监听器、零定时器；接管与 leave 时同步显隐与重锚，接管落点补一记起笔晕（first）让轨迹有起头。
 * 环境不满足时本组件不挂载任何动效——静态帧（CursorStyles ① 降级链）顶替，触控零影响。
 */
import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import BookCursor from './book'
import { CursorStyles } from './style'
import { HOT } from './tints'
import { INK_POOL, InkField } from './ink'

const STATE_SELECTOR = 'a[href],button,[role=button],input,textarea,[contenteditable=true],[data-cursor=wait],[data-cursor=grab]'
const IDLE_DELAY = 5000

// D3 弹簧参数：高刚度低阻尼——目标延迟 ≤2 帧，只抹平指针事件采样与帧率的错位，不引入「拖尾」观感
const SPRING = { stiffness: 1000, damping: 60, mass: 0.5 }

export default function CursorLayer() {
  const layerRef = useRef<HTMLDivElement>(null)
  const inkRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(-50)
  const y = useMotionValue(-50)
  const sx = useSpring(x, SPRING)
  const sy = useSpring(y, SPRING)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const noReduce = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (!fine || !noReduce) return

    const layer = layerRef.current
    if (!layer) return

    const inkHost = inkRef.current
    if (!inkHost) return
    const field = new InkField(inkHost)

    let idleTimer = 0
    // D1 接管标记：首次 pointermove 前不隐藏系统光标；pointerleave 后重置，重入重新 jump 落位
    let taken = false

    // 热点 = 锚 (4,4)：位移使 (4,4) 落在真实指针位，书形自画布 (6,6) 起绘 → 右下明显错开（R4）
    const takeover = (cx: number, cy: number) => {
      const dx = cx - HOT[0]
      const dy = cy - HOT[1]
      x.jump(dx, true)
      y.jump(dy, true)
      sx.jump(dx, true)
      sy.jump(dy, true)
      layer.classList.add('on')
      document.documentElement.classList.add('bk-cursor-active')
      taken = true
      inkHost.classList.add('on')
      field.reset()
      field.first(cx, cy)
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
      // D2 旧定时器必须先清：连续移动时逐帧积压的 setTimeout 会过 5s 后逐帧闪现 idle 整页翻（卡顿主因）
      window.clearTimeout(idleTimer)
      layer.classList.remove('idle')
      idleTimer = window.setTimeout(() => layer.classList.add('idle'), IDLE_DELAY)
    }

    const onMove = (e: PointerEvent) => {
      if (taken) {
        x.set(e.clientX - HOT[0])
        y.set(e.clientY - HOT[1])
      } else {
        takeover(e.clientX, e.clientY)
      }
      field.move(e.clientX, e.clientY, e.timeStamp)
      const st = stateFor(e.target, e.buttons)
      if (layer.dataset.state !== st) layer.dataset.state = st
      armIdle()
    }
    const onDown = (e: PointerEvent) => {
      layer.classList.remove('popping')
      void layer.offsetWidth
      layer.classList.add('popping')
      field.tap(e.clientX, e.clientY)
      if (layer.dataset.state === 'grab') layer.dataset.state = 'grabbing'
    }
    const onUp = () => {
      if (layer.dataset.state === 'grabbing') layer.dataset.state = 'grab'
    }
    const onLeave = () => {
      layer.classList.remove('on', 'idle', 'popping')
      layer.dataset.state = 'default'
      taken = false
      inkHost.classList.remove('on')
      field.reset()
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
      document.documentElement.classList.remove('bk-cursor-active')
    }
  }, [x, y, sx, sy])

  return (
    <>
      <CursorStyles />
      <div ref={inkRef} className='bk-ink' aria-hidden='true'>
        {Array.from({ length: INK_POOL }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <motion.div
        ref={layerRef}
        className='bk-cursor'
        data-state='default'
        aria-hidden='true'
        style={{ x: sx, y: sy }}
      >
        <BookCursor />
      </motion.div>
    </>
  )
}
