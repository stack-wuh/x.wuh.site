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
import { ROLE_PRESETS, type AspectRatio, type ImageProps, type ImageRole } from './specs'

export type { ImageVariant, ImageAppearance }
export type { AspectRatio, ImageProps, ImageRole } from './specs'

function formatRadius(radius?: string | number): string {
  if (typeof radius === 'number') return `${radius}px`
  return radius ?? 'var(--border-radius-lg, 16px)'
}

function parseRatio(ratio?: AspectRatio): number | undefined {
  if (!ratio) return undefined
  if (typeof ratio === 'number') return ratio > 0 ? ratio : undefined
  if (ratio.includes(':')) {
    const [width, height] = ratio.split(':').map(Number)
    return Number.isFinite(width) && Number.isFinite(height) && height !== 0 ? width / height : undefined
  }
  const numeric = Number(ratio)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined
}

const DefaultFallback = ({ compact, appearance }: { compact: boolean; appearance: ImageAppearance }) => (
  <Fallback role='alert' aria-live='polite' $compactFallback={compact} $appearance={appearance}>
    <IconFallbackImage />
    {!compact && <span>图片加载失败</span>}
  </Fallback>
)

const Image = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const {
    role,
    variant,
    ratio,
    borderRadius,
    showSkeleton,
    skeleton,
    errorFallback,
    className,
    imageClassName,
    imageStyle,
    inline = false,
    appearance,
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

  const preset = role ? ROLE_PRESETS[role] : undefined
  const resolvedVariant = variant ?? preset?.variant ?? 'cover'
  const resolvedAppearance = appearance ?? preset?.appearance ?? 'default'
  const resolvedShowSkeleton = showSkeleton ?? preset?.showSkeleton ?? true
  const compactFallback = preset?.compactFallback ?? false
  const resolvedRadius = formatRadius(borderRadius ?? preset?.borderRadius)
  const ratioValue = React.useMemo(() => parseRatio(ratio), [ratio])
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

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !role) {
      console.warn('[Image] Add a semantic role to this image.')
    }
  }, [role])

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) { setSkipLazy(true); setInView(true) }
    const handler = (event: MediaQueryListEvent) => {
      if (event.matches) { setSkipLazy(true); setInView(true) }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  React.useEffect(() => {
    if (!shouldLazy || skipLazy || inView) return
    const element = wrapperRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [shouldLazy, skipLazy, inView, rootMargin])

  React.useEffect(() => {
    setStatus(inView ? (resolvedShowSkeleton ? 'visible' : 'idle') : 'idle')
  }, [src, inView, resolvedShowSkeleton])

  React.useEffect(() => {
    if (inView && status === 'idle') setStatus('visible')
  }, [inView, status])

  React.useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  const handleLoad = React.useCallback(() => setStatus('loaded'), [])
  const handleError = React.useCallback(
    (event: Parameters<NonNullable<ImageProps['onError']>>[0]) => {
      setStatus('error')
      onError?.(event)
    },
    [onError]
  )

  const showSkel = resolvedShowSkeleton && status !== 'loaded' && status !== 'error'
  const showError = status === 'error'

  return (
    <Wrapper
      ref={wrapperRef}
      className={className}
      $inline={inline}
      $appearance={resolvedAppearance}
      $radius={resolvedRadius}
      $hasExplicitSize={hasExplicitSize}
      $role={role}
      style={ratioValue ? { aspectRatio: String(ratioValue) } : undefined}
    >
      {showSkel && (skeleton ?? <Skeleton $visible={status === 'idle' || status === 'visible'} />)}

      {inView && !showError && (
        <ImgWrapper
          {...restNativeProps}
          ref={ref}
          className={imageClassName}
          style={imageStyle}
          src={src}
          alt={alt}
          fill={finalFill}
          width={finalWidth}
          height={finalHeight}
          sizes={sizes}
          priority={priority}
          loading={loading}
          $objectFit={resolvedVariant}
          $status={status === 'loaded' ? 'loaded' : 'visible'}
          $stretch={shouldStretch}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {showError && (errorFallback ?? <DefaultFallback compact={compactFallback} appearance={resolvedAppearance} />)}
    </Wrapper>
  )
})

Image.displayName = 'Image'

export default Image
