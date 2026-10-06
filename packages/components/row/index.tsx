'use client'

import * as React from 'react'
import { CSSProperties } from 'react'
import styled from 'styled-components'
import { getSpacingValue } from '@wuh.site/components/themes/index'
import { Tokens } from '@wuh.site/components/themes/tokens'
import { responsive, TResponsive } from '@wuh.site/components/themes/responsive'

/** 间距值：number 按 px 折算；string 为 spaces token 名或 CSS 长度/简写 */
export type TRowSpaceValue = number | string

const gridAlignOptions = ['start', 'center', 'end', 'stretch'] as const
export type TGridAlign = typeof gridAlignOptions[number]

const gridJustifyOptions = [
  'start',
  'center',
  'end',
  'space-between',
  'space-around',
  'space-evenly',
] as const
export type TGridJustify = typeof gridJustifyOptions[number]

export interface IRowProps {
  /** 分栏列数，默认 12 等分栅格；数组 = 断点槽 [base, sm?, md?, lg?] */
  cols?: TResponsive<number>
  /** 子项间距（spaces token 或 CSS 长度）；数组 = 断点槽 [base, sm?, md?, lg?] */
  gap?: TResponsive<TRowSpaceValue>
  /** 交叉轴对齐（grid align-items）；数组 = 断点槽 [base, sm?, md?, lg?] */
  alignItems?: TResponsive<TGridAlign>
  /** 轨道分布（grid justify-content）；数组 = 断点槽 [base, sm?, md?, lg?] */
  justifyContent?: TResponsive<TGridJustify>
  /** 是否以内联元素的形式展示 */
  inline?: boolean
  /** 子元素 */
  children?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 外联样式表 */
  style?: CSSProperties
  /** 点击事件 */
  onClick?: () => void
  /** 标题 */
  title?: string
}

/** 仅用于 styled 的 transient props，不会透传到 DOM */
interface IStyledRowTransientProps {
  $cols?: TResponsive<number>
  $gap?: TResponsive<TRowSpaceValue>
  $alignItems?: TResponsive<TGridAlign>
  $justifyContent?: TResponsive<TGridJustify>
  $inline?: boolean
}

const StyledRow = styled.div<IStyledRowTransientProps & { theme?: Tokens }>`
  display: ${(props) => (props.$inline ? 'inline-grid' : 'grid')};
  box-sizing: border-box;
  ${(props) => responsive(props.$cols ?? 12, (v) => `grid-template-columns: repeat(${v}, 1fr);`)}
  ${(props) =>
    props.$gap !== undefined && props.theme
      ? responsive(props.$gap, (v) => `gap: ${getSpacingValue(v, props.theme)};`)
      : ''}
  ${(props) => responsive(props.$alignItems, (v) => `align-items: ${v};`)}
  ${(props) => responsive(props.$justifyContent, (v) => `justify-content: ${v};`)}
`

const ROW_ONLY_KEYS: (keyof IRowProps)[] = [
  'cols', 'gap', 'alignItems', 'justifyContent', 'inline',
]

export const Row = React.forwardRef<HTMLDivElement, IRowProps>((props, ref) => {
  const domProps = { ...props }
  ROW_ONLY_KEYS.forEach((key) => delete (domProps as Record<string, unknown>)[key])

  return (
    <StyledRow
      ref={ref}
      $cols={props.cols}
      $gap={props.gap}
      $alignItems={props.alignItems}
      $justifyContent={props.justifyContent}
      $inline={props.inline}
      {...domProps}
    />
  )
})

Row.displayName = 'Row'

export default Row
