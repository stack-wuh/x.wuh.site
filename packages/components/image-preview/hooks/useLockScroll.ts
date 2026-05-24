import * as React from 'react'

export const useLockScroll = (open: boolean, lockScroll: boolean) => {
  React.useEffect(() => {
    if (!open || !lockScroll || typeof document === 'undefined') return
    const original = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = original
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [open, lockScroll])
}
