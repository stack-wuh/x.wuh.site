'use client'

import message from '@wuh.site/components/message'
import { IconHome, IconScrollToTop, IconThumbUp } from '@wuh.site/components/icons'
import { FloatingButtonGroup, FloatingButton } from '../styles'

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
        aria-label='返回页头'
        title='返回页头'
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <IconScrollToTop />
      </FloatingButton>
      <FloatingButton
        type='button'
        aria-label='点赞（开发中）'
        title='点赞（开发中）'
        onClick={() => {
          message.info('点赞功能正在开发中')
        }}
      >
        <IconThumbUp />
      </FloatingButton>
    </FloatingButtonGroup>
  )
}
