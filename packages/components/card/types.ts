import * as React from 'react'
import type { CardActionsAlign, CardElevation, CardPadding, CardVariant } from './styles'

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant
  elevation?: CardElevation
  interactive?: boolean
  fullWidth?: boolean
  padding?: CardPadding
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLElement> {
  divider?: boolean
  padding?: CardPadding
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean
  padding?: CardPadding
}

export interface CardActionsProps extends React.HTMLAttributes<HTMLElement> {
  divider?: boolean
  padding?: CardPadding
  align?: CardActionsAlign
  wrap?: boolean
}
