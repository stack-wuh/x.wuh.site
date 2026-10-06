import { CSSProperties } from 'react'
import { TResponsive } from '@wuh.site/components/themes/responsive'

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

/**
 * 间距值：number 按 px 折算；string 可为 spaces token 名（sm/md/lg…）
 * 或任意 CSS 长度/简写（如 '8px 16px'），经 getSpacingValue 解析。
 *
 * 契约：布局 props 的顶层数组一律 = 断点槽 [base, tablet]，
 * 非对称盒式简写（如 padding 四值）经 CSS 字符串传入，不占数组语法。
 */
export type TSpaceValue = number | string

export interface IFlexProps {
  /** 布局方向；数组 = 断点槽 [base, tablet?] */
  direction?: TResponsive<TFlexDirection>
  /** 主轴对齐；数组 = 断点槽 [base, tablet?] */
  justifyContent?: TResponsive<TJustifyContent>
  /** 交叉轴对齐；数组 = 断点槽 [base, tablet?] */
  alignItems?: TResponsive<TAlignItems>
  /** 子项间距（spaces token 或 CSS 长度）；数组 = 断点槽 [base, tablet?] */
  gap?: TResponsive<TSpaceValue>
  /** 是否换行；数组 = 断点槽 [base, tablet?] */
  wrap?: TResponsive<boolean>
  /** 内边距；数组 = 断点槽 [base, tablet?] */
  padding?: TResponsive<TSpaceValue>
  /** 外边距；数组 = 断点槽 [base, tablet?] */
  margin?: TResponsive<TSpaceValue>
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
