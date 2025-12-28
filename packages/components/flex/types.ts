import { CSSProperties } from 'react'

export const flexDirections = ['row', 'row-reverse', 'column', 'column-reverse'] as const
export type TFlexDirection = typeof flexDirections[number]

export const justifyContents = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
] as const
export type TJustifyContent = typeof justifyContents[number]

export const alignItemsOptions = [
  'flex-start',
  'flex-end',
  'center',
  'baseline',
  'stretch',
] as const
export type TAlignItems = typeof alignItemsOptions[number]

export type TFlexGap = number | string | [number | string, number | string]

export type TFlexSpace = number | string | [number | string, number | string]

export interface IFlexProps {
  /** 控制Flex布局的方向 */
  direction?: TFlexDirection
  /** 控制Flex布局主轴的对齐方式 */
  justifyContent?: TJustifyContent
  /** 控制Flex布局交叉轴的对齐方式 */
  alignItems?: TAlignItems,
  /** 控制Flex布局的子元素之间的间距 */
  gap?: TFlexGap,
  /** 控制Flex布局是否换行 */
  wrap?: boolean,
  /** 控制Flex布局的内边距 */
  padding?: TFlexSpace,
  /** 控制Flex布局的外边距 */
  margin?: TFlexSpace,
  /** 是否以内联元素的形式展示 */
  inline?: boolean,
  /** 外联样式表 */
  style?: CSSProperties,
  /** 子元素 */
  children?: React.ReactNode,
  /** 自定义类名 */
  className?: string,
  /** 点击事件 */
  onClick?: () => void,
  /** 标题 */
  title?: string,
  width?: string | number,
  height?: string | number,
  fullWidth?: boolean,
  fullHeight?: boolean,
  flex?: number | string,
  flexGrow?: number | string,
  flexShrink?: number | string,
  flexBasis?: number | string,
  alignSelf?: TAlignItems,
  order?: number | string,
}