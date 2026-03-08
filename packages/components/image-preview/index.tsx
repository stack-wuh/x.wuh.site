'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'

import {
  Backdrop,
  Caption,
  Content,
  Counter,
  EmptyState,
  Footer,
  Header,
  Hint,
  IconButton,
  ImageStage,
  KeyboardLegend,
  PreviewContainer,
  PreviewImage,
  PreviewSurface,
  Subtitle,
  ThumbnailButton,
  ThumbnailRail,
  ThumbLabel,
  Title,
  TitleLabel,
  Toolbar,
  Viewport,
} from './styles'

export type ImagePreviewItem = {
  id?: string | number
  src: string
  thumbnailSrc?: string
  alt?: string
  title?: string
  description?: React.ReactNode
  width?: number
  height?: number
  blurDataURL?: string
  downloadUrl?: string
  meta?: Record<string, unknown>
}

export type ThumbnailRenderProps = {
  item: ImagePreviewItem
  index: number
  active: boolean
}

export type ToolbarRenderProps = {
  close: () => void
  next: () => void
  previous: () => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  rotate: () => void
  toggleFullscreen: () => void
  download: () => void
  canZoomIn: boolean
  canZoomOut: boolean
  isFullscreen: boolean
  zoom: number
  index: number
  total: number
  item?: ImagePreviewItem
}

export interface ImagePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ImagePreviewItem[]
  open?: boolean
  defaultOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  currentIndex?: number
  initialIndex?: number
  onIndexChange?: (index: number, item: ImagePreviewItem) => void
  showThumbnails?: boolean
  enableLoop?: boolean
  allowZoom?: boolean
  zoomSteps?: number[]
  allowRotate?: boolean
  allowDownload?: boolean
  allowKeyboard?: boolean
  allowGesture?: boolean
  allowFullscreen?: boolean
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  lockScroll?: boolean
  disableAnimation?: boolean
  hint?: React.ReactNode
  renderToolbar?: (props: ToolbarRenderProps) => React.ReactNode
  renderThumbnail?: (props: ThumbnailRenderProps) => React.ReactNode
  renderCaption?: (item: ImagePreviewItem, index: number) => React.ReactNode
}

const DEFAULT_ZOOM_STEPS = [1, 2, 4]

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const useControllableState = <T,>(options: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const { value, defaultValue, onChange } = options
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<T>(defaultValue)

  const state = isControlled ? (value as T) : internalValue

  const setState = React.useCallback(
    (next: React.SetStateAction<T>) => {
      if (isControlled) {
        const nextValue = typeof next === 'function' ? (next as (prev: T) => T)(value as T) : next
        if (nextValue !== value) {
          onChange?.(nextValue)
        }
      } else {
        setInternalValue((prev) => {
          const resolved = typeof next === 'function' ? (next as (prevValue: T) => T)(prev) : next
          if (resolved !== prev) {
            onChange?.(resolved)
          }
          return resolved
        })
      }
    },
    [isControlled, value, onChange]
  )

  return [state, setState]
}

const usePrevious = <T,>(value: T) => {
  const ref = React.useRef<T>(value)
  React.useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

const SvgIcon = ({ d }: { d: string }) => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d={d} />
  </svg>
)

const ArrowLeftIcon = () => <SvgIcon d='M15 6l-6 6 6 6' />
const ArrowRightIcon = () => <SvgIcon d='M9 6l6 6-6 6' />
const CloseIcon = () => <SvgIcon d='M6 6l12 12M6 18l12-12' />
const ZoomInIcon = () => <SvgIcon d='M11 11V7m0 4h4m-4 0H7m4 0v4m2.5-6.5l5.5 5.5' />
const ZoomOutIcon = () => <SvgIcon d='M15 11H7m11 8l-5.5-5.5' />
const RotateIcon = () => <SvgIcon d='M4 7v6h6M20 17V11h-6M4 7a8 8 0 0 1 14-3' />
const DownloadIcon = () => <SvgIcon d='M12 5v12m0 0-4-4m4 4 4-4M5 19h14' />
const FullscreenIcon = () => <SvgIcon d='M9 3H5v4m10-4h4v4M9 21H5v-4m10 4h4v-4' />
const ExitFullscreenIcon = () => <SvgIcon d='M9 9L5 5m0 0h4M5 5v4m10 6 4 4m0 0v-4m0 4h-4' />
const ResetIcon = () => <SvgIcon d='M3 12a9 9 0 1 1 3 6.708M3 12h4m0 0v-4' />

export const ImagePreview = React.forwardRef<HTMLDivElement, ImagePreviewProps>((props, forwardedRef) => {
  const {
    items,
    open: openProp,
    defaultOpen = false,
    onOpen,
    onClose,
    onOpenChange,
    currentIndex: currentIndexProp,
    initialIndex = 0,
    onIndexChange,
    showThumbnails = true,
    enableLoop = false,
    allowZoom = true,
    zoomSteps = DEFAULT_ZOOM_STEPS,
    allowRotate = true,
    allowDownload = true,
    allowKeyboard = true,
    allowGesture = true,
    allowFullscreen = true,
    closeOnOverlay = true,
    closeOnEsc = true,
    lockScroll = true,
    disableAnimation = false,
    hint,
    renderToolbar,
    renderThumbnail,
    renderCaption,
    onDownload,
    className,
    style,
    ...rest
  } = props

  const sanitizedZoomSteps = React.useMemo(() => {
    const filtered = zoomSteps.filter((value) => Number.isFinite(value) && value > 0)
    if (!filtered.length) return DEFAULT_ZOOM_STEPS
    return Array.from(new Set(filtered)).sort((a, b) => a - b)
  }, [zoomSteps])

  const defaultIndex = React.useMemo(() => {
    return clamp(initialIndex ?? 0, 0, Math.max(items.length - 1, 0))
  }, [initialIndex, items.length])

  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  const [currentIndex, setCurrentIndex] = useControllableState<number>({
    value: currentIndexProp,
    defaultValue: defaultIndex,
    onChange: (next) => {
      const safeIndex = clamp(next, 0, Math.max(items.length - 1, 0))
      const item = items[safeIndex]
      if (item) {
        onIndexChange?.(safeIndex, item)
      }
    },
  })

  const [zoomIndex, setZoomIndex] = React.useState(0)
  const [rotation, setRotation] = React.useState(0)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [isNativeFullscreen, setIsNativeFullscreen] = React.useState(false)

  const overlayRef = React.useRef<HTMLDivElement | null>(null)
  const stageRef = React.useRef<HTMLDivElement | null>(null)
  const previousOpen = usePrevious(open)
  const pointerState = React.useRef<{
    pointerId: number | null
    originX: number
    originY: number
    startOffsetX: number
    startOffsetY: number
    isSwiping: boolean
    isPanning: boolean
  }>({
    pointerId: null,
    originX: 0,
    originY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    isSwiping: false,
    isPanning: false,
  })

  const total = items.length
  const hasItems = total > 0
  const currentItem = hasItems ? items[clamp(currentIndex, 0, total - 1)] : undefined
  const zoom = sanitizedZoomSteps[clamp(zoomIndex, 0, sanitizedZoomSteps.length - 1)] ?? 1
  const canZoomIn = zoomIndex < sanitizedZoomSteps.length - 1
  const canZoomOut = zoomIndex > 0

  React.useEffect(() => {
    if (!open || !lockScroll || typeof document === 'undefined') return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open, lockScroll])

  React.useEffect(() => {
    if (!closeOnEsc || !open) return
    const handleKeydown = (event: KeyboardEvent) => {
      if (!allowKeyboard) return
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrevious()
      } else if (event.key === ' ') {
        event.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [open, closeOnEsc, allowKeyboard])

  React.useEffect(() => {
    if (!open) {
      setZoomIndex(0)
      setRotation(0)
      setOffset({ x: 0, y: 0 })
    }
  }, [open])

  React.useEffect(() => {
    if (!hasItems) {
      setCurrentIndex(0)
      return
    }
    setCurrentIndex((prev) => clamp(prev, 0, total - 1))
  }, [hasItems, total, setCurrentIndex])

  React.useEffect(() => {
    setZoomIndex(0)
    setRotation(0)
    setOffset({ x: 0, y: 0 })
  }, [currentIndex])

  React.useEffect(() => {
    if (previousOpen !== open) {
      if (open) {
        onOpen?.()
      } else if (previousOpen) {
        onClose?.()
      }
    }
  }, [open, previousOpen, onOpen, onClose])

  React.useEffect(() => {
    if (!allowFullscreen || typeof document === 'undefined') return
    const handleFullscreenChange = () => {
      const element = document.fullscreenElement
      setIsNativeFullscreen(Boolean(element && overlayRef.current && element === overlayRef.current))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [allowFullscreen])

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const goNext = React.useCallback(() => {
    if (!hasItems) return
    setCurrentIndex((prev) => {
      const next = prev + 1
      if (next >= total) {
        return enableLoop ? 0 : total - 1
      }
      return next
    })
  }, [hasItems, total, enableLoop, setCurrentIndex])

  const goPrevious = React.useCallback(() => {
    if (!hasItems) return
    setCurrentIndex((prev) => {
      const next = prev - 1
      if (next < 0) {
        return enableLoop ? Math.max(total - 1, 0) : 0
      }
      return next
    })
  }, [hasItems, total, enableLoop, setCurrentIndex])

  const goTo = React.useCallback(
    (index: number) => {
      if (!hasItems) return
      setCurrentIndex(clamp(index, 0, total - 1))
    },
    [hasItems, total, setCurrentIndex]
  )

  const zoomIn = React.useCallback(() => {
    if (!allowZoom) return
    setZoomIndex((prev) => clamp(prev + 1, 0, sanitizedZoomSteps.length - 1))
  }, [allowZoom, sanitizedZoomSteps.length])

  const zoomOut = React.useCallback(() => {
    if (!allowZoom) return
    setZoomIndex((prev) => clamp(prev - 1, 0, sanitizedZoomSteps.length - 1))
  }, [allowZoom, sanitizedZoomSteps.length])

  const resetZoom = React.useCallback(() => {
    setZoomIndex(0)
    setOffset({ x: 0, y: 0 })
  }, [])

  const rotate = React.useCallback(() => {
    if (!allowRotate) return
    setRotation((prev) => (prev + 90) % 360)
  }, [allowRotate])

  const toggleFullscreen = React.useCallback(async () => {
    if (!allowFullscreen || typeof document === 'undefined') return
    const element = overlayRef.current
    if (!element) return
    if (isNativeFullscreen) {
      await document.exitFullscreen?.()
    } else {
      await element.requestFullscreen?.()
    }
  }, [allowFullscreen, isNativeFullscreen])

  const performDownload = React.useCallback(() => {
    if (!allowDownload || !currentItem) return
    if (onDownload) {
      onDownload(currentIndex, currentItem)
      return
    }
    const link = document.createElement('a')
    link.href = currentItem.downloadUrl ?? currentItem.src
    link.download = currentItem.title?.toString() ?? 'image'
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [allowDownload, currentItem, onDownload, currentIndex])

  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget && closeOnOverlay) {
      handleClose()
    }
  }

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    if (!allowZoom || sanitizedZoomSteps.length <= 1) return
    if (event.ctrlKey || Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault()
      if (event.deltaY < 0) {
        zoomIn()
      } else {
        zoomOut()
      }
    }
  }

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!stageRef.current) return
    stageRef.current.setPointerCapture(event.pointerId)
    const shouldPan = zoom > 1
    const shouldSwipe = allowGesture && zoom === 1 && event.pointerType !== 'mouse'
    pointerState.current = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
      isSwiping: shouldSwipe,
      isPanning: shouldPan,
    }
    if (shouldPan) {
      setIsDragging(true)
    }
  }

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const state = pointerState.current
    if (!state || state.pointerId !== event.pointerId) return
    const deltaX = event.clientX - state.originX
    const deltaY = event.clientY - state.originY
    if (state.isPanning) {
      setOffset({ x: state.startOffsetX + deltaX, y: state.startOffsetY + deltaY })
    }
  }

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const state = pointerState.current
    if (state.pointerId !== event.pointerId) return
    if (state.isSwiping) {
      const deltaX = event.clientX - state.originX
      if (Math.abs(deltaX) > 45) {
        if (deltaX > 0) {
          goPrevious()
        } else {
          goNext()
        }
      }
    }
    if (state.isPanning) {
      setIsDragging(false)
    }
    pointerState.current = {
      pointerId: null,
      originX: 0,
      originY: 0,
      startOffsetX: 0,
      startOffsetY: 0,
      isSwiping: false,
      isPanning: false,
    }
    if (stageRef.current) {
      stageRef.current.releasePointerCapture(event.pointerId)
    }
  }

  const handleDoubleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!allowZoom) return
    if (canZoomIn) {
      zoomIn()
    } else {
      resetZoom()
    }
  }

  React.useImperativeHandle(
    forwardedRef,
    () => overlayRef.current as HTMLDivElement,
    [open]
  )

  if (!open || !mounted) {
    return null
  }

  const toolbarProps: ToolbarRenderProps = {
    close: handleClose,
    next: goNext,
    previous: goPrevious,
    zoomIn,
    zoomOut,
    resetZoom,
    rotate,
    toggleFullscreen,
    download: performDownload,
    canZoomIn,
    canZoomOut,
    isFullscreen: isNativeFullscreen,
    zoom,
    index: hasItems ? currentIndex : 0,
    total,
    item: currentItem,
  }

  const captionContent = currentItem ? (
    renderCaption?.(currentItem, currentIndex) ?? currentItem.description ?? currentItem.title ?? currentItem.alt ?? '图片预览'
  ) : (
    '无可预览图片'
  )

  const thumbnails = showThumbnails && hasItems ? (
    <ThumbnailRail>
      {items.map((item, index) => {
        if (renderThumbnail) {
          return (
            <div key={item.id ?? item.src} onClick={() => goTo(index)} role='button' aria-label={`预览第 ${index + 1} 张`}>
              {renderThumbnail({ item, index, active: index === currentIndex })}
            </div>
          )
        }
        return (
          <ThumbnailButton key={item.id ?? item.src ?? index} type='button' $active={index === currentIndex} onClick={() => goTo(index)}>
            <img src={item.thumbnailSrc ?? item.src} alt={item.alt ?? `预览 ${index + 1}`} loading='lazy' />
            {item.title && <ThumbLabel>{item.title}</ThumbLabel>}
          </ThumbnailButton>
        )
      })}
    </ThumbnailRail>
  ) : null

  const toolbarContent = renderToolbar ? renderToolbar(toolbarProps) : (
    <Toolbar>
      <IconButton type='button' aria-label='关闭预览' onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      <IconButton type='button' aria-label='上一张' onClick={goPrevious}>
        <ArrowLeftIcon />
      </IconButton>
      <IconButton type='button' aria-label='下一张' onClick={goNext}>
        <ArrowRightIcon />
      </IconButton>
      {allowZoom && (
        <>
          <IconButton type='button' aria-label='放大' onClick={zoomIn} disabled={!canZoomIn}>
            <ZoomInIcon />
          </IconButton>
          <IconButton type='button' aria-label='缩小' onClick={zoomOut} disabled={!canZoomOut}>
            <ZoomOutIcon />
          </IconButton>
          <IconButton type='button' aria-label='重置缩放' onClick={resetZoom}>
            <ResetIcon />
          </IconButton>
        </>
      )}
      {allowRotate && (
        <IconButton type='button' aria-label='旋转图片' onClick={rotate}>
          <RotateIcon />
        </IconButton>
      )}
      {allowDownload && (
        <IconButton type='button' aria-label='下载图片' onClick={performDownload}>
          <DownloadIcon />
        </IconButton>
      )}
      {allowFullscreen && (
        <IconButton type='button' aria-label={isNativeFullscreen ? '退出全屏' : '进入全屏'} onClick={toggleFullscreen}>
          {isNativeFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
        </IconButton>
      )}
    </Toolbar>
  )

  const metaAuthor = (() => {
    const candidate = (currentItem?.meta as { author?: string } | undefined)?.author
    return typeof candidate === 'string' ? candidate : undefined
  })()
  const subtitleText = metaAuthor ?? '按 ←/→ 切换 · ESC 关闭'

  const surface = (
    <Backdrop ref={overlayRef} $open={open} $disableMotion={disableAnimation} onClick={handleOverlayClick} className={className} style={style} {...rest}>
      <PreviewContainer>
        <PreviewSurface $disableMotion={disableAnimation}>
          <Header>
            <Title>
              <TitleLabel>{currentItem?.title ?? '图片预览'}</TitleLabel>
              <Subtitle>{subtitleText}</Subtitle>
            </Title>
            {toolbarContent}
          </Header>
          <Content>
            <Viewport>
              {hint && <Hint>{hint}</Hint>}
              {hasItems ? (
                <ImageStage
                  ref={stageRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onWheel={handleWheel}
                  onDoubleClick={handleDoubleClick}
                  $dragging={isDragging}
                  $canPan={zoom > 1}
                >
                  <PreviewImage
                    src={currentItem?.src}
                    alt={currentItem?.alt ?? currentItem?.title ?? '图片预览'}
                    draggable={false}
                    $zoom={zoom}
                    $translateX={offset.x}
                    $translateY={offset.y}
                    $rotation={rotation}
                    $dragging={isDragging}
                    style={{ maxWidth: currentItem?.width ?? undefined, maxHeight: currentItem?.height ?? undefined }}
                  />
                </ImageStage>
              ) : (
                <EmptyState>
                  <p>暂无可预览图片</p>
                </EmptyState>
              )}
            </Viewport>
          </Content>
          <Footer>
            <Caption>
              <span>{captionContent}</span>
              {hasItems && <Counter>{`${currentIndex + 1} / ${total}`}</Counter>}
            </Caption>
            {thumbnails}
            {allowKeyboard && <KeyboardLegend>←/→ 导航 · 空格下一张 · ESC 关闭</KeyboardLegend>}
          </Footer>
        </PreviewSurface>
      </PreviewContainer>
    </Backdrop>
  )

  if (!mounted) return null

  return createPortal(surface, document.body)
})

ImagePreview.displayName = 'ImagePreview'

export default ImagePreview
