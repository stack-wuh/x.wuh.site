'use client'

import * as React from 'react'
import {
  Barrier,
  DialogSurface,
  DialogHeader,
  DialogTitle,
  CloseButton,
  DialogBody,
  DialogFooter,
} from './styles'

type FooterRenderer = (helpers: { close: () => void }) => React.ReactNode

type DialogControlBridge = {
  openDialog?: () => void
  closeDialog?: () => void
  toggleDialog?: () => void
  setOpen?: (value: boolean | ((prev: boolean) => boolean)) => void
  bind?: unknown
}

export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, DialogControlBridge {
  /** 是否展示 */
  open: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 标题 */
  title?: React.ReactNode
  /** 页脚：可以传自定义节点或函数（可拿到 close） */
  footer?: React.ReactNode | FooterRenderer
  /** 点击空白是否关闭，默认是 */
  closeOnOverlay?: boolean
  /** 是否允许 esc 关闭，默认是 */
  closeOnEsc?: boolean
  /** 打开时是否锁定 body 滚动，默认是 */
  lockScroll?: boolean
  /** 全屏显示 */
  fullScreen?: boolean
  /** 对话框宽度 */
  width?: number | string
  /** 对话框高度（非全屏可选） */
  height?: number | string
  /** 自定义 z-index */
  zIndex?: number
  /** 是否隐藏右上角关闭按钮 */
  hideCloseButton?: boolean
  /** 遵循 reduced-motion 时禁用动画 */
  disableAnimation?: boolean
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  const {
    open,
    onClose,
    title,
    children,
    footer,
    closeOnOverlay = true,
    closeOnEsc = true,
    lockScroll = true,
    fullScreen = false,
    width = 'min(640px, calc(100vw - 32px))',
    height,
    zIndex = 1200,
    hideCloseButton = false,
    disableAnimation = false,
    className,
    style,
    openDialog: _openDialog,
    toggleDialog: _toggleDialog,
    closeDialog: closeDialogProp,
    setOpen: setOpenProp,
    bind: _bind,
    ...rest
  } = props;
  void _openDialog;
  void _toggleDialog;
  void _bind;
  const titleId = React.useId()
  const descriptionId = React.useId()
  const internalRef = React.useRef<HTMLDivElement>(null)

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node ?? null
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    },
    [ref]
  )

  const handleClose = React.useCallback(() => {
    onClose?.()
    if (!onClose) {
      if (typeof closeDialogProp === 'function') {
        closeDialogProp()
      } else if (typeof setOpenProp === 'function') {
        setOpenProp(false)
      }
    }
  }, [onClose, closeDialogProp, setOpenProp])

  React.useEffect(() => {
    if (!open || !closeOnEsc) return

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [open, closeOnEsc])

  React.useEffect(() => {
    if (!open || !lockScroll || typeof document === 'undefined') return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open, lockScroll])

  React.useEffect(() => {
    if (open && internalRef.current) {
      internalRef.current.focus({ preventScroll: true })
    }
  }, [open])

  if (!open) return null

  const resolvedFooter = typeof footer === 'function' ? (footer as FooterRenderer)({ close: handleClose }) : footer

  return (
    <Barrier
      $zIndex={zIndex}
      $fullScreen={fullScreen}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && closeOnOverlay) {
          handleClose()
        }
      }}
    >
      <DialogSurface
        ref={setRefs}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={descriptionId}
        tabIndex={-1}
        $fullScreen={fullScreen}
        $width={width}
        $height={height}
        $disableAnimation={disableAnimation}
        className={className}
        style={style}
        {...rest}
      >
        {title && (
          <DialogHeader>
            <DialogTitle id={titleId}>{title}</DialogTitle>
            {!hideCloseButton && (
              <CloseButton type="button" aria-label="关闭" onClick={handleClose}>
                ×
              </CloseButton>
            )}
          </DialogHeader>
        )}
        <DialogBody id={descriptionId}>
          {children}
        </DialogBody>
        {resolvedFooter && <DialogFooter>{resolvedFooter}</DialogFooter>}
      </DialogSurface>
    </Barrier>
  )
})

export default Dialog
