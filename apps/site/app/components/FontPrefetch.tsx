'use client'

import { useEffect } from 'react'

/**
 * 空闲时预热非首屏字重，减少渲染时的 FOUT 阻塞。
 * 字体族名与 app/fonts/cjk.css 中的 @font-face 保持一致。
 */
const WARM_SPECS = ['700 16px Noto Sans SC', '400 16px Noto Serif SC', '700 16px Noto Serif SC']

export default function FontPrefetch() {
  useEffect(() => {
    if (!('fonts' in document)) return

    const warmUp = () => {
      WARM_SPECS.forEach((spec) => {
        document.fonts.load(spec).catch(() => {})
      })
    }

    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(warmUp, { timeout: 3000 })
      return () => (window as any).cancelIdleCallback(id)
    }
    const timer = window.setTimeout(warmUp, 3000)
    return () => window.clearTimeout(timer)
  }, [])

  return null
}
