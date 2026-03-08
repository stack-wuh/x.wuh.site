import { useCallback, useState } from 'react'

export interface UseImagePreviewOptions {
  defaultOpen?: boolean
  defaultIndex?: number
  loop?: boolean
  itemCount?: number
  onOpenChange?: (open: boolean) => void
  onIndexChange?: (index: number) => void
}

export interface UseImagePreviewReturn {
  open: boolean
  index: number
  openPreview: (index?: number) => void
  closePreview: () => void
  togglePreview: () => void
  next: (total?: number) => void
  previous: (total?: number) => void
  setIndex: (value: number | ((prev: number) => number)) => void
  bind: {
    open: boolean
    currentIndex: number
    onClose: () => void
    onIndexChange: (nextIndex: number) => void
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const useImagePreview = (options: UseImagePreviewOptions = {}): UseImagePreviewReturn => {
  const { defaultOpen = false, defaultIndex = 0, loop = false, itemCount, onOpenChange, onIndexChange } = options
  const [open, setOpen] = useState(defaultOpen)
  const [index, setIndexState] = useState(defaultIndex)

  const setIndex = useCallback(
    (value: number | ((prev: number) => number)) => {
      setIndexState((prev) => {
        const resolved = typeof value === 'function' ? (value as (prevState: number) => number)(prev) : value
        const upperBound = typeof itemCount === 'number' && itemCount > 0 ? itemCount - 1 : undefined
        const next = upperBound !== undefined ? clamp(resolved, 0, upperBound) : resolved
        if (next !== prev) {
          onIndexChange?.(next)
        }
        return next
      })
    },
    [itemCount, onIndexChange]
  )

  const openPreview = useCallback(
    (targetIndex?: number) => {
      if (typeof targetIndex === 'number') {
        setIndex(targetIndex)
      }
      setOpen((prev) => {
        if (!prev) {
          onOpenChange?.(true)
        }
        return true
      })
    },
    [setIndex, onOpenChange]
  )

  const closePreview = useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        onOpenChange?.(false)
      }
      return false
    })
  }, [onOpenChange])

  const togglePreview = useCallback(() => {
    setOpen((prev) => {
      const next = !prev
      onOpenChange?.(next)
      return next
    })
  }, [onOpenChange])

  const next = useCallback(
    (total = itemCount) => {
      setIndex((prev) => {
        if (typeof total === 'number' && total > 0) {
          const candidate = prev + 1
          if (candidate >= total) {
            return loop ? 0 : total - 1
          }
          return candidate
        }
        return prev + 1
      })
    },
    [itemCount, loop, setIndex]
  )

  const previous = useCallback(
    (total = itemCount) => {
      setIndex((prev) => {
        if (typeof total === 'number' && total > 0) {
          const candidate = prev - 1
          if (candidate < 0) {
            return loop ? Math.max(total - 1, 0) : 0
          }
          return candidate
        }
        return prev - 1
      })
    },
    [itemCount, loop, setIndex]
  )

  return {
    open,
    index,
    openPreview,
    closePreview,
    togglePreview,
    next,
    previous,
    setIndex,
    bind: {
      open,
      currentIndex: index,
      onClose: closePreview,
      onIndexChange: (nextIndex: number) => setIndex(nextIndex),
    },
  }
}

export default useImagePreview
