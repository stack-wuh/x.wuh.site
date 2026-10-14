import { useEffect } from 'react'

export type ScrollLockMode = 'fixed' | 'simple'

export interface UseScrollLockOptions {
  /**
   * 锁配方选择（两种配方语义不同，不混用）：
   * - 'fixed'（默认）：body 四值暂存 + position:fixed + top:-scrollY + width:100%，
   *   cleanup 逐值还原后 scrollTo(0, scrollY)。遮罩下页面不可滚且不塌陷布局，兼顾 iOS 滚动穿透。
   * - 'simple'：documentElement.style.overflow 暂存/还原 + cleanup scrollTo(0, scrollY)。
   *   全屏覆盖层（无 body 布局位移需求）的轻量配方。
   */
  mode?: ScrollLockMode
}

// 弹层滚动锁统一入口：active=false 或非浏览器环境跳过，effect cleanup 必须与建立时对称还原。
// 高频开关场景由调用方传组合布尔（open && lockScroll），与「开态才锁」的条件挂载语义一致。
export const useScrollLock = (active: boolean, options: UseScrollLockOptions = {}): void => {
  const { mode = 'fixed' } = options

  useEffect(() => {
    if (!active || typeof document === 'undefined') return

    const scrollY = window.scrollY

    if (mode === 'simple') {
      const original = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
      return () => {
        document.documentElement.style.overflow = original
        window.scrollTo(0, scrollY)
      }
    }

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
  }, [active, mode])
}

export default useScrollLock
