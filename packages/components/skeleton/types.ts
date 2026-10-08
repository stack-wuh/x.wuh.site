import * as React from 'react'

export type SkeletonVariant = 'text' | 'rect' | 'circle'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: number | string
  height?: number | string
  radius?: number | string
  variant?: SkeletonVariant
  shimmer?: boolean
}
