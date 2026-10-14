'use client'

import { useEffect } from 'react'
import { scheduleIdle } from '@wuh.site/hooks/scheduleIdle'

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

    // 共享 scheduleIdle：idle timeout 3000，旧 Safari 回落 setTimeout 3000，cancel 闭包按分支收敛
    const cancel = scheduleIdle(warmUp, { timeout: 3000 })
    return cancel
  }, [])

  return null
}
