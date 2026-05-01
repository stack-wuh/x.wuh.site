'use client'

import * as React from 'react'
import styled, { css, keyframes } from 'styled-components'

type SkeletonVariant = 'text' | 'rect' | 'circle'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: number | string
  height?: number | string
  radius?: number | string
  variant?: SkeletonVariant
  shimmer?: boolean
}

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`

const SkeletonRoot = styled.div<{
  $width: string
  $height: string
  $radius: string
  $shimmer: boolean
}>`
  width: ${(p) => p.$width};
  height: ${(p) => p.$height};
  border-radius: ${(p) => p.$radius};
  background: linear-gradient(90deg, var(--background-200) 0%, var(--normal-300) 50%, var(--background-200) 100%);
  background-size: 400% 100%;
  animation: ${(p) => (p.$shimmer ? css`${shimmer} 1.6s ease-in-out infinite` : 'none')};
  opacity: 0.85;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(90deg, var(--background-300) 0%, var(--normal-600) 50%, var(--background-300) 100%);
  }
`

const toSize = (value: number | string | undefined, fallback: string) => {
  if (value === undefined || value === null) return fallback
  return typeof value === 'number' ? `${value}px` : value
}

const getDefaultHeight = (variant: SkeletonVariant) => {
  if (variant === 'text') return '12px'
  if (variant === 'circle') return '36px'
  return '16px'
}

const getDefaultRadius = (variant: SkeletonVariant) => {
  if (variant === 'circle') return '999px'
  if (variant === 'text') return '6px'
  return '10px'
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(props, ref) {
  const {
    width,
    height,
    radius,
    variant = 'text',
    shimmer = true,
    style,
    'aria-hidden': ariaHidden = true,
    ...rest
  } = props

  const resolvedHeight = toSize(height, getDefaultHeight(variant))
  const resolvedWidth = toSize(width, variant === 'circle' ? resolvedHeight : '100%')
  const resolvedRadius = toSize(radius, getDefaultRadius(variant))

  return (
    <SkeletonRoot
      ref={ref}
      $width={resolvedWidth}
      $height={resolvedHeight}
      $radius={resolvedRadius}
      $shimmer={shimmer}
      aria-hidden={ariaHidden}
      style={style}
      {...rest}
    />
  )
})

export type { SkeletonProps, SkeletonVariant }
export default Skeleton
