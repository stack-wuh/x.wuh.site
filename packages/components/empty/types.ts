import * as React from 'react'
import type { ButtonColor, ButtonVariant } from '../button'

export type ActionItem = {
  label: string
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  color?: ButtonColor
}

// title 语义是 ReactNode 展示位，与原生 HTML title 属性（string tooltip）冲突，Omit 收敛
export interface EmptyProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  actions?: ActionItem[]
}
