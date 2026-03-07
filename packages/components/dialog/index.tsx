'use client'

import * as React from 'react'
import styled, { css, keyframes } from 'styled-components'

const enterAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

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

const Barrier = styled.div<{ $zIndex: number; $fullScreen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex }) => $zIndex};
  display: flex;
  align-items: ${({ $fullScreen }) => ($fullScreen ? 'stretch' : 'center')};
  justify-content: center;
  padding: ${({ $fullScreen }) => ($fullScreen ? '0' : 'clamp(16px, 4vw, 48px)')};
  pointer-events: auto;
  background: transparent;
`

const dialogSurfaceBase = css<{ $fullScreen: boolean; $width: number | string; $height?: number | string; $disableAnimation: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${({ $width, $fullScreen }) => ($fullScreen ? '100vw' : typeof $width === 'number' ? `${$width}px` : $width)};
  height: ${({ $height, $fullScreen }) => {
    if ($fullScreen) return '100vh'
    if (!$height) return 'auto'
    return typeof $height === 'number' ? `${$height}px` : $height
  }};
  max-height: ${({ $fullScreen }) => ($fullScreen ? '100vh' : 'calc(100vh - 80px)')};
  border-radius: ${({ $fullScreen }) => ($fullScreen ? '0' : '16px')};
  background-color: var(--background-100, #fff);
  color: var(--text-primary, #0f172a);
  box-shadow: ${({ $fullScreen }) => ($fullScreen ? 'none' : '0 24px 80px rgba(15, 23, 42, 0.25)')};
  border: 1px solid var(--normal-200, rgba(15, 23, 42, 0.08));
  outline: none;
  pointer-events: auto;
  overflow: hidden;
  backdrop-filter: ${({ $fullScreen }) => ($fullScreen ? 'none' : 'blur(0px)')};

  @media (prefers-color-scheme: dark) {
    background-color: var(--normal-900, rgba(15, 23, 42, 0.95));
    border-color: var(--normal-700, rgba(148, 163, 184, 0.4));
    color: var(--text-primary, #f8fafc);
  }

  ${({ $disableAnimation }) =>
    !$disableAnimation &&
    css`
      animation: ${enterAnimation} 180ms ease forwards;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}
`

const DialogSurface = styled.div<{ $fullScreen: boolean; $width: number | string; $height?: number | string; $disableAnimation: boolean }>`
  ${dialogSurfaceBase}
`

const DialogHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md, 16px);
  padding: var(--space-lg, 24px) var(--space-xl, 32px) var(--space-md, 16px);
  border-bottom: 1px solid var(--normal-200, rgba(15, 23, 42, 0.08));

  @media (prefers-color-scheme: dark) {
    border-bottom-color: var(--normal-700, rgba(148, 163, 184, 0.3));
  }
`

const DialogTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-xl, 20px);
  font-weight: 600;
  color: inherit;
`

const CloseButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-secondary, #475569);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: var(--background-200, rgba(15, 23, 42, 0.04));
    color: var(--text-primary, #0f172a);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color, #2563eb);
    outline-offset: 2px;
  }
`

const DialogBody = styled.div`
  flex: 1;
  padding: var(--space-lg, 24px) var(--space-xl, 32px);
  overflow-y: auto;
  color: inherit;

  @media (max-width: 640px) {
    padding: 20px;
  }
`

const DialogFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-sm, 12px);
  padding: var(--space-md, 16px) var(--space-xl, 32px);
  border-top: 1px solid var(--normal-200, rgba(15, 23, 42, 0.08));
  background: var(--background-100, #fff);

  @media (prefers-color-scheme: dark) {
    border-top-color: var(--normal-700, rgba(148, 163, 184, 0.3));
    background: var(--normal-900, #0f172a);
  }
`

export default Dialog
