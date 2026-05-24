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
  MobileNavArrow,
  MoreMenuContainer,
  MoreMenuItem,
  MoreMenuOverlay,
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
import {
  IconClose,
  IconArrowLeft,
  IconArrowRight,
  IconZoomIn,
  IconZoomOut,
  IconRotate,
  IconDownload,
  IconFullscreen,
  IconExitFullscreen,
  IconReset,
  IconMore,
  IconRotateRight
} from '../icons'

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
  onDownload?: (index: number, item: ImagePreviewItem) => void,
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

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

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
  const [dismissOffset, setDismissOffset] = React.useState(0)
  const [isDismissing, setIsDismissing] = React.useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false)
  const [swipeOffsetX, setSwipeOffsetX] = React.useState(0)
  const isMobile = useMediaQuery('(max-width: 767px)')

  const overlayRef = React.useRef<HTMLDivElement | null>(null)
  const stageRef = React.useRef<HTMLDivElement | null>(null)
  const previousOpen = usePrevious(open)
  const doubleTapRef = React.useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 })
  const pointerState = React.useRef<{
    pointers: Map<number, { clientX: number; clientY: number }>
    initialDistance: number
    initialZoomIndex: number
    startOffsetX: number
    startOffsetY: number
    swipeStartX: number
    swipeStartY: number
    isSwiping: boolean
    isDismissing: boolean
    isPanning: boolean
    isPinching: boolean
  }>({
    pointers: new Map(),
    initialDistance: 0,
    initialZoomIndex: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    swipeStartX: 0,
    swipeStartY: 0,
    isSwiping: false,
    isDismissing: false,
    isPanning: false,
    isPinching: false,
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
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = original
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
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
      setDismissOffset(0)
      setIsDismissing(false)
      setSwipeOffsetX(0)
      setMoreMenuOpen(false)
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
    setDismissOffset(0)
    setIsDismissing(false)
    setSwipeOffsetX(0)
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

  const handleMoreMenuClose = React.useCallback(() => setMoreMenuOpen(false), [])

  const handleMoreMenuSelect = React.useCallback((action: () => void) => {
    action()
    setMoreMenuOpen(false)
  }, [])

  const handleDoubleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!allowZoom) return
    if (canZoomIn) {
      zoomIn()
    } else {
      resetZoom()
    }
  }

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

    const state = pointerState.current
    state.pointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY })

    if (state.pointers.size === 2) {
      const pts = Array.from(state.pointers.values())
      state.initialDistance = Math.hypot(pts[1].clientX - pts[0].clientX, pts[1].clientY - pts[0].clientY)
      state.initialZoomIndex = zoomIndex
      state.isPinching = true
      state.isSwiping = false
      state.isDismissing = false
      state.isPanning = false
      setIsDragging(false)
      return
    }

    if (state.pointers.size === 1) {
      if (zoom > 1) {
        state.isPanning = true
        state.startOffsetX = offset.x
        state.startOffsetY = offset.y
        state.swipeStartX = event.clientX
        state.swipeStartY = event.clientY
        setIsDragging(true)
      } else if (allowGesture && event.pointerType !== 'mouse') {
        state.isSwiping = true
        state.swipeStartX = event.clientX
        state.swipeStartY = event.clientY
        state.startOffsetX = swipeOffsetX
      }
    }
  }

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const state = pointerState.current
    if (!state.pointers.has(event.pointerId)) return

    state.pointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY })

    if (state.isPinching && state.pointers.size === 2) {
      const pts = Array.from(state.pointers.values())
      const currentDistance = Math.hypot(pts[1].clientX - pts[0].clientX, pts[1].clientY - pts[0].clientY)
      if (state.initialDistance > 0) {
        const scale = currentDistance / state.initialDistance
        const baseZoom = sanitizedZoomSteps[state.initialZoomIndex] ?? 1
        const targetZoom = baseZoom * scale
        const minZ = sanitizedZoomSteps[0]
        const maxZ = sanitizedZoomSteps[sanitizedZoomSteps.length - 1]
        const clamped = clamp(targetZoom, minZ, maxZ)
        let nearestIdx = 0
        let minDiff = Infinity
        for (let i = 0; i < sanitizedZoomSteps.length; i++) {
          const diff = Math.abs(sanitizedZoomSteps[i] - clamped)
          if (diff < minDiff) {
            minDiff = diff
            nearestIdx = i
          }
        }
        setZoomIndex(nearestIdx)
      }
      return
    }

    if (state.isPanning) {
      const deltaX = event.clientX - state.swipeStartX
      const deltaY = event.clientY - state.swipeStartY
      setOffset({ x: state.startOffsetX + deltaX, y: state.startOffsetY + deltaY })
      return
    }

    if (state.isSwiping) {
      const deltaX = event.clientX - state.swipeStartX
      const deltaY = event.clientY - state.swipeStartY
      if (state.isDismissing) {
        setDismissOffset(Math.max(0, deltaY))
        setIsDismissing(true)
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        state.isDismissing = true
        setDismissOffset(Math.max(0, deltaY))
        setIsDismissing(true)
      } else {
        setSwipeOffsetX(deltaX)
      }
    }
  }

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const state = pointerState.current
    state.pointers.delete(event.pointerId)

    if (state.isPinching && state.pointers.size < 2) {
      state.isPinching = false
      return
    }

    if (state.isPanning) {
      setIsDragging(false)
      state.isPanning = false
    }

    if (state.isSwiping || state.isDismissing) {
      const deltaX = event.clientX - state.swipeStartX
      const deltaY = event.clientY - state.swipeStartY

      if (state.isDismissing) {
        if (deltaY > 80) {
          handleClose()
          return
        }
        setDismissOffset(0)
        setIsDismissing(false)
      } else if (Math.abs(deltaX) > 45) {
        if (deltaX > 0) {
          goPrevious()
        } else {
          goNext()
        }
      }

      setSwipeOffsetX(0)
      state.isSwiping = false
      state.isDismissing = false
    }

    if (event.pointerType === 'touch' && state.pointers.size === 0) {
      const now = Date.now()
      const dt = now - doubleTapRef.current.time
      const dx = Math.abs(event.clientX - doubleTapRef.current.x)
      const dy = Math.abs(event.clientY - doubleTapRef.current.y)
      if (dt < 300 && dx < 30 && dy < 30) {
        if (allowZoom) {
          if (zoomIndex > 0) {
            resetZoom()
          } else {
            zoomIn()
          }
        }
        doubleTapRef.current = { time: 0, x: 0, y: 0 }
      } else {
        doubleTapRef.current = { time: now, x: event.clientX, y: event.clientY }
      }
    }

    if (stageRef.current && state.pointers.size === 0) {
      stageRef.current.releasePointerCapture(event.pointerId)
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

  const toolbarContent = renderToolbar ? renderToolbar(toolbarProps) : isMobile ? (
    <Toolbar>
      <IconButton type='button' aria-label='关闭预览' onClick={handleClose}>
        <IconClose />
      </IconButton>
      <IconButton type='button' aria-label='上一张' onClick={goPrevious}>
        <IconArrowLeft />
      </IconButton>
      <IconButton type='button' aria-label='下一张' onClick={goNext}>
        <IconArrowRight />
      </IconButton>
      {(allowZoom || allowRotate || allowDownload || allowFullscreen) && (
        <IconButton type='button' aria-label='更多操作' onClick={() => setMoreMenuOpen(true)}>
          <IconMore />
        </IconButton>
      )}
    </Toolbar>
  ) : (
    <Toolbar>
      <IconButton type='button' aria-label='关闭预览' onClick={handleClose}>
        <IconClose />
      </IconButton>
      <IconButton type='button' aria-label='上一张' onClick={goPrevious}>
        <IconArrowLeft />
      </IconButton>
      <IconButton type='button' aria-label='下一张' onClick={goNext}>
        <IconArrowRight />
      </IconButton>
      {allowZoom && (
        <>
          <IconButton type='button' aria-label='放大' onClick={zoomIn} disabled={!canZoomIn}>
            <IconZoomIn />
          </IconButton>
          <IconButton type='button' aria-label='缩小' onClick={zoomOut} disabled={!canZoomOut}>
            <IconZoomOut />
          </IconButton>
          <IconButton type='button' aria-label='重置缩放' onClick={resetZoom}>
            <IconReset />
          </IconButton>
        </>
      )}
      {allowRotate && (
        <IconButton type='button' aria-label='旋转图片' onClick={rotate}>
          <IconRotateRight />
        </IconButton>
      )}
      {allowDownload && (
        <IconButton type='button' aria-label='下载图片' onClick={performDownload}>
          <IconDownload />
        </IconButton>
      )}
      {allowFullscreen && (
        <IconButton type='button' aria-label={isNativeFullscreen ? '退出全屏' : '进入全屏'} onClick={toggleFullscreen}>
          {isNativeFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
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
    <Backdrop
      ref={overlayRef}
      $open={open}
      $disableMotion={disableAnimation}
      onClick={handleOverlayClick}
      className={className}
      style={{
        ...style,
        touchAction: 'none',
        overscrollBehavior: 'contain',
        opacity: isDismissing ? Math.max(0, 1 - dismissOffset / 300) : undefined,
      }}
      {...rest}
    >
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
                <>
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
                      $swipeX={swipeOffsetX}
                      $dismissY={dismissOffset}
                      style={isMobile ? undefined : { maxWidth: currentItem?.width ?? undefined, maxHeight: currentItem?.height ?? undefined }}
                    />
                  </ImageStage>
                  {isMobile && hasItems && total > 1 && (
                    <>
                      <MobileNavArrow $side='left' onClick={goPrevious} aria-label='上一张'>
                        <IconArrowLeft />
                      </MobileNavArrow>
                      <MobileNavArrow $side='right' onClick={goNext} aria-label='下一张'>
                        <IconArrowRight />
                      </MobileNavArrow>
                    </>
                  )}
                </>
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
            {allowKeyboard && !isMobile && <KeyboardLegend>←/→ 导航 · 空格下一张 · ESC 关闭</KeyboardLegend>}
          </Footer>
        </PreviewSurface>
      </PreviewContainer>
    </Backdrop>
  )

  const moreMenu = isMobile && moreMenuOpen ? (
    <MoreMenuOverlay onClick={handleMoreMenuClose}>
      <MoreMenuContainer onClick={(e) => e.stopPropagation()}>
        {allowZoom && (
          <>
            <MoreMenuItem onClick={() => handleMoreMenuSelect(zoomIn)}>
              <IconZoomIn /> 放大
            </MoreMenuItem>
            <MoreMenuItem onClick={() => handleMoreMenuSelect(zoomOut)}>
              <IconZoomOut /> 缩小
            </MoreMenuItem>
            <MoreMenuItem onClick={() => handleMoreMenuSelect(resetZoom)}>
              <IconReset /> 重置缩放
            </MoreMenuItem>
          </>
        )}
        {allowRotate && (
          <MoreMenuItem onClick={() => handleMoreMenuSelect(rotate)}>
            <IconRotate /> 旋转
          </MoreMenuItem>
        )}
        {allowDownload && (
          <MoreMenuItem onClick={() => handleMoreMenuSelect(performDownload)}>
            <IconDownload /> 下载
          </MoreMenuItem>
        )}
        {allowFullscreen && (
          <MoreMenuItem onClick={() => handleMoreMenuSelect(toggleFullscreen)}>
            {isNativeFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
            {isNativeFullscreen ? '退出全屏' : '全屏'}
          </MoreMenuItem>
        )}
      </MoreMenuContainer>
    </MoreMenuOverlay>
  ) : null

  const portalContent = (
    <>
      {surface}
      {moreMenu}
    </>
  )

  if (!mounted) return null

  return createPortal(portalContent, document.body)
})

ImagePreview.displayName = 'ImagePreview'

export default ImagePreview
