import * as React from 'react'

export type ShareType = 'wechat' | 'qq' | 'weibo' | 'twitter' | 'email' | 'link' | 'copy' | 'custom'

export type ShareItem = {
  type: ShareType
  href?: string
  title?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export type SharedLinkGroupSize = 'small' | 'medium' | 'large'

export interface SharedLinkGroupProps {
  items: ShareItem[]
  size?: SharedLinkGroupSize
  gap?: number
  label?: string
}
