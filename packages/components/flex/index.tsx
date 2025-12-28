import * as React from 'react'
import styled, { css } from 'styled-components'
import { getSpacingValue } from '@wuh.site/components/themes/index'
import { Tokens } from '@wuh.site/components/themes/tokens'
import { IFlexProps, TFlexGap, TFlexSpace } from './types'

/**
 * @NOTE 处理gap间距
 * @param gap
 * @param theme
 * @returns
 */
const parsGap = (gap: TFlexGap, theme: Tokens): string => {
  if (Array.isArray(gap)) {
    const [row, column = row] = gap
    return [getSpacingValue(row, theme), getSpacingValue(column, theme)].join(' ')
  }
  return getSpacingValue(gap, theme)
}

/**
 * @NOTE 处理margin和padding
 * @param value
 * @param theme
 * @returns
 */
const parseMarginPadding = (value: TFlexSpace, theme: Tokens): string => {
  if (Array.isArray(value)) {
    const [top, right, bottom = top, left = right] = value
    return [getSpacingValue(top, theme), getSpacingValue(right, theme), getSpacingValue(bottom, theme), getSpacingValue(left, theme)].join(' ')
  }
  return getSpacingValue(value, theme)
}

const StyledFlex = styled.div<IFlexProps>`
  display: ${(props) => (props.inline ? 'inline-flex' : 'flex')};
  flex-direction: ${(props) => props.direction ?? 'row'};
  justify-content: ${(props) => props.justifyContent ?? 'flex-start'};
  align-items: ${(props) => props.alignItems ?? 'flex-start'};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'nowrap')};
  box-sizing: border-box;
  ${(props) =>
    props.gap &&
    css`
      gap: ${parsGap(props.gap, props.theme)};
    `}
  ${(props) =>
    props.padding &&
    css`
      padding: ${parseMarginPadding(props.padding, props.theme)};
    `}
  ${(props) =>
    props.margin &&
    css`
      margin: ${parseMarginPadding(props.margin, props.theme)};
    `}
  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `}
  ${(props) =>
    props.height &&
    css`
      height: ${props.height};
    `}
  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}
  ${(props) =>
    props.fullHeight &&
    css`
      height: 100%;
    `}
  ${(props) =>
    props.flex &&
    css`
      flex: ${props.flex};
    `}

  & > * {
    ${(props) =>
      props.flexBasis &&
      css`
        flex-basis: ${props.flexBasis};
      `}
    ${(props) =>
      props.flexGrow &&
      css`
        flex-grow: ${props.flexGrow};
      `}
    ${(props) =>
      props.flexShrink &&
      css`
        flex-shrink: ${props.flexShrink};
      `}
    ${(props) =>
      props.order &&
      css`
        order: ${props.order};
      `}
    ${(props) =>
      props.alignSelf &&
      css`
        align-self: ${props.alignSelf};
      `}
  }
`

export const Flex = React.forwardRef<HTMLDivElement, IFlexProps>((props, ref) => {
  return (
    <StyledFlex ref={ref} {...props}>
      {props.children}
    </StyledFlex>
  )
})

Flex.displayName = 'Flex'

export default Flex

export const InlineFlex = styled(Flex).attrs<IFlexProps>({ inline: true })``

/** 水平布局 */
export const Row = styled(Flex).attrs<IFlexProps>({
  direction: 'row'
})``

/** 反向行布局 */
export const RowReverse = styled(Flex).attrs<IFlexProps>({
  direction: 'row-reverse'
})``

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

/** 换行 */
export const Wrap = styled(Flex).attrs<IFlexProps>({
  wrap: true
})``

/** 不换行 */
export const NoWrap = styled(Flex).attrs<IFlexProps>({
  wrap: false
})``

/** 水平右对齐 */
export const FlexEnd = styled(Flex).attrs<IFlexProps>({
  justifyContent: 'flex-end'
})``

/** 水平左对齐 */
export const FlexStart = styled(Flex).attrs<IFlexProps>({
  justifyContent: 'flex-start'
})``

/** 垂直顶部对齐 */
export const AlignTop = styled(Flex).attrs<IFlexProps>({
  alignItems: 'flex-start'
})``

/** 垂直底部对齐 */
export const AlignBottom = styled(Flex).attrs<IFlexProps>({
  alignItems: 'flex-end'
})``

/** 填充容器宽度 */
export const FullWidth = styled(Flex).attrs<IFlexProps>({
  fullWidth: true
})``

/** 填充容器高度 */
export const FullHeight = styled(Flex).attrs<IFlexProps>({
  fullHeight: true
})``

export const FullSize = styled(Flex).attrs<IFlexProps>({
  fullWidth: true,
  fullHeight: true
})``
