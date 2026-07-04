'use client'

import message from '@wuh.site/components/message'
import { IconHome, IconArrowUp, IconThumbUp } from '@wuh.site/components/icons'
import { FloatingButtonGroup, FloatingButton, LikeButton } from '../styles'

export default function FloatingActions() {
  return (
    <FloatingButtonGroup>
      <FloatingButton
        type='button'
        aria-label='返回首页'
        title='返回首页'
        onClick={() => {
          window.location.href = '/'
        }}
      >
        <IconHome />
      </FloatingButton>
      <FloatingButton
        type='button'
        aria-label='回到顶部'
        title='回到顶部'
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <IconArrowUp />
      </FloatingButton>
      <LikeButton
        type='button'
        aria-label='点赞'
        title='点赞'
        onClick={() => {
          message.info('点赞功能正在开发中')
        }}
      >
        <IconThumbUp />
        <span>点赞</span>
      </LikeButton>
    </FloatingButtonGroup>
  )
}
