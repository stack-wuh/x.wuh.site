'use client'

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from './styles'
import type { ScrollAreaProps } from './specs'

export type { ScrollAreaProps } from './specs'

/**
 * 主题化滚动区域，移植自 shadcn ScrollArea（Radix 封装）。
 * 滚动条独立 DOM 渲染：hover 或滚动中浮现，跨浏览器行为一致。
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ children, className, viewportRef, type = 'scroll', scrollHideDelay = 500, 'aria-label': ariaLabel, ...props }, ref) => {
  return (
    <ScrollAreaRoot
      ref={ref}
      type={type}
      scrollHideDelay={scrollHideDelay}
      className={className}
      {...props}
    >
      <ScrollAreaViewport ref={viewportRef} aria-label={ariaLabel}>{children}</ScrollAreaViewport>
      <ScrollAreaScrollbar orientation='vertical'>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaRoot>
  )
})

ScrollArea.displayName = 'ScrollArea'

export default ScrollArea
