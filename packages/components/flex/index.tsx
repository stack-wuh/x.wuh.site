'use client'

import * as React from 'react'
import styled from 'styled-components'
import { getSpacingValue } from '@wuh.site/components/themes/index'
import { Tokens } from '@wuh.site/components/themes/tokens'
import { responsive } from '@wuh.site/components/themes/responsive'
import { IFlexProps } from './types'

/** 仅用于 styled 的 transient props，不会透传到 DOM */
interface IStyledFlexTransientProps {
  $direction?: IFlexProps['direction']
  $justifyContent?: IFlexProps['justifyContent']
  $alignItems?: IFlexProps['alignItems']
  $gap?: IFlexProps['gap']
  $wrap?: IFlexProps['wrap']
  $padding?: IFlexProps['padding']
  $margin?: IFlexProps['margin']
  $inline?: IFlexProps['inline']
  $hidden?: IFlexProps['hidden']
  $width?: IFlexProps['width']
  $height?: IFlexProps['height']
  $maxWidth?: IFlexProps['maxWidth']
  $fullWidth?: IFlexProps['fullWidth']
  $fullHeight?: IFlexProps['fullHeight']
  $flex?: IFlexProps['flex']
  $flexGrow?: IFlexProps['flexGrow']
  $flexShrink?: IFlexProps['flexShrink']
  $flexBasis?: IFlexProps['flexBasis']
  $alignSelf?: IFlexProps['alignSelf']
  $order?: IFlexProps['order']
}

/**
 * 长度值折算：CSS 关键字直通（auto / fit-content / max-content / min-content / 继承族 / none）；
 * 有主题时走 spaces token（number 折 px、'md' 查 token、CSS 长度/百分比透传）；
 * 无主题回退 px 折算，不产出无单位非法值。
 */
const CSS_LENGTH_KEYWORDS = /^(auto|fit-content|max-content|min-content|inherit|initial|unset|none)$/
const lengthValue = (value: string | number, theme?: Tokens): string => {
  if (typeof value === 'string' && CSS_LENGTH_KEYWORDS.test(value)) return value
  if (theme) return getSpacingValue(value, theme)
  return typeof value === 'number' ? `${value}px` : value
}

const StyledFlex = styled.div<IStyledFlexTransientProps & { theme?: Tokens }>`
  display: ${(props) => (props.$inline ? 'inline-flex' : 'flex')};
  box-sizing: border-box;
  ${(props) => responsive(props.$direction ?? 'row', (v) => `flex-direction: ${v};`)}
  ${(props) => responsive(props.$justifyContent ?? 'flex-start', (v) => `justify-content: ${v};`)}
  ${(props) => responsive(props.$alignItems ?? 'flex-start', (v) => `align-items: ${v};`)}
  ${(props) => responsive(props.$wrap, (v) => `flex-wrap: ${v ? 'wrap' : 'nowrap'};`)}
  ${(props) =>
    props.$gap !== undefined && props.theme
      ? responsive(props.$gap, (v) => `gap: ${lengthValue(v, props.theme)};`)
      : ''}
  ${(props) =>
    props.$padding !== undefined && props.theme
      ? responsive(props.$padding, (v) => `padding: ${lengthValue(v, props.theme)};`)
      : ''}
  ${(props) =>
    props.$margin !== undefined && props.theme
      ? responsive(props.$margin, (v) => `margin: ${lengthValue(v, props.theme)};`)
      : ''}
  ${(props) => responsive(props.$width, (v) => `width: ${lengthValue(v, props.theme)};`)}
  ${(props) => responsive(props.$height, (v) => `height: ${lengthValue(v, props.theme)};`)}
  ${(props) => responsive(props.$maxWidth, (v) => `max-width: ${lengthValue(v, props.theme)};`)}
  ${(props) => (props.$fullWidth ? 'width: 100%;' : '')}
  ${(props) => (props.$fullHeight ? 'height: 100%;' : '')}
  ${(props) => (props.$flex !== undefined ? `flex: ${props.$flex};` : '')}

  /* hidden 编译置于模板尾部：其 display:none 覆盖初始 display 行；
     阶梯高槽 false 位发射恢复声明（按 $inline），媒体级联让位后段胜出 */
  ${(props) =>
    responsive(props.$hidden, (v) =>
      v ? 'display: none;' : `display: ${props.$inline ? 'inline-flex' : 'flex'};`)}

  & > * {
    ${(props) =>
      props.$flexBasis !== undefined ? `flex-basis: ${lengthValue(props.$flexBasis, props.theme)};` : ''}
    ${(props) => (props.$flexGrow !== undefined ? `flex-grow: ${props.$flexGrow};` : '')}
    ${(props) => (props.$flexShrink !== undefined ? `flex-shrink: ${props.$flexShrink};` : '')}
    ${(props) => (props.$order !== undefined ? `order: ${props.$order};` : '')}
    ${(props) => (props.$alignSelf ? `align-self: ${props.$alignSelf};` : '')}
  }
`

export const Flex = React.forwardRef<HTMLDivElement, IFlexProps>((props, ref) => {
  // 解构剔除布局 props：既避免原生 HTML `hidden`（boolean）与 TResponsive 冲突，
  // 又杜绝任何布局 prop 泄进 DOM（delete-cast 的 spread 类型仍带 hidden，会撞 styled.div）
  const {
    direction, justifyContent, alignItems, gap, wrap, padding, margin,
    inline, hidden, width, height, maxWidth, fullWidth, fullHeight, flex, flexGrow,
    flexShrink, flexBasis, alignSelf, order,
    ...domProps
  } = props

  return (
    <StyledFlex
      ref={ref}
      $direction={direction}
      $justifyContent={justifyContent}
      $alignItems={alignItems}
      $gap={gap}
      $wrap={wrap}
      $padding={padding}
      $margin={margin}
      $inline={inline}
      $hidden={hidden}
      $width={width}
      $height={height}
      $maxWidth={maxWidth}
      $fullWidth={fullWidth}
      $fullHeight={fullHeight}
      $flex={flex}
      $flexGrow={flexGrow}
      $flexShrink={flexShrink}
      $flexBasis={flexBasis}
      $alignSelf={alignSelf}
      $order={order}
      {...domProps}
    />
  )
})

Flex.displayName = 'Flex'

export default Flex

export const InlineFlex = styled(Flex).attrs<IFlexProps>({ inline: true })``

/** 垂直布局 */
export const Column = styled(Flex).attrs<IFlexProps>({ direction: 'column' })``

/** 反向列布局 */
export const ColumnReverse = styled(Flex).attrs<IFlexProps>({
  direction: 'column-reverse'
})``

/** 水平垂直居中 */
export const Center = styled(Flex).attrs<IFlexProps>({
  justifyContent: 'center',
  alignItems: 'center'
})``

/** 水平居中 */
export const CenterHorizontal = styled(Flex).attrs<IFlexProps>({
  justifyContent: 'center'
})``

/** 垂直居中 */
export const CenterVertical = styled(Flex).attrs<IFlexProps>({
  alignItems: 'center'
})``

/** 两端对齐 */
export const SpaceBetween = styled(Flex).attrs<IFlexProps>({
  justifyContent: 'space-between'
})``

/** 环绕对齐 */
export const SpaceAround = styled(Flex).attrs<IFlexProps>({
  justifyContent: 'space-around'
})``

/** 等间距对齐 */
export const SpaceEvenly = styled(Flex).attrs<IFlexProps>({
  justifyContent: 'space-evenly'
})``

/**
 * @NOTE 旧 20 个别名已收敛：单 bool/尺寸糖（Wrap/NoWrap/FlexEnd/FlexStart/
 * AlignTop/AlignBottom/FullWidth/FullHeight/FullSize）由对应 props 直给，
 * Row/RowReverse 让位给 @wuh.site/components/row 的栅格 Row——本包零消费者，无兼容义务。
 */
