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
