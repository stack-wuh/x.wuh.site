'use client'

import * as React from 'react'
import NextImage from 'next/image'

import {
  Caption,
  Figure,
  Frame,
  Fallback,
  Overlay,
  Skeleton,
  StyledNextImage,
  type ImageAppearance,
  type ImageStatus,
  type ImageVariant,
} from './styles'

type NativeImageProps = React.ComponentPropsWithoutRef<typeof NextImage>

type AspectRatio = number | `${number}:${number}`

export type { ImageVariant, ImageAppearance }

export interface ImageProps extends Omit<NativeImageProps, 'className' | 'style' | 'onLoadingComplete' | 'onError'> {
  /** 自定义 wrapper class，便于通过 styled(Image) 二次封装 */
  className?: string
  /** 直接作用于 wrapper(figure) 的内联样式 */
  wrapperStyle?: React.CSSProperties
  /** 传递给 Next.js Image 的 className */
  imageClassName?: string
  /** 传递给 Next.js Image 的 style */
  imageStyle?: React.CSSProperties
  /** object-fit 变体，默认 cover */
  variant?: ImageVariant
  /** 宽高比，支持数字或 16:9 字符串，提供时自动使用 fill 布局 */
  ratio?: AspectRatio
  /** 圆角，默认使用主题 lg token */
  borderRadius?: string | number
  /** 是否在加载阶段展示骨架屏 */
  showSkeleton?: boolean
  /** 自定义骨架内容 */
  skeleton?: React.ReactNode
  /** 自定义错误兜底 */
  errorFallback?: React.ReactNode
  /** 图片下方的说明文案 */
  caption?: React.ReactNode
  /** 在图片上方显示的 overlay，可用于版权/描述 */
  overlay?: React.ReactNode
  /** 关闭过渡动画 */
  disableTransition?: boolean
  /** 以内联模式渲染，适合按钮/文字内使用 */
  inline?: boolean
  /** 外框样式：default 显示边框背景，plain 则透明无边框 */
  appearance?: ImageAppearance
  /** 状态变化回调（loading/loaded/error） */
  onStatusChange?: (status: ImageStatus) => void
  onLoadingComplete?: NativeImageProps['onLoadingComplete']
  onError?: NativeImageProps['onError']
}


const FallbackIcon = () => (
  <svg width='48' height='48' viewBox='0 0 48 48' role='presentation' aria-hidden='true'>
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M10 8h28a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Zm0 0l12.5 18L28 20l10 12'
    />
    <circle cx='18' cy='16' r='3' fill='currentColor' />
  </svg>
)

const DefaultFallback = () => (
  <Fallback role='alert' aria-live='polite'>
    <FallbackIcon />
    <span>图片加载失败</span>
  </Fallback>
)

const formatRadius = (radius?: string | number): string => {
  if (typeof radius === 'number') {
    return `${radius}px`
  }
  return radius ?? 'var(--border-radius-lg, 16px)'
}

const parseRatio = (ratio?: AspectRatio): number | undefined => {
  if (!ratio) return undefined
  if (typeof ratio === 'number') {
    return ratio > 0 ? ratio : undefined
  }
  if (ratio.includes(':')) {
    const [w, h] = ratio.split(':').map((n) => Number(n))
    if (Number.isFinite(w) && Number.isFinite(h) && h !== 0) {
      return w / h
    }
    return undefined
  }
  const numeric = Number(ratio)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined
}

const deriveSizes = (explicit?: NativeImageProps['sizes'], fill?: boolean, width?: NativeImageProps['width']): NativeImageProps['sizes'] | undefined => {
  if (explicit) return explicit
  if (fill) {
    return '100vw'
  }
  if (typeof width === 'number' && width > 0) {
    return `(max-width: ${width}px) 100vw, ${width}px`
  }
  return undefined
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const {
    variant = 'cover',
    ratio,
    borderRadius,
    showSkeleton = true,
    skeleton,
    errorFallback,
    caption,
    overlay,
    className,
    wrapperStyle,
    imageClassName,
    imageStyle,
    disableTransition = false,
    inline = false,
    appearance = 'default',
    onStatusChange,
    onLoadingComplete,
    onError,
    loading,
    sizes,
    width,
    height,
    fill,
    priority,
    src,
    ...restNativeProps
  } = props

  const ratioValue = React.useMemo(() => parseRatio(ratio), [ratio])
  const resolvedRadius = React.useMemo(() => formatRadius(borderRadius), [borderRadius])
  const finalFill = ratioValue ? true : fill
  const finalWidth = ratioValue ? undefined : width
  const finalHeight = ratioValue ? undefined : height
  const hasExplicitSize = typeof finalWidth !== 'undefined' && typeof finalHeight !== 'undefined'
  const finalSizes = React.useMemo(() => deriveSizes(sizes, finalFill, finalWidth), [sizes, finalFill, finalWidth])
  const finalLoading = loading ?? 'lazy'
  const resolvedLoading = priority ? undefined : finalLoading
  const shouldStretch = Boolean(finalFill)

  const initialStatus: ImageStatus = showSkeleton ? 'loading' : 'loaded'
  const [status, setStatus] = React.useState<ImageStatus>(initialStatus)

  React.useEffect(() => {
    setStatus(showSkeleton ? 'loading' : 'loaded')
  }, [src, showSkeleton])

  React.useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  const handleError = React.useCallback(
    (event: Parameters<NonNullable<ImageProps['onError']>>[0]) => {
      setStatus('error')
      onError?.(event)
    },
    [onError]
  )

  const handleLoadingComplete = React.useCallback(
    (result: Parameters<NonNullable<ImageProps['onLoadingComplete']>>[0]) => {
      setStatus('loaded')
      onLoadingComplete?.(result)
    },
    [onLoadingComplete]
  )

  const showFallback = status === 'error'
  const isLoading = status === 'loading'

  const hasCaption = Boolean(caption)

  return (
    <Figure className={className} style={wrapperStyle} $inline={inline} $hasCaption={hasCaption}>
      <Frame $radius={resolvedRadius} $ratio={ratioValue} $hasExplicitSize={hasExplicitSize} $inline={inline} $appearance={appearance} aria-busy={isLoading}>
        {showSkeleton && !showFallback && (skeleton ?? <Skeleton aria-hidden $visible={isLoading} />)}
        {!showFallback && (
          <StyledNextImage
            {...restNativeProps}
            ref={ref}
            src={src}
            className={imageClassName}
            style={imageStyle}
            fill={finalFill}
            width={finalWidth}
            height={finalHeight}
            sizes={finalSizes}
            loading={resolvedLoading}
            priority={priority}
            $objectFit={variant}
            $status={status}
            $disableTransition={disableTransition}
            $stretch={shouldStretch}
            onError={handleError}
            onLoadingComplete={handleLoadingComplete}
          />
        )}
        {showFallback && (errorFallback ?? <DefaultFallback />)}
        {overlay ? <Overlay>{overlay}</Overlay> : null}
      </Frame>
      {caption ? <Caption>{caption}</Caption> : null}
    </Figure>
  )
})

Image.displayName = 'Image'

export default Image
