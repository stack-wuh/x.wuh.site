'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useEventListener } from '@wuh.site/hooks/useEventListener'
import * as S from './styles'
import type { TitleWithTooltipProps } from './specs'

export default function TitleWithTooltip({ text }: TitleWithTooltipProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [overflow, setOverflow] = useState(false)
  const [hovering, setHovering] = useState(false)

  const checkOverflow = () => {
    const el = textRef.current
    if (!el) return
    setOverflow(el.scrollWidth - el.clientWidth > 1)
  }

  useLayoutEffect(() => {
    checkOverflow()
    const el = textRef.current
    if (!el) return
    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(checkOverflow)
      observer.observe(el)
    }
    return () => {
      observer?.disconnect()
    }
  }, [text])

  useEventListener('resize', checkOverflow)

  return (
    <S.TitleTextContainer
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <S.TitleText ref={textRef} title={overflow ? text : undefined}>
        {text}
      </S.TitleText>
      {overflow && (
        <S.TitleTooltip role='tooltip' $visible={hovering}>
          {text}
        </S.TitleTooltip>
      )}
    </S.TitleTextContainer>
  )
}
