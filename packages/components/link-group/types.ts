import * as React from 'react'

export type LinkType = 'wechat' | 'qq' | 'twitter' | 'email' | 'github' | 'douban' | 'custom'

export type LinkItem = {
  type: LinkType
  href?: string
  title?: string
  icon?: React.ReactNode
  onClick?: () => void
  hideOnMobile?: boolean
}

export type LinkGroupSize = 'small' | 'medium' | 'large'

export interface LinkGroupProps {
  items: LinkItem[]
  size?: LinkGroupSize
  gap?: number
}
