import * as React from 'react'

export interface VirtualScrollHandle {
  scrollToBottom(behavior?: ScrollBehavior): void
}

export interface VirtualScrollProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  followOutput?: boolean | ((isAtBottom: boolean) => boolean)
  initialTopMostItemIndex?: number | 'LAST'
  className?: string
  'aria-label'?: string
  tabIndex?: number
  overscan?: number
  emptyContent?: React.ReactNode
  footer?: React.ReactNode
  onAtBottomStateChange?: (atBottom: boolean) => void
}
