'use client'

import * as React from 'react'
import { useKeyPress } from '@wuh.site/hooks/useKeyPress'
import { useScrollLock } from '@wuh.site/hooks/useScrollLock'
import { BREAKPOINTS } from '../themes/breakpoints'
import { useLocale } from '@wuh.site/components/locales'
import {
  Barrier,
  DialogSurface,
  DialogHeader,
  DialogHeaderContent,
  DialogTitle,
  DialogSubtitle,
  CloseButton,
  DialogBody,
  DialogFooter,
  DragHandle,
} from './styles'
import type { DialogProps, FooterRenderer } from './types'

export type { DialogControlBridge, DialogProps, FooterRenderer } from './types'

/** surface 内可聚焦元素（焦点陷阱循环序列用） */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, ref) {
  const {
    open,
    onClose,
    title,
    subtitle,
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
    variant = 'default',
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

  const { t } = useLocale()
  const titleId = React.useId()
  const descriptionId = React.useId()
  const internalRef = React.useRef<HTMLDivElement>(null)
  const [closing, setClosing] = React.useState(false)
  // 打开前的触发元素（关闭后焦点归还，审计 P1-19）
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  // placement 固定 'center' 起始（与 SSR 一致，避免 hydration mismatch，P1-19）；
  // 显式 placement 两端一致直接用；响应式判定在 effect 后求值（不参与 hydration 比对）
  const [responsivePlacement, setResponsivePlacement] = React.useState<'center' | 'bottom'>('center')
  const derivedPlacement = placement ?? responsivePlacement

  React.useEffect(() => {
    if (placement) return
    const mq = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile}px)`)
    const update = () => setResponsivePlacement(mq.matches ? 'bottom' : 'center')
    update()
    // MediaQueryList 用 onchange 属性订阅（元素事件才归 useEventListener 管辖）
    mq.onchange = update
    return () => {
      mq.onchange = null
    }
  }, [placement])

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

  // Escape 关闭：开态才挂载监听；preventDefault 由 hook 先行，再停传播、走统一关闭
  useKeyPress(
    'Escape',
    (event) => {
      event.stopPropagation()
      handleClose()
    },
    { enabled: open && closeOnEsc, preventDefault: true }
  )

  // 弹层滚动锁：fixed 配方（body 四值暂存 + 位置补偿），开态才锁、关态对称还原
  useScrollLock(open && lockScroll)

  React.useEffect(() => {
    if (open && internalRef.current) {
      // 记录触发元素（关闭后归还）；surface 初始聚焦
      previousFocusRef.current = document.activeElement as HTMLElement | null
      internalRef.current.focus({ preventScroll: true })
    }
    if (!open && !closing) {
      // 关闭完成：焦点归还触发元素（审计 P1-19）
      previousFocusRef.current?.focus({ preventScroll: true })
      previousFocusRef.current = null
    }
  }, [open, closing])

  // 焦点陷阱：Tab 在 surface 内循环，不穿透到背景页（审计 P1-19）
  const handleTabTrap = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key !== 'Tab' || !internalRef.current) return
    const focusables = Array.from(
      internalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => el.offsetParent !== null || el === document.activeElement)
    if (focusables.length === 0) {
      event.preventDefault()
      internalRef.current.focus({ preventScroll: true })
      return
    }
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement as HTMLElement | null
    if (event.shiftKey) {
      if (active === first || active === internalRef.current) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      }
    } else if (active === last || active === internalRef.current) {
      event.preventDefault()
      first.focus({ preventScroll: true })
    }
  }, [])

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
        onKeyDown={handleTabTrap}
        $fullScreen={fullScreen}
        $placement={derivedPlacement}
        $width={width}
        $height={height}
        $disableAnimation={disableAnimation}
        $closing={closing}
        $variant={variant}
        className={className}
        style={style}
        onAnimationEnd={handleAnimationEnd}
        {...rest}
      >
        {derivedPlacement === 'bottom' && !fullScreen && <DragHandle />}
        {title && (
          <DialogHeader $variant={variant}>
            <DialogHeaderContent>
              <DialogTitle id={titleId}>{title}</DialogTitle>
              {subtitle && <DialogSubtitle>{subtitle}</DialogSubtitle>}
            </DialogHeaderContent>
            {!hideCloseButton && (
              <CloseButton type="button" aria-label={t('components.dialog.close')} onClick={handleClose}>
                ×
              </CloseButton>
            )}
          </DialogHeader>
        )}
        <DialogBody id={descriptionId} $variant={variant}>{children}</DialogBody>
        {resolvedFooter && <DialogFooter>{resolvedFooter}</DialogFooter>}
      </DialogSurface>
    </Barrier>
  )
})

export default Dialog
