'use client'

import * as React from 'react'
import { createRoot, type Root } from 'react-dom/client'

import {
  MessageCloseButton,
  MessageContent,
  MessageHost,
  MessageIcon,
  MessageItem,
  MessagePlacementWrap,
  MessageSpinner,
} from './styles'
import type {
  MessageConfig,
  MessageKey,
  MessageOptions,
  MessagePlacement,
  MessagePlacementInput,
  MessageType,
} from './types'

export type { MessageConfig, MessageKey, MessageOptions, MessagePlacement, MessageType } from './types'

type MessageArgs = MessageOptions | React.ReactNode

type MessageSnapshot = {
  config: Required<MessageConfig>
  items: Record<MessagePlacement, MessageInstance[]>
}

type MessageInstance = {
  id: string
  key?: string
  type: MessageType
  content: React.ReactNode
  duration: number
  placement: MessagePlacement
  closable: boolean
  onClose?: () => void
  icon?: React.ReactNode
  leaving: boolean
}

type MessageListener = (snapshot: MessageSnapshot) => void

type Holder = {
  root: Root
  container: HTMLDivElement
}

const DEFAULT_CONFIG: Required<MessageConfig> = {
  duration: 3,
  placement: 'top',
  maxCount: 5,
  top: 24,
  bottom: 24,
  side: 24,
}

const PLACEMENTS: MessagePlacement[] = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight']

const toPlacement = (placement?: MessagePlacementInput): MessagePlacement => {
  if (!placement) return DEFAULT_CONFIG.placement
  if (placement === 'top-left') return 'topLeft'
  if (placement === 'top-right') return 'topRight'
  if (placement === 'bottom-left') return 'bottomLeft'
  if (placement === 'bottom-right') return 'bottomRight'
  return placement
}

const toKey = (value?: MessageKey) => (value === undefined || value === null ? undefined : String(value))

class MessageManager {
  private config: Required<MessageConfig> = { ...DEFAULT_CONFIG }
  private state: Record<MessagePlacement, MessageInstance[]> = {
    top: [],
    topLeft: [],
    topRight: [],
    bottom: [],
    bottomLeft: [],
    bottomRight: [],
  }
  private listeners = new Set<MessageListener>()
  private seed = 0
  private timers = new Map<string, number>()

  getSnapshot(): MessageSnapshot {
    return {
      config: this.config,
      items: this.state,
    }
  }

  subscribe(listener: MessageListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  setConfig(next: MessageConfig) {
    this.config = {
      ...this.config,
      ...next,
      placement: toPlacement(next.placement ?? this.config.placement),
    }
    this.emit()
  }

  open(options: MessageOptions) {
    const placement = toPlacement(options.placement ?? this.config.placement)
    const duration = this.resolveDuration(options)
    const closable = options.closable ?? true
    const key = toKey(options.key)

    const list = this.state[placement]
    const existingIndex = key ? list.findIndex((item) => item.key === key) : -1

    const item: MessageInstance = {
      id: key ?? `message_${this.seed++}`,
      key,
      type: options.type ?? 'info',
      content: options.content,
      duration,
      placement,
      closable,
      onClose: options.onClose,
      icon: options.icon,
      leaving: false,
    }

    let nextList = list

    if (existingIndex >= 0) {
      const existing = list[existingIndex]
      this.clearTimer(existing.id)
      nextList = [...list]
      nextList[existingIndex] = { ...item, id: existing.id }
    } else {
      if (this.config.maxCount > 0 && list.length >= this.config.maxCount) {
        const [oldest] = list
        if (oldest) {
          this.clearTimer(oldest.id)
          nextList = list.slice(1)
        }
      }
      nextList = [...nextList, item]
    }

    this.state = {
      ...this.state,
      [placement]: nextList,
    }
    this.emit()

    if (duration > 0) {
      const timerId = window.setTimeout(() => {
        this.close(item.id)
      }, duration * 1000)
      this.timers.set(item.id, timerId)
    }

    return () => this.close(item.id)
  }

  close(idOrKey?: string) {
    if (!idOrKey) return
    const match = this.findMessage(idOrKey)
    if (!match) return

    const { placement, index } = match
    const list = this.state[placement]
    const target = list[index]
    if (!target || target.leaving) return

    this.clearTimer(target.id)

    const nextList = [...list]
    nextList[index] = { ...target, leaving: true }
    this.state = {
      ...this.state,
      [placement]: nextList,
    }
    this.emit()

    window.setTimeout(() => {
      const finalList = this.state[placement].filter((item) => item.id !== target.id)
      this.state = {
        ...this.state,
        [placement]: finalList,
      }
      this.emit()
      target.onClose?.()
    }, 220)
  }

  destroy(idOrKey?: string) {
    if (!idOrKey) {
      this.timers.forEach((timer) => window.clearTimeout(timer))
      this.timers.clear()
      this.state = {
        top: [],
        topLeft: [],
        topRight: [],
        bottom: [],
        bottomLeft: [],
        bottomRight: [],
      }
      this.emit()
      return
    }

    this.close(idOrKey)
  }

  private findMessage(idOrKey: string) {
    for (const placement of PLACEMENTS) {
      const list = this.state[placement]
      const index = list.findIndex((item) => item.id === idOrKey || item.key === idOrKey)
      if (index >= 0) {
        return { placement, index }
      }
    }
    return null
  }

  private clearTimer(id: string) {
    const timer = this.timers.get(id)
    if (timer) {
      window.clearTimeout(timer)
      this.timers.delete(id)
    }
  }

  private resolveDuration(options: MessageOptions) {
    if (typeof options.duration === 'number') return options.duration
    if (options.type === 'loading') return 0
    return this.config.duration
  }

  private emit() {
    const snapshot = this.getSnapshot()
    this.listeners.forEach((listener) => listener(snapshot))
  }
}

const manager = new MessageManager()
let holder: Holder | null = null

const ensureHolder = () => {
  if (typeof document === 'undefined') return null
  if (!holder) {
    const container = document.createElement('div')
    container.setAttribute('data-message-root', 'true')
    document.body.appendChild(container)
    const root = createRoot(container)
    root.render(<MessagePortal />)
    holder = { root, container }
  }
  return holder
}

const InfoIcon = () => (
  <svg viewBox='0 0 24 24' aria-hidden='true'>
    <circle cx='12' cy='12' r='9' />
    <path d='M12 10v7' />
    <path d='M12 7h.01' />
  </svg>
)

const SuccessIcon = () => (
  <svg viewBox='0 0 24 24' aria-hidden='true'>
    <circle cx='12' cy='12' r='9' />
    <path d='M8.5 12.5l2.5 2.5 4.5-5' />
  </svg>
)

const WarningIcon = () => (
  <svg viewBox='0 0 24 24' aria-hidden='true'>
    <path d='M12 3l9 16H3l9-16z' />
    <path d='M12 9v4' />
    <path d='M12 17h.01' />
  </svg>
)

const ErrorIcon = () => (
  <svg viewBox='0 0 24 24' aria-hidden='true'>
    <circle cx='12' cy='12' r='9' />
    <path d='M15 9l-6 6' />
    <path d='M9 9l6 6' />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox='0 0 24 24' aria-hidden='true'>
    <path d='M18 6L6 18' />
    <path d='M6 6l12 12' />
  </svg>
)

const renderIcon = (type: MessageType, icon?: React.ReactNode) => {
  if (icon) return icon
  if (type === 'loading') return <MessageSpinner />
  if (type === 'success') return <SuccessIcon />
  if (type === 'warning') return <WarningIcon />
  if (type === 'error') return <ErrorIcon />
  return <InfoIcon />
}

const MessagePortal = () => {
  const [snapshot, setSnapshot] = React.useState(manager.getSnapshot())

  React.useEffect(() => manager.subscribe(setSnapshot), [])

  const { config, items } = snapshot
  const styleVars = {
    '--message-top': `${config.top}px`,
    '--message-bottom': `${config.bottom}px`,
    '--message-side': `${config.side}px`,
  } as React.CSSProperties

  return (
    <MessageHost style={styleVars}>
      {PLACEMENTS.map((placement) => {
        const list = items[placement]
        if (!list.length) return null
        return (
          <MessagePlacementWrap key={placement} $placement={placement}>
            {list.map((item) => (
              <MessageItem
                key={item.id}
                $type={item.type}
                $leaving={item.leaving}
                role={item.type === 'error' ? 'alert' : 'status'}
                aria-live={item.type === 'error' ? 'assertive' : 'polite'}
              >
                <MessageIcon $type={item.type}>{renderIcon(item.type, item.icon)}</MessageIcon>
                <MessageContent>{item.content}</MessageContent>
                {item.closable && (
                  <MessageCloseButton
                    type='button'
                    aria-label='关闭提示'
                    onClick={() => {
                      manager.close(item.id)
                    }}
                  >
                    <CloseIcon />
                  </MessageCloseButton>
                )}
              </MessageItem>
            ))}
          </MessagePlacementWrap>
        )
      })}
    </MessageHost>
  )
}

const openMessage = (options: MessageOptions) => {
  const holderRef = ensureHolder()
  if (!holderRef) return () => {}
  return manager.open(options)
}

const normalizeArgs = (content: MessageArgs, duration?: number, onClose?: () => void): MessageOptions => {
  if (typeof content === 'object' && content !== null && 'content' in content) {
    return content as MessageOptions
  }
  return {
    content: content as React.ReactNode,
    duration,
    onClose,
  }
}

const createTypeMessage = (type: MessageType) => (content: MessageArgs, duration?: number, onClose?: () => void) =>
  openMessage({
    ...normalizeArgs(content, duration, onClose),
    type,
  })

const message = {
  open: (options: MessageOptions) => openMessage(options),
  info: createTypeMessage('info'),
  success: createTypeMessage('success'),
  warning: createTypeMessage('warning'),
  error: createTypeMessage('error'),
  loading: createTypeMessage('loading'),
  config: (nextConfig: MessageConfig) => {
    manager.setConfig(nextConfig)
  },
  destroy: (key?: MessageKey) => {
    manager.destroy(key ? String(key) : undefined)
  },
}

export default message
