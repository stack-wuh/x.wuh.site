'use client'

import { useEffect, useState } from 'react'

/**
 * 监听页面滚动百分比（0-100）
 */
export function useScrollProgress() {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let rafId = 0

    const update = () => {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0
      const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 0
      const clientHeight = doc.clientHeight || window.innerHeight || 0
      const total = scrollHeight - clientHeight
      setPercent(total <= 0 ? 100 : Math.min(100, Math.max(0, Math.round((scrollTop / total) * 100))))
    }

    const handleScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        update()
      })
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return percent
}
