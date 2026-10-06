'use client'

import * as React from 'react'
import { CSSProperties } from 'react'
import styled from 'styled-components'
import {
  RESPONSIVE_LADDER,
  ladderSlots,
  responsive,
  TResponsive,
} from '@wuh.site/components/themes/responsive'

const colAlignSelfOptions = ['start', 'center', 'end', 'stretch'] as const
export type TColAlignSelf = typeof colAlignSelfOptions[number]

/** 栅格占位：span 占栏数，offset 右移栏数（同一断点槽对内生效） */
type TPlacement = { span: number; offset: number }

export interface IColProps {
  /** 占用栏数 1–12，默认 12 = 整行堆叠；数组 = 断点槽 [base, sm?, md?, lg?] */
  span?: TResponsive<number>
  /** 右移栏数 0–11；数组 = 断点槽，与 span 同槽位组合成一条 grid-column */
  offset?: TResponsive<number>
  /** 视觉顺序调整（CSS order）；数组 = 断点槽 [base, sm?, md?, lg?] */
  order?: TResponsive<number>
  /** 交叉轴对齐（grid align-self）；数组 = 断点槽 [base, sm?, md?, lg?] */
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
  const spanSlots = ladderSlots(props.span ?? 12)
  const offsetSlots = ladderSlots(props.offset ?? 0)
  /* offset 与 span 按同一阶梯档合成单条 grid-column：任一 prop 在某档有槽，
     该档即出块（缺位方沿用最近低档值 carry-forward），否则两 prop 各自出 media 会互相错位。
     上档全缺位则回落为基线标量，不产出多余的 media 块。 */
  const rungs = RESPONSIVE_LADDER.length + 1
  const placements: (TPlacement | undefined)[] = []
  let carry: TPlacement = { span: spanSlots[0] ?? 12, offset: offsetSlots[0] ?? 0 }
  for (let tier = 0; tier < rungs; tier += 1) {
    const hasSlot = spanSlots[tier] !== undefined || offsetSlots[tier] !== undefined
    if (tier > 0 && !hasSlot) {
      placements.push(undefined)
      continue
    }
    if (tier > 0) {
      carry = {
        span: spanSlots[tier] ?? carry.span,
        offset: offsetSlots[tier] ?? carry.offset,
      }
    }
    placements.push(carry)
  }
  const hasUpperSlot = spanSlots.length > 1 || offsetSlots.length > 1
  const placement: TResponsive<TPlacement> = hasUpperSlot ? placements : placements[0]

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
