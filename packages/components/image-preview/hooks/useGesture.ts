import * as React from 'react'

type PointerState = {
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
}

export const useGesture = (options: {
  allowZoom: boolean
  allowGesture: boolean
  zoom: number
  zoomIndex: number
  sanitizedZoomSteps: number[]
  offset: { x: number; y: number }
  swipeOffsetX: number
  setZoomIndex: React.Dispatch<React.SetStateAction<number>>
  setOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
  setDismissOffset: React.Dispatch<React.SetStateAction<number>>
  setIsDismissing: React.Dispatch<React.SetStateAction<boolean>>
  setSwipeOffsetX: React.Dispatch<React.SetStateAction<number>>
  goNext: () => void
  goPrevious: () => void
  handleClose: () => void
  zoomIn: () => void
  resetZoom: () => void
}) => {
  const {
    allowZoom, allowGesture, zoom, zoomIndex, sanitizedZoomSteps,
    offset, swipeOffsetX,
    setZoomIndex, setOffset, setIsDragging,
    setDismissOffset, setIsDismissing, setSwipeOffsetX,
    goNext, goPrevious, handleClose, zoomIn, resetZoom,
  } = options

  const stageRef = React.useRef<HTMLDivElement | null>(null)
  const doubleTapRef = React.useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 })

  const pointerState = React.useRef<PointerState>({
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

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

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

  return { stageRef, handlePointerDown, handlePointerMove, handlePointerUp }
}
