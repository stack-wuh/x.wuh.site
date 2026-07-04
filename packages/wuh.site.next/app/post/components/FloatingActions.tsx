'use client'

import message from '@wuh.site/components/message'
import { IconHome, IconArrowUp, IconLike } from '@wuh.site/components/icons'
import { FloatingButtonGroup, FloatingButton } from '../styles'

export default function FloatingActions() {
  return (
    <FloatingButtonGroup>
      <FloatingButton
        type='button'
        aria-label='返回首页'
        onClick={() => {
          window.location.href = '/'
        }}
      >
        <IconHome />
        <span>返回首页</span>
      </FloatingButton>
      <FloatingButton
        type='button'
        aria-label='返回页头'
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <IconArrowUp />
        <span>回到顶部</span>
      </FloatingButton>
      <FloatingButton
        type='button'
        aria-label='点赞（开发中）'
        onClick={() => {
          message.info('点赞功能正在开发中')
        }}
      >
        <IconLike />
        <span>点赞</span>
      </FloatingButton>
    </FloatingButtonGroup>
  )
}
