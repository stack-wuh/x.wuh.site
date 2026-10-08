import * as React from 'react'
import type { ButtonColor, ButtonVariant } from '../button'

export type ActionItem = {
  label: string
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  color?: ButtonColor
}

export interface EmptyProps extends React.HTMLAttributes<HTMLElement> {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  actions?: ActionItem[]
}
