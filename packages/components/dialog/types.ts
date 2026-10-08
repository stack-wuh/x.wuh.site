import * as React from 'react'

export type FooterRenderer = (helpers: { close: () => void }) => React.ReactNode

export type DialogControlBridge = {
  openDialog?: () => void
  closeDialog?: () => void
  toggleDialog?: () => void
  setOpen?: (value: boolean | ((prev: boolean) => boolean)) => void
  bind?: unknown
}

export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, DialogControlBridge {
  open: boolean
  onClose?: () => void
  title?: React.ReactNode
  subtitle?: React.ReactNode
  footer?: React.ReactNode | FooterRenderer
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  lockScroll?: boolean
  fullScreen?: boolean
  placement?: 'center' | 'bottom'
  width?: number | string
  height?: number | string
  zIndex?: number
  hideCloseButton?: boolean
  disableAnimation?: boolean
  /** 'paper' = 纸张风：发丝线边框 + soft 阴影 + base 圆角 + Header 渐隐墨线；默认 'default' 零变更 */
  variant?: 'default' | 'paper'
}
