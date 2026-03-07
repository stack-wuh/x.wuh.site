import { useCallback, useState } from 'react'

export interface UseDialogOptions {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface UseDialogReturn {
  open: boolean
  openDialog: () => void
  closeDialog: () => void
  toggleDialog: () => void
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void
  bind: {
    open: boolean
    onClose: () => void
  }
}

export const useDialog = (options: UseDialogOptions = {}): UseDialogReturn => {
  const { defaultOpen = false, onOpenChange } = options
  const [open, setState] = useState(defaultOpen)

  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setState((prev) => {
        const next = typeof value === 'function' ? (value as (prevState: boolean) => boolean)(prev) : value
        if (next !== prev) {
          onOpenChange?.(next)
        }
        return next
      })
    },
    [onOpenChange]
  )

  const openDialog = useCallback(() => setOpen(true), [setOpen])
  const closeDialog = useCallback(() => setOpen(false), [setOpen])
  const toggleDialog = useCallback(() => setOpen((prev) => !prev), [setOpen])

  return {
    open,
    openDialog,
    closeDialog,
    toggleDialog,
    setOpen,
    bind: {
      open,
      onClose: closeDialog,
    },
  }
}

export default useDialog
