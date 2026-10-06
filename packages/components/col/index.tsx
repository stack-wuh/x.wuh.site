'use client'

import * as React from 'react'
import { CSSProperties } from 'react'
import styled from 'styled-components'
import { responsive, responsiveSlots, TResponsive } from '@wuh.site/components/themes/responsive'

const colAlignSelfOptions = ['start', 'center', 'end', 'stretch'] as const
export type TColAlignSelf = typeof colAlignSelfOptions[number]

/** 栅格占位：span 占栏数，offset 右移栏数（同一断点槽对内生效） */
type TPlacement = { span: number; offset: number }

export interface IColProps {
  /** 占用栏数 1–12，默认 12 = 整行堆叠；数组 = 断点槽 [base, tablet?] */
  span?: TResponsive<number>
  /** 右移栏数 0–11；数组 = 断点槽，与 span 同槽位组合成一条 grid-column */
  offset?: TResponsive<number>
  /** 视觉顺序调整（CSS order）；数组 = 断点槽 [base, tablet?] */
  order?: TResponsive<number>
  /** 交叉轴对齐（grid align-self）；数组 = 断点槽 [base, tablet?] */
  alignSelf?: TResponsive<TColAlignSelf>
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
interface IStyledColTransientProps {
  $placement?: TResponsive<TPlacement>
  $order?: TResponsive<number>
  $alignSelf?: TResponsive<TColAlignSelf>
}

const placementDecl = ({ span, offset }: TPlacement): string =>
  offset > 0 ? `grid-column: ${offset + 1} / span ${span};` : `grid-column: span ${span};`

const StyledCol = styled.div<IStyledColTransientProps>`
  box-sizing: border-box;
  /* grid 子项默认 min-width: auto，长文/媒体会撑破分栏；归零让 span 兑现收缩承诺 */
  min-width: 0;
  ${(props) => responsive(props.$placement ?? { span: 12, offset: 0 }, placementDecl)}
  ${(props) => responsive(props.$order, (v) => `order: ${v};`)}
  ${(props) => responsive(props.$alignSelf, (v) => `align-self: ${v};`)}
`

const COL_ONLY_KEYS: (keyof IColProps)[] = ['span', 'offset', 'order', 'alignSelf']

export const Col = React.forwardRef<HTMLDivElement, IColProps>((props, ref) => {
  const spanSlots = responsiveSlots(props.span ?? 12)
  const offsetSlots = responsiveSlots(props.offset ?? 0)
  /* offset 与 span 必须按同一断点槽合成单条 grid-column——任一 prop 有 tablet 槽，
     即对 tablet 槽补全（缺位方沿用自己的 base），否则两 prop 独立出 media 会互相错位 */
  const placement: TResponsive<TPlacement> =
    spanSlots.tablet !== undefined || offsetSlots.tablet !== undefined
      ? [
          { span: spanSlots.base, offset: offsetSlots.base },
          {
            span: spanSlots.tablet ?? spanSlots.base,
            offset: offsetSlots.tablet ?? offsetSlots.base,
          },
        ]
      : { span: spanSlots.base, offset: offsetSlots.base }

  const domProps = { ...props }
  COL_ONLY_KEYS.forEach((key) => delete (domProps as Record<string, unknown>)[key])

  return (
    <StyledCol
      ref={ref}
      $placement={placement}
      $order={props.order}
      $alignSelf={props.alignSelf}
      {...domProps}
    />
  )
})

Col.displayName = 'Col'

export default Col
