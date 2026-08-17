'use client'

import * as React from 'react'
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso'
import { ScrollContainer } from './styles'
import type { VirtualScrollHandle, VirtualScrollProps } from './specs'

export type { VirtualScrollHandle, VirtualScrollProps } from './specs'

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
