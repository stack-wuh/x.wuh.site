import { useEffect, useRef, useState } from 'react'
import { keyframes } from 'styled-components'

/* 跑马灯共享基建（迷你条 + 面板题名/词卷题头三处同源，禁复制实现）：
   恒速换算时长（文本宽 + 间隔）/ 速度；首尾各留 10% 时长的停顿 */
export const MARQUEE_GAP_PX = 48
export const MARQUEE_SPEED_PX_PER_S = 30

/* 0→-50% 无缝循环：每份拷贝自带右侧间隔，平移半轨即回到视觉起点 */
export const marquee = keyframes`
  0%, 10% { transform: translateX(0); }
  90%, 100% { transform: translateX(-50%); }
`

/* 标题溢出测量：元素级 ResizeObserver（wrapper 视口宽 + ghost 自然宽），
   文本变化即重测；不引入全局 scroll/resize 监听器。
   泛型挂载点：量尺只读 offsetWidth/clientWidth，span/h2/h3 等任一元素 ref 皆可挂 */
export const useMarqueeOverflow = <T extends HTMLElement = HTMLElement>(text: string) => {
  const wrapperRef = useRef<T | null>(null)
  const ghostRef = useRef<T | null>(null)
  const [metrics, setMetrics] = useState({ text: 0, visible: 0 })

  useEffect(() => {
    const wrapper = wrapperRef.current
    const ghost = ghostRef.current
    if (!wrapper || !ghost || typeof ResizeObserver === 'undefined') return

    const measure = () => {
      setMetrics((prev) => {
        const next = { text: ghost.offsetWidth, visible: wrapper.clientWidth }
        return prev.text === next.text && prev.visible === next.visible ? prev : next
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrapper)
    observer.observe(ghost)
    return () => observer.disconnect()
  }, [text])

  return { wrapperRef, ghostRef, metrics }
}
