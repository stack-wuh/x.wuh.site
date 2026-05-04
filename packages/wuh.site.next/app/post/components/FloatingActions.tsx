'use client'

import message from '@wuh.site/components/message'
import { IconHome, IconScrollToTop, IconThumbUp } from '@wuh.site/components/icons'
import { FloatingButtonGroup, FloatingButton } from '../styles'

type Props = {
  scrollPercent: number
}

export default function FloatingActions({ scrollPercent }: Props) {
  const progressLabel = `${scrollPercent}`

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
        title={`返回页头（当前进度 ${progressLabel}%）`}
        $variant='progress'
        $percent={scrollPercent}
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
