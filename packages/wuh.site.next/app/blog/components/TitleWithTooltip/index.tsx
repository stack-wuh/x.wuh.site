'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import * as S from './styles'
import type { TitleWithTooltipProps } from './specs'

export default function TitleWithTooltip({ text }: TitleWithTooltipProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [overflow, setOverflow] = useState(false)
  const [hovering, setHovering] = useState(false)

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const checkOverflow = () => {
      setOverflow(el.scrollWidth - el.clientWidth > 1)
    }
    checkOverflow()
    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(checkOverflow)
      observer.observe(el)
    }
    window.addEventListener('resize', checkOverflow)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', checkOverflow)
    }
  }, [text])

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
