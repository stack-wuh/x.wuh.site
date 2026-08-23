'use client'

import { useEffect } from 'react'

type FontPrefetchProps = {
  /** next/font 返回的 family 名（含 Fallback 引用），来自 localFont 实例 */
  sansFamily?: string
  serifFamily?: string
}

/**
 * 空闲时预热非首屏字重，减少渲染时的 FOUT 阻塞。
 */
export default function FontPrefetch({ sansFamily, serifFamily }: FontPrefetchProps) {
  useEffect(() => {
    if (!('fonts' in document)) return

    const firstFamily = (value?: string) => value?.split(',')[0].replace(/^["']|["']$/g, '')

    const warmUp = () => {
      const sans = firstFamily(sansFamily)
      const serif = firstFamily(serifFamily)
      const specs: string[] = []
      if (sans) specs.push(`700 16px ${sans}`)
      if (serif) specs.push(`400 16px ${serif}`, `700 16px ${serif}`)
      specs.forEach((spec) => {
        document.fonts.load(spec).catch(() => {})
      })
    }

    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(warmUp, { timeout: 3000 })
      return () => (window as any).cancelIdleCallback(id)
    }
    const timer = window.setTimeout(warmUp, 3000)
    return () => window.clearTimeout(timer)
  }, [sansFamily, serifFamily])

  return null
}
