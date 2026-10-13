import { useKeyPress } from '@wuh.site/hooks/useKeyPress'

export const useKeyboard = (
  open: boolean,
  closeOnEsc: boolean,
  allowKeyboard: boolean,
  handleClose: () => void,
  goNext: () => void,
  goPrevious: () => void,
) => {
  // 原实现监听仅挂 open && closeOnEsc，导航键也因此受 closeOnEsc 门控（历史耦合，按等价保留）
  const enabled = open && closeOnEsc

  // preventDefault 只在 allowKeyboard 命中分支执行（与原实现逐分支顺序一致）
  const withKeyboard = (action: () => void) => (event: KeyboardEvent) => {
    if (!allowKeyboard) return
    event.preventDefault()
    action()
  }

  useKeyPress('Escape', withKeyboard(handleClose), { enabled })
  useKeyPress('ArrowRight', withKeyboard(goNext), { enabled })
  useKeyPress('ArrowLeft', withKeyboard(goPrevious), { enabled })
  useKeyPress('Space', withKeyboard(goNext), { enabled })
}
