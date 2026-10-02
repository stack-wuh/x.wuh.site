'use client'

import { useEffect } from 'react'

/**
 * 空闲时预热非首屏字重，减少渲染时的 FOUT 阻塞。
 * 首屏必需字重（Serif/Sans 400）已由 app/layout.tsx 的 <link rel=preload> 提前发现，
 * 这里只负责 preload 覆盖不到的延迟字重。
 * 字体族名与 app/fonts/cjk.css 中的 @font-face 保持一致（Sans 700 已下架由合成加粗承担）。
 */
const WARM_SPECS = ['700 16px Noto Serif SC']

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
