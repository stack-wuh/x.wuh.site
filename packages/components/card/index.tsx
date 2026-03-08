'use client'

import * as React from 'react'
import {
  CardActionsRoot,
  CardContentRoot,
  CardHeaderRoot,
  CardRoot,
  type CardActionsAlign,
  type CardElevation,
  type CardPadding,
  type CardVariant,
} from './styles'

export type { CardVariant, CardElevation, CardPadding, CardActionsAlign }

const resolveElevation = (value: CardElevation | undefined): CardElevation => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  if (value <= 0) return 0
  if (value >= 5) return 5
  return value as CardElevation
}

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Card 视觉变体 */
  variant?: CardVariant
  /** Elevation 层级，范围 0-5 */
  elevation?: CardElevation
  /** 开启后启用 hover/active 交互态 */
  interactive?: boolean
  /** 是否撑满宽度 */
  fullWidth?: boolean
  /** 根容器内边距 */
  padding?: CardPadding
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** 底部分割线 */
  divider?: boolean
  /** 头部内边距 */
  padding?: CardPadding
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 顶部分割线 */
  divider?: boolean
  /** 内容区内边距 */
  padding?: CardPadding
}

export interface CardActionsProps extends React.HTMLAttributes<HTMLElement> {
  /** 顶部分割线 */
  divider?: boolean
  /** 操作区内边距 */
  padding?: CardPadding
  /** 对齐方式 */
  align?: CardActionsAlign
  /** 操作项是否允许换行 */
  wrap?: boolean
}

const CardBase = React.forwardRef<HTMLElement, CardProps>(function Card(props, ref) {
  const {
    variant = 'elevated',
    elevation = 1,
    interactive = false,
    fullWidth = false,
    padding = 'md',
    children,
    ...rest
  } = props

  return (
    <CardRoot
      ref={ref}
      $variant={variant}
      $elevation={resolveElevation(elevation)}
      $interactive={interactive}
      $fullWidth={fullWidth}
      $padding={padding}
      {...rest}
    >
      {children}
    </CardRoot>
  )
})

const CardHeader = React.forwardRef<HTMLElement, CardHeaderProps>(function CardHeader(props, ref) {
  const {
    divider = false,
    padding = 'md',
    children,
    ...rest
  } = props

  return (
    <CardHeaderRoot
      ref={ref}
      $divider={divider}
      $padding={padding}
      {...rest}
    >
      {children}
    </CardHeaderRoot>
  )
})

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(function CardContent(props, ref) {
  const {
    divider = false,
    padding = 'md',
    children,
    ...rest
  } = props

  return (
    <CardContentRoot
      ref={ref}
      $divider={divider}
      $padding={padding}
      {...rest}
    >
      {children}
    </CardContentRoot>
  )
})

const CardActions = React.forwardRef<HTMLElement, CardActionsProps>(function CardActions(props, ref) {
  const {
    divider = true,
    padding = 'md',
    align = 'end',
    wrap = false,
    children,
    ...rest
  } = props

  return (
    <CardActionsRoot
      ref={ref}
      $divider={divider}
      $padding={padding}
      $align={align}
      $wrap={wrap}
      {...rest}
    >
      {children}
    </CardActionsRoot>
  )
})

CardBase.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardContent.displayName = 'CardContent'
CardActions.displayName = 'CardActions'

type CardCompoundComponent = React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLElement>> & {
  Header: typeof CardHeader
  Content: typeof CardContent
  Actions: typeof CardActions
}

const Card = CardBase as CardCompoundComponent
Card.Header = CardHeader
Card.Content = CardContent
Card.Actions = CardActions

export { CardHeader, CardContent, CardActions }

export default Card
