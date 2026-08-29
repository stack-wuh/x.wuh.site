import * as React from 'react'

export interface MessageCardProps {
  /** 自己的留言：镜像斜切圆角 + 主色浅染 */
  $mine?: boolean
  className?: string
  children?: React.ReactNode
}

export interface MessageMetaProps {
  /** 信息行对齐，自己的留言行传 end */
  align?: 'start' | 'end'
  className?: string
  children?: React.ReactNode
}

export interface MessageStatusProps {
  /** error 使用主色调 */
  $tone?: 'default' | 'error'
  className?: string
  children?: React.ReactNode
}
