import * as React from 'react'
import { IconCompass, IconWarning } from '../icons'

export type ResultStatus = '404' | '500' | 'info' | 'error'

export type ResultLink = {
  label: string
  href?: string
  target?: string
  rel?: string
}

export type ResultProps = React.HTMLAttributes<HTMLElement> & {
  status?: ResultStatus
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  links?: ResultLink[]
  extra?: React.ReactNode
}

export const DEFAULT_CONTENT: Record<'404' | '500', { title: string; description: string; icon: React.ReactNode }> = {
  '404': {
    title: '页面不存在',
    description: '我们找不到你要访问的页面。你可以前往其他平台继续阅读。',
    icon: <IconCompass />
  },
  '500': {
    title: '服务异常',
    description: '页面暂时无法加载，请稍后重试或查看其他平台的内容。',
    icon: <IconWarning />
  }
}
