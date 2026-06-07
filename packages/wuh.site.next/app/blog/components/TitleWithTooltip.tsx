'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import styled from '@wuh.site/components/styled'

const TitleTextContainer = styled.div`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
`

const TitleText = styled.span`
  display: block;
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TitleTooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: min(360px, 80vw);
  padding: var(--space-sm);
  border-radius: var(--border-radius-base);
  background: var(--background-100);
  color: var(--text-primary);
  box-shadow: var(--elevation-card);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  pointer-events: none;
  z-index: 10;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '4px')});
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
`

interface TitleWithTooltipProps {
  text: string
}

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
    <TitleTextContainer
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <TitleText ref={textRef} title={overflow ? text : undefined}>
        {text}
      </TitleText>
      {overflow && (
        <TitleTooltip role='tooltip' $visible={hovering}>
          {text}
        </TitleTooltip>
      )}
    </TitleTextContainer>
  )
}
