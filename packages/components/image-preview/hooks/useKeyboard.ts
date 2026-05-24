import * as React from 'react'

export const useKeyboard = (
  open: boolean,
  closeOnEsc: boolean,
  allowKeyboard: boolean,
  handleClose: () => void,
  goNext: () => void,
  goPrevious: () => void,
) => {
  React.useEffect(() => {
    if (!closeOnEsc || !open) return
    const handleKeydown = (event: KeyboardEvent) => {
      if (!allowKeyboard) return
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrevious()
      } else if (event.key === ' ') {
        event.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [open, closeOnEsc, allowKeyboard, handleClose, goNext, goPrevious])
}
