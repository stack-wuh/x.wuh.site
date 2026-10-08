import * as React from 'react'

export interface ScrollAreaProps {
  /** 滚动区域内容 */
  children?: React.ReactNode
  className?: string
  /** 视口元素引用，用于外部监听滚动事件或程序化滚动 */
  viewportRef?: React.Ref<HTMLDivElement>
  /** 滚动条出现方式，透传 Radix ScrollArea：scroll 可滚动时渲染，always 常驻，hover 悬停时 */
  type?: 'scroll' | 'always' | 'hover'
  /** type 为 hover 时滚动条隐藏延迟（毫秒） */
  scrollHideDelay?: number
  'aria-label'?: string
}
