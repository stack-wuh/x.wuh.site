import type { RefObject } from 'react'
import { useEventListener } from '../useEventListener'
import type { UseEventListenerOptions } from '../useEventListener'

export type KeyPressTarget = 'window' | 'document' | HTMLElement | RefObject<HTMLElement | null>

export interface UseKeyPressOptions extends Pick<UseEventListenerOptions, 'capture' | 'passive'> {
  /** 条件挂载：false 时不监听（对齐各调用点 `if (!open) return` 的开态语义） */
  enabled?: boolean
  /** 命中按键时先 preventDefault 再回调 */
  preventDefault?: boolean
  /** 监听目标，默认 window */
  target?: KeyPressTarget
}

type KeySpec = { modifiers: Partial<Record<'ctrl' | 'alt' | 'shift' | 'meta', boolean>>; key: string }

const KEY_ALIASES: Record<string, string[]> = {
  esc: ['escape', 'esc'],
  escape: ['escape'],
  enter: ['enter'],
  space: [' ', 'space'],
  left: ['arrowleft', 'left'],
  right: ['arrowright', 'right'],
  up: ['arrowup', 'up'],
  down: ['arrowdown', 'down'],
  tab: ['tab'],
}

const parseKeySpec = (spec: string): KeySpec | null => {
  const parts = spec.toLowerCase().split('+')
  const key = parts[parts.length - 1]
  if (!key) return null
  const modifiers: KeySpec['modifiers'] = {}
  for (const part of parts.slice(0, -1)) {
    if (part === 'ctrl' || part === 'control') modifiers.ctrl = true
    else if (part === 'alt') modifiers.alt = true
    else if (part === 'shift') modifiers.shift = true
    else if (part === 'meta' || part === 'cmd' || part === 'command') modifiers.meta = true
    else return null
  }
  return { modifiers, key }
}

// 声明的修饰键必须按下；未声明的修饰键不参与判定（与站点既有「只判 event.key」行为等价，
// 需要独占语义时调用方在 handler 内自行核对）
const matchesKeySpec = (event: KeyboardEvent, spec: KeySpec): boolean => {
  if (spec.modifiers.ctrl && !event.ctrlKey) return false
  if (spec.modifiers.alt && !event.altKey) return false
  if (spec.modifiers.shift && !event.shiftKey) return false
  if (spec.modifiers.meta && !event.metaKey) return false
  const pressed = event.key.toLowerCase()
  const aliases = KEY_ALIASES[spec.key] ?? [spec.key]
  return aliases.includes(pressed)
}

// keydown 按键订阅（ahooks useKeyPress 语义的收敛版）：key 支持单键（'Escape'/'ArrowLeft'/' '/'Esc'）、
// 组合键（'ctrl+c'）与候选数组（任一命中即触发）。命中修饰键采用「声明即必须按下」语义，
// 未声明的修饰键不参与判定（exactMatch=false，与站点既有快捷键行为一致）。
// 只订阅 keydown——本仓所有键盘消费点（Esc 关闭、方向键导航、空格翻页）均为按下即动作。
export const useKeyPress = (
  key: string | string[],
  handler: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {}
): void => {
  const { enabled = true, preventDefault = false, target = 'window', capture, passive } = options
  const specs: KeySpec[] = (Array.isArray(key) ? key : [key])
    .map(parseKeySpec)
    .filter((spec): spec is KeySpec => spec !== null)

  useEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (!specs.some((spec) => matchesKeySpec(event, spec))) return
      if (preventDefault) event.preventDefault()
      handler(event)
    },
    target,
    { enabled, capture, passive }
  )
}

export default useKeyPress
