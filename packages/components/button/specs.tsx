import * as React from 'react'
import type { ButtonVariant, ButtonColor, ButtonSize } from './tokens'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children?: React.ReactNode
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  href?: string
  target?: string
  rel?: string
  disabled?: boolean
  fullWidth?: boolean
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'ghost' | 'href' | 'button' | 'submit' | 'reset'
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
}

export interface ButtonTransientProps {
  $variant?: ButtonVariant
  $color?: ButtonColor
  $size?: ButtonSize
  $fullWidth?: boolean
  $disabled?: boolean
}
