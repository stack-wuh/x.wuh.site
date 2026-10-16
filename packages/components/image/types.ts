import * as React from 'react'
import NextImage from 'next/image'
import type { ImageAppearance, ImageStatus, ImageVariant } from './styles'

type NativeImageProps = React.ComponentPropsWithoutRef<typeof NextImage>

export type ImageRole = 'avatar' | 'book-cover' | 'content' | 'cover' | 'thumbnail' | 'logo' | 'qr'

export type AspectRatio = number | `${number}:${number}`

export type RolePreset = {
  borderRadius: string
  appearance: ImageAppearance
  variant: ImageVariant
  showSkeleton?: boolean
  compactFallback?: boolean
}

export const ROLE_PRESETS: Record<ImageRole, RolePreset> = {
  avatar: { borderRadius: '50%', appearance: 'plain', variant: 'cover', compactFallback: true },
  'book-cover': { borderRadius: '2px', appearance: 'default', variant: 'contain', compactFallback: true },
  content: { borderRadius: '8px', appearance: 'default', variant: 'contain' },
  cover: { borderRadius: 'var(--radius-card, 12px)', appearance: 'default', variant: 'cover' },
  thumbnail: { borderRadius: '8px', appearance: 'default', variant: 'cover', compactFallback: true },
  logo: { borderRadius: '0', appearance: 'plain', variant: 'contain', showSkeleton: false, compactFallback: true },
  qr: { borderRadius: '2px', appearance: 'qr', variant: 'contain', compactFallback: true },
}

export interface ImageProps extends Omit<NativeImageProps, 'className' | 'style' | 'onLoad' | 'onError'> {
  /**
   * 渐进式占位策略（沿用 next/image 词汇）：
   * - `'blur'` + `blurDataURL`：组件自挂载即显示模糊占位打底，加载完成后替换清晰图；
   *   此时骨架退场。LQIP 数据由消费方自备（如静态导入自动生成、服务端同步管线产出）。
   * - 缺省（'empty'）：维持 shimmer 骨架 → 加载完成淡入的既有行为。
   */
  placeholder?: NativeImageProps['placeholder']
  /** `'blur'` 占位的 base64 微缩图数据；不传时 placeholder='blur' 不生效 */
  blurDataURL?: NativeImageProps['blurDataURL']
  className?: string
  imageClassName?: string
  imageStyle?: React.CSSProperties
  role?: ImageRole
  variant?: ImageVariant
  ratio?: AspectRatio
  borderRadius?: string | number
  showSkeleton?: boolean
  skeleton?: React.ReactNode
  errorFallback?: React.ReactNode
  inline?: boolean
  appearance?: ImageAppearance
  lazy?: boolean
  rootMargin?: string
  onStatusChange?: (status: ImageStatus) => void
  onError?: NativeImageProps['onError']
}
