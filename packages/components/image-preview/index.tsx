'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

import {
  Backdrop,
  Caption,
  Content,
  Counter,
  EmptyState,
  Footer,
  Header,
  Hint,
  ImageStage,
  KeyboardLegend,
  MobileNavArrow,
  PreviewContainer,
  PreviewSurface,
  Subtitle,
  Title,
  TitleLabel,
  Viewport,
} from './styles'
import {
  IconArrowLeft,
  IconArrowRight,
} from '../icons'

export type { ImagePreviewItem, ImagePreviewProps, ThumbnailRenderProps, ToolbarRenderProps } from './specs'
import type { ImagePreviewItem, ImagePreviewProps, ToolbarRenderProps } from './specs'

import { useControllableState } from './hooks/useControllableState'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useLockScroll } from './hooks/useLockScroll'
import { useKeyboard } from './hooks/useKeyboard'
import { useGesture } from './hooks/useGesture'
import { ImagePreviewToolbar } from './Toolbar'
import { MoreMenu } from './MoreMenu'
import { ImagePreviewThumbnails } from './ThumbnailRail'

const DEFAULT_ZOOM_STEPS = [1, 2, 4]

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const usePrevious = <T,>(value: T) => {
  const ref = React.useRef<T>(value)
  React.useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
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
    lockScroll: lockScrollProp = true,
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
  const previousOpen = usePrevious(open)
  const swipeDirection = React.useRef(0)

  const total = items.length
  const hasItems = total > 0
  const currentItem = hasItems ? items[clamp(currentIndex, 0, total - 1)] : undefined
  const zoom = sanitizedZoomSteps[clamp(zoomIndex, 0, sanitizedZoomSteps.length - 1)] ?? 1
  const canZoomIn = zoomIndex < sanitizedZoomSteps.length - 1
  const canZoomOut = zoomIndex > 0

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  useLockScroll(open, lockScrollProp)

  const handleClose = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const goNext = React.useCallback(() => {
    if (!hasItems) return
    swipeDirection.current = 1
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
    swipeDirection.current = -1
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
      swipeDirection.current = index > currentIndex ? 1 : -1
      setCurrentIndex(clamp(index, 0, total - 1))
    },
    [hasItems, total, currentIndex, setCurrentIndex]
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

  const { stageRef, handlePointerDown, handlePointerMove, handlePointerUp } = useGesture({
    allowZoom,
    allowGesture,
    zoom,
    zoomIndex,
    sanitizedZoomSteps,
    offset,
    swipeOffsetX,
    setZoomIndex,
    setOffset,
    setIsDragging,
    setDismissOffset,
    setIsDismissing,
    setSwipeOffsetX,
    goNext,
    goPrevious,
    handleClose,
    zoomIn,
    resetZoom,
  })

  useKeyboard(open, closeOnEsc, allowKeyboard, handleClose, goNext, goPrevious)

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

  const metaAuthor = (() => {
    const candidate = (currentItem?.meta as { author?: string } | undefined)?.author
    return typeof candidate === 'string' ? candidate : undefined
  })()
  const subtitleText = metaAuthor ?? '按 ←/→ 切换 · ESC 关闭'

  return createPortal(
    <>
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
              {renderToolbar ? (
                renderToolbar(toolbarProps)
              ) : (
                <ImagePreviewToolbar
                  {...toolbarProps}
                  isMobile={isMobile}
                  allowZoom={allowZoom}
                  allowRotate={allowRotate}
                  allowDownload={allowDownload}
                  allowFullscreen={allowFullscreen}
                  onMoreClick={() => setMoreMenuOpen(true)}
                />
              )}
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
                      <AnimatePresence mode='wait' custom={swipeDirection.current}>
                        <motion.img
                          key={currentItem?.src ?? 'empty'}
                          src={currentItem?.src}
                          alt={currentItem?.alt ?? currentItem?.title ?? '图片预览'}
                          draggable={false}
                          initial={{ opacity: 0, x: swipeDirection.current * 40 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            scale: zoom,
                            rotate: rotation,
                          }}
                          exit={{ opacity: 0, x: swipeDirection.current * 40 }}
                          transition={
                            isDragging
                              ? { duration: 0 }
                              : { type: 'spring', stiffness: 300, damping: 30 }
                          }
                          style={{
                            maxWidth: (!isMobile && currentItem?.width) ? currentItem.width : 'min(92vw, 1300px)',
                            maxHeight: (!isMobile && currentItem?.height) ? currentItem.height : '78vh',
                            objectFit: 'contain',
                            display: 'block',
                            x: offset.x + swipeOffsetX,
                            y: offset.y + dismissOffset,
                            filter: 'drop-shadow(0 25px 40px rgba(2, 6, 23, 0.55))',
                          }}
                        />
                      </AnimatePresence>
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
              {showThumbnails && (
                <ImagePreviewThumbnails
                  items={items}
                  currentIndex={currentIndex}
                  goTo={goTo}
                  renderThumbnail={renderThumbnail}
                />
              )}
              {allowKeyboard && !isMobile && <KeyboardLegend>←/→ 导航 · 空格下一张 · ESC 关闭</KeyboardLegend>}
            </Footer>
          </PreviewSurface>
        </PreviewContainer>
        {isMobile && (
          <MoreMenu
            open={moreMenuOpen}
            allowZoom={allowZoom}
            allowRotate={allowRotate}
            allowDownload={allowDownload}
            allowFullscreen={allowFullscreen}
            isNativeFullscreen={isNativeFullscreen}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            resetZoom={resetZoom}
            rotate={rotate}
            download={performDownload}
            toggleFullscreen={toggleFullscreen}
            onClose={() => setMoreMenuOpen(false)}
          />
        )}
      </Backdrop>
    </>,
    document.body
  )
})

ImagePreview.displayName = 'ImagePreview'

export default ImagePreview
