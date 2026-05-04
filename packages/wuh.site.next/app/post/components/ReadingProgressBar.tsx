'use client'

import { useEffect, useRef } from 'react'

export default function ReadingProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let rafId = 0

    const update = () => {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0
      const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 0
      const clientHeight = doc.clientHeight || window.innerHeight || 0
      const total = scrollHeight - clientHeight
      const percent = total <= 0 ? 0 : Math.min(1, Math.max(0, scrollTop / total))

      bar.style.transform = `scaleX(${percent})`
      bar.style.opacity = percent < 0.01 || percent > 0.99 ? '0' : '1'
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        update()
      })
    }

    const initTimer = setTimeout(update, 100)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      clearTimeout(initTimer)
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'var(--primary-color)',
        boxShadow: '0 0 6px var(--primary-color)',
        zIndex: 9999,
        transformOrigin: 'left center',
        transform: 'scaleX(0)',
        opacity: 0,
        willChange: 'transform, opacity',
        transition: 'transform 0.12s ease-out, opacity 0.15s linear',
      }}
    />
  )
}
