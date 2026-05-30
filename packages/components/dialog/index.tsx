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
  DragHandle,
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
  open: boolean
  onClose?: () => void
  title?: React.ReactNode
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
}

function resolvePlacement(
  placement: DialogProps['placement'],
): 'center' | 'bottom' {
  if (placement) return placement
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches) {
    return 'bottom'
  }
  return 'center'
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
    placement,
    width = 'min(480px, calc(100vw - 32px))',
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
  } = props
  void _openDialog
  void _toggleDialog
  void _bind

  const titleId = React.useId()
  const descriptionId = React.useId()
  const internalRef = React.useRef<HTMLDivElement>(null)
  const [closing, setClosing] = React.useState(false)

  const derivedPlacement = React.useMemo(
    () => resolvePlacement(placement),
    [placement, open],
  )

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node ?? null
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    },
    [ref],
  )

  const handleClose = React.useCallback(() => {
    if (disableAnimation) {
      onClose?.()
      if (!onClose) {
        if (typeof closeDialogProp === 'function') {
          closeDialogProp()
        } else if (typeof setOpenProp === 'function') {
          setOpenProp(false)
        }
      }
      return
    }
    setClosing(true)
  }, [disableAnimation, onClose, closeDialogProp, setOpenProp])

  const handleAnimationEnd = React.useCallback(() => {
    if (!closing) return
    setClosing(false)
    onClose?.()
    if (!onClose) {
      if (typeof closeDialogProp === 'function') {
        closeDialogProp()
      } else if (typeof setOpenProp === 'function') {
        setOpenProp(false)
      }
    }
  }, [closing, onClose, closeDialogProp, setOpenProp])

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
    const scrollY = window.scrollY
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = originalWidth
      window.scrollTo(0, scrollY)
    }
  }, [open, lockScroll])

  React.useEffect(() => {
    if (open && internalRef.current) {
      internalRef.current.focus({ preventScroll: true })
    }
  }, [open])

  // Reset closing state when dialog re-opens
  React.useEffect(() => {
    if (open) setClosing(false)
  }, [open])

  if (!open && !closing) return null

  const resolvedFooter =
    typeof footer === 'function' ? (footer as FooterRenderer)({ close: handleClose }) : footer

  return (
    <Barrier
      $zIndex={zIndex}
      $fullScreen={fullScreen}
      $closing={closing}
      $placement={derivedPlacement}
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
        $placement={derivedPlacement}
        $width={width}
        $height={height}
        $disableAnimation={disableAnimation}
        $closing={closing}
        className={className}
        style={style}
        onAnimationEnd={handleAnimationEnd}
        {...rest}
      >
        {derivedPlacement === 'bottom' && !fullScreen && <DragHandle />}
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
        <DialogBody id={descriptionId}>{children}</DialogBody>
        {resolvedFooter && <DialogFooter>{resolvedFooter}</DialogFooter>}
      </DialogSurface>
    </Barrier>
  )
})

export default Dialog
