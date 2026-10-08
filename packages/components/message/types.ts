import type { ReactNode } from 'react'

export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading'

export type MessagePlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'

export type MessagePlacementInput =
  | MessagePlacement
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export type MessageKey = string | number

export interface MessageOptions {
  content: ReactNode
  type?: MessageType
  duration?: number
  closable?: boolean
  onClose?: () => void
  key?: MessageKey
  placement?: MessagePlacementInput
  icon?: ReactNode
}

export interface MessageConfig {
  duration?: number
  placement?: MessagePlacementInput
  maxCount?: number
  top?: number
  bottom?: number
  side?: number
}
