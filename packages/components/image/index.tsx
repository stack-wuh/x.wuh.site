'use client'

import * as React from 'react'
import NextImage from 'next/image'
import { useLocale } from '@wuh.site/components/locales'
import { useMediaQuery } from '@wuh.site/hooks/useMediaQuery'
import {
  Wrapper,
  ImgWrapper,
  Skeleton,
  Fallback,
  FallbackCaption,
  FallbackSeal,
  FallbackVisuallyHidden,
  type ImageVariant,
  type ImageAppearance,
  type ImageStatus,
} from './styles'
import { ROLE_PRESETS, type AspectRatio, type ImageProps, type ImageRole } from './types'

export type { ImageVariant, ImageAppearance }
export type { AspectRatio, ImageProps, ImageRole } from './types'

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

// 失败态「装裱题注」：图题取 alt（语义从破图占位文字升格为著录图题），
// 无 alt 回落词典文案；印面「佚」为跨语言装饰字（aria-hidden），语义由屏读文本承担
const DefaultFallback = ({
  compact,
  appearance,
  caption,
}: {
  compact: boolean
  appearance: ImageAppearance
  caption: string
}) => {
  const { t } = useLocale()
  const loadFailed = t('components.image.loadFailed')
  return (
    <Fallback role='alert' aria-live='polite' $compactFallback={compact} $appearance={appearance}>
      <FallbackVisuallyHidden>{loadFailed}</FallbackVisuallyHidden>
      {!compact && <FallbackCaption>{caption || loadFailed}</FallbackCaption>}
      <FallbackSeal $compactFallback={compact} aria-hidden='true'>
        佚
      </FallbackSeal>
    </Fallback>
  )
}

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
    placeholder,
    blurDataURL,
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
  // Next 16 起解耦 priority 与 fetchPriority：priority 只映射 preload link 与禁 lazy，
  // img 元素上的 fetchpriority="high" 需显式传入，LCP 竞速信号才完整
  const resolvedFetchPriority = priority ? ('high' as const) : undefined
  // blur 占位必须同时具备策略与数据才生效（next/image 对缺数据的 blur 只会白屏）
  const hasBlur = placeholder === 'blur' && Boolean(blurDataURL)

  const [inView, setInView] = React.useState(!shouldLazy)
  const [status, setStatus] = React.useState<ImageStatus>('idle')
  const [skipLazy, setSkipLazy] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const imgRef = React.useRef<HTMLImageElement | null>(null)
  const setImgRef = React.useCallback(
    (node: HTMLImageElement | null) => {
      imgRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !role) {
      console.warn('[Image] Add a semantic role to this image.')
    }
  }, [role])

  // reduced-motion 单向闩：命中即永久跳过懒加载（与原实现一致，关闭开关不回退）
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  React.useEffect(() => {
    if (reduceMotion) {
      setSkipLazy(true)
      setInView(true)
    }
  }, [reduceMotion])

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

  // 状态复位与缓存命中判定合并为一个 layout effect：complete 判定必须先于浏览器
  // paint（passive effect 在绘制后跑，缓存命中仍会画出一帧骨架）。缓存命中（回访/
  // 软导航返回/预加载完成）直达 loaded；error 场景 naturalWidth 为 0 不会误标
  React.useLayoutEffect(() => {
    if (!inView) {
      setStatus('idle')
      return
    }
    const node = imgRef.current
    if (node?.complete && node.naturalWidth > 0) {
      setStatus('loaded')
      return
    }
    setStatus(resolvedShowSkeleton ? 'visible' : 'idle')
  }, [src, inView, resolvedShowSkeleton])

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

  const showSkel = resolvedShowSkeleton && !hasBlur && status !== 'loaded' && status !== 'error'
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
          ref={setImgRef}
          className={imageClassName}
          style={imageStyle}
          src={src}
          alt={alt}
          fill={finalFill}
          width={finalWidth}
          height={finalHeight}
          sizes={sizes}
          fetchPriority={resolvedFetchPriority}
          priority={priority}
          loading={loading}
          placeholder={hasBlur ? 'blur' : undefined}
          blurDataURL={blurDataURL}
          $objectFit={resolvedVariant}
          $status={status === 'loaded' ? 'loaded' : 'visible'}
          $stretch={shouldStretch}
          $blur={hasBlur}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {showError &&
        (errorFallback ?? (
          <DefaultFallback compact={compactFallback} appearance={resolvedAppearance} caption={alt.trim()} />
        ))}
    </Wrapper>
  )
})

Image.displayName = 'Image'

export default Image
