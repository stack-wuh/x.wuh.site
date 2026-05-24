import * as React from 'react'

export const useLockScroll = (open: boolean, lockScroll: boolean) => {
  React.useEffect(() => {
    if (!open || !lockScroll || typeof document === 'undefined') return
    const scrollY = window.scrollY
    const original = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = original
      window.scrollTo(0, scrollY)
    }
  }, [open, lockScroll])
}
