'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from './useToc'

/**
 * 使用 IntersectionObserver 监听标题可见性，返回当前活跃标题 ID
 */
export function useHeadingObserver(toc: TocItem[]) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!toc.length) return

    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0))
        const first = visible[0]?.target as HTMLElement | undefined
        if (first?.id) setActiveId(first.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: [0.01, 0.1] }
    )

    headings.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [toc])

  return activeId
}
