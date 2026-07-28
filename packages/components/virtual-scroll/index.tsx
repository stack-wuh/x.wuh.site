'use client'

import * as React from 'react'
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso'
import { ScrollContainer } from './styles'

export interface VirtualScrollHandle {
  scrollToBottom(behavior?: ScrollBehavior): void
}

export interface VirtualScrollProps<T> {
  /** 列表数据 */
  items: T[]
  /** 渲染单条数据 */
  renderItem: (item: T, index: number) => React.ReactNode
  /**
   * 追加新条目时是否跟随到底部。
   * 传函数可基于 atBottom 状态做条件判断。
   */
  followOutput?: boolean | ((isAtBottom: boolean) => boolean)
  /**
   * 初始定位到哪条。
   * 'LAST' 表示最后一条（定位到最新消息）。
   */
  initialTopMostItemIndex?: number | 'LAST'
  /** 容器 className，可自定义高度等外部布局 */
  className?: string
  /** 无障碍标签 */
  'aria-label'?: string
  /** 键盘 Tab 可聚焦，默认 0 */
  tabIndex?: number
  /** 列表上下各保留的 overscan 行数，默认 5 */
  overscan?: number
  /** 列表为空时渲染的内容 */
  emptyContent?: React.ReactNode
  /** 列表尾部追加的内容（如加载中占位、错误 Banner） */
  footer?: React.ReactNode
  /** 滚动位置变化回调：通知父组件是否贴近底部 */
  onAtBottomStateChange?: (atBottom: boolean) => void
}

function VirtualScrollInner<T>(
  {
    items,
    renderItem,
    followOutput,
    initialTopMostItemIndex,
    className,
    'aria-label': ariaLabel,
    tabIndex = 0,
    overscan = 5,
    emptyContent,
    footer,
    onAtBottomStateChange,
  }: VirtualScrollProps<T>,
  ref: React.Ref<VirtualScrollHandle>
) {
  const virtuosoRef = React.useRef<VirtuosoHandle>(null)

  React.useImperativeHandle(ref, () => ({
    scrollToBottom(behavior: ScrollBehavior = 'smooth') {
      if (items.length > 0) {
        virtuosoRef.current?.scrollToIndex({
          index: items.length - 1,
          behavior,
          align: 'end',
        })
      }
    },
  }))

  const initialIndex =
    initialTopMostItemIndex === 'LAST'
      ? items.length > 0
        ? items.length - 1
        : 0
      : (initialTopMostItemIndex ?? 0)

  if (items.length === 0 && emptyContent) {
    return (
      <ScrollContainer
        className={className}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        role="list"
      >
        {emptyContent}
      </ScrollContainer>
    )
  }

  return (
    <Virtuoso
      ref={virtuosoRef}
      components={{
        // 将主题化滚动容器作为滚动外壳
        Scroller: React.forwardRef(({ style, ...props }, scrollerRef) => (
          <ScrollContainer
            {...props}
            ref={scrollerRef as React.Ref<HTMLDivElement>}
            style={style as React.CSSProperties}
            className={className}
            aria-label={ariaLabel}
            tabIndex={tabIndex}
            role="list"
          />
        )),
        Footer: footer ? () => <>{footer}</> : undefined,
      }}
      data={items}
      itemContent={(index, item) => renderItem(item, index)}
      followOutput={followOutput}
      initialTopMostItemIndex={initialIndex}
      overscan={overscan}
      atBottomStateChange={onAtBottomStateChange}
    />
  )
}

// React.forwardRef 不直接支持泛型，用类型断言包装
const VirtualScroll = React.forwardRef(VirtualScrollInner) as <T>(
  props: VirtualScrollProps<T> & { ref?: React.Ref<VirtualScrollHandle> }
) => React.ReactElement

export default VirtualScroll
