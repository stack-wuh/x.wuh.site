import * as React from 'react'
import type { ShareItem } from '../shared-link-group'
import type { AlertVariant } from './styles'

export type AlertLink = {
  label: string
  href: string
}

export type AlertLabel = {
  name: string
  color?: string | null
  href: string
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  variant?: AlertVariant
  framed?: boolean
  showHeader?: boolean
  title?: React.ReactNode
  summary?: React.ReactNode
  icon?: React.ReactNode
  updatedAt?: string | number | Date | null
  updatedBy?: string
  updatedByLink?: string
  sourceLink?: AlertLink
  projectLink?: AlertLink
  labels?: AlertLabel[]
  license?: React.ReactNode
  /** @deprecated 使用 `license` 代替 */
  copyright?: React.ReactNode
  shareItems?: ShareItem[]
  shareLabel?: string
  closable?: boolean
  onClose?: () => void
}
