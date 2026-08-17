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
import type { CardActionsProps, CardContentProps, CardHeaderProps, CardProps } from './specs'

export type { CardVariant, CardElevation, CardPadding, CardActionsAlign }
export type { CardActionsProps, CardContentProps, CardHeaderProps, CardProps } from './specs'

const resolveElevation = (value: CardElevation | undefined): CardElevation => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  if (value <= 0) return 0
  if (value >= 5) return 5
  return value as CardElevation
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
