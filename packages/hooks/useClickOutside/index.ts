import type { RefObject } from 'react'
import { useEventListener } from '../useEventListener'

export type ClickOutsideEvent = 'pointerdown' | 'mousedown' | 'click'

export interface UseClickOutsideOptions {
  /** 条件挂载：false 时不监听（对齐「弹层开态才收外点」的调用点语义） */
  enabled?: boolean
  /** 触发事件类型，默认 pointerdown */
  event?: ClickOutsideEvent
  /** 捕获阶段监听，默认 false */
  capture?: boolean
}

// 外点收起原语（对应 ahooks useClickAway 的收敛版）：事件目标不在 ref 元素内即回调。
// 监听挂在 document 冒泡阶段；ref.current 为空（未挂载/已卸载）时不触发。
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onTrigger: (event: PointerEvent | MouseEvent) => void,
  options: UseClickOutsideOptions = {}
): void => {
  const { enabled = true, event = 'pointerdown', capture = false } = options

  useEventListener(
    event,
    (nativeEvent: Event) => {
      const element = ref.current
      if (!element) return
      if (!element.contains(nativeEvent.target as Node)) {
        onTrigger(nativeEvent as PointerEvent | MouseEvent)
      }
    },
    'document',
    { enabled, capture }
  )
}

export default useClickOutside
