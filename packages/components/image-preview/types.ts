import type * as React from 'react'

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
  onDownload?: (index: number, item: ImagePreviewItem) => void
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
