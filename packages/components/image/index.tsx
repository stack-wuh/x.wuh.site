'use client'

import * as React from 'react'
import NextImage from 'next/image'
import {
  Wrapper,
  ImgWrapper,
  Skeleton,
  Fallback,
  type ImageVariant,
  type ImageAppearance,
  type ImageStatus,
} from './styles'
import { IconFallbackImage } from '../icons'

type NativeImageProps = React.ComponentPropsWithoutRef<typeof NextImage>

export type { ImageVariant, ImageAppearance }

type AspectRatio = number | `${number}:${number}`

export interface ImageProps extends Omit<NativeImageProps, 'className' | 'style' | 'onLoad' | 'onError'> {
  className?: string
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

function formatRadius(radius?: string | number): string {
  if (typeof radius === 'number') return `${radius}px`
  return radius ?? 'var(--border-radius-lg, 16px)'
}

function parseRatio(ratio?: AspectRatio): number | undefined {
  if (!ratio) return undefined
  if (typeof ratio === 'number') return ratio > 0 ? ratio : undefined
  if (ratio.includes(':')) {
    const [w, h] = ratio.split(':').map(Number)
    return Number.isFinite(w) && Number.isFinite(h) && h !== 0 ? w / h : undefined
  }
  const numeric = Number(ratio)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined
}

const DefaultFallback = () => (
  <Fallback role='alert' aria-live='polite'>
    <IconFallbackImage />
    <span>图片加载失败</span>
  </Fallback>
)

const Image = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const {
    variant = 'cover',
    ratio,
    borderRadius,
    showSkeleton = true,
    skeleton,
    errorFallback,
    className,
    inline = false,
    appearance = 'default',
    lazy = true,
    rootMargin = '200px',
    onStatusChange,
    onError,
    fill,
    width,
    height,
    priority,
    src,
    sizes,
    loading,
    alt = '',
    ...restNativeProps
  } = props

  const ratioValue = React.useMemo(() => parseRatio(ratio), [ratio])
  const resolvedRadius = React.useMemo(() => formatRadius(borderRadius), [borderRadius])
  const finalFill = ratioValue ? true : fill
  const finalWidth = ratioValue ? undefined : width
  const finalHeight = ratioValue ? undefined : height
  const hasExplicitSize = typeof finalWidth !== 'undefined' && typeof finalHeight !== 'undefined'
  const shouldStretch = Boolean(finalFill)

  const shouldLazy = lazy && !priority

  const [inView, setInView] = React.useState(!shouldLazy)
  const [status, setStatus] = React.useState<ImageStatus>('idle')
  const [skipLazy, setSkipLazy] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  // prefers-reduced-motion → skip lazy loading
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) { setSkipLazy(true); setInView(true) }
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) { setSkipLazy(true); setInView(true) }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // IntersectionObserver lazy loading
  React.useEffect(() => {
    if (!shouldLazy || skipLazy || inView) return
    const el = wrapperRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldLazy, skipLazy, inView, rootMargin])

  // src 变化时重置状态
  React.useEffect(() => {
    if (inView) {
      setStatus(showSkeleton ? 'visible' : 'idle')
    } else {
      setStatus('idle')
    }
  }, [src])
  React.useEffect(() => {
    if (inView && status === 'idle') {
      setStatus('visible')
    }
  }, [inView, status])

  React.useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  const handleLoad = React.useCallback(() => {
    setStatus('loaded')
  }, [])

  const handleError = React.useCallback(
    (event: Parameters<NonNullable<ImageProps['onError']>>[0]) => {
      setStatus('error')
      onError?.(event)
    },
    [onError]
  )

  const showSkel = showSkeleton && status !== 'loaded' && status !== 'error'
  const showError = status === 'error'

  return (
    <Wrapper
      ref={wrapperRef}
      className={className}
      $inline={inline}
      $appearance={appearance}
      $radius={resolvedRadius}
      $hasExplicitSize={hasExplicitSize}
      style={ratioValue ? { aspectRatio: String(ratioValue) } : undefined}
    >
      {showSkel && (skeleton ?? <Skeleton $visible={status === 'idle' || status === 'visible'} />)}

      {inView && !showError && (
        <ImgWrapper
          {...restNativeProps}
          ref={ref}
          src={src}
          alt={alt}
          fill={finalFill}
          width={finalWidth}
          height={finalHeight}
          sizes={sizes}
          priority={priority}
          loading={loading}
          $objectFit={variant}
          $status={status === 'loaded' ? 'loaded' : 'visible'}
          $stretch={shouldStretch}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {showError && (errorFallback ?? <DefaultFallback />)}
    </Wrapper>
  )
})

Image.displayName = 'Image'

export default Image
