'use client'

import * as React from 'react'
import * as S from './styles'
import type { SkeletonProps, SkeletonVariant } from './specs'

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
    <S.SkeletonRoot
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

export type { SkeletonProps, SkeletonVariant } from './specs'
export default Skeleton
