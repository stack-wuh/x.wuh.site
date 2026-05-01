'use client'

import message from '@wuh.site/components/message'
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
        <svg viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
          <path d='M3 10.5L12 3l9 7.5' />
          <path d='M5.5 9.5V20a1 1 0 0 0 1 1h4.5v-6h2v6H17.5a1 1 0 0 0 1-1V9.5' />
        </svg>
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
        <svg viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
          <path d='M12 5l-6 6' />
          <path d='M12 5l6 6' />
          <path d='M12 5v14' />
        </svg>
      </FloatingButton>
      <FloatingButton
        type='button'
        aria-label='点赞（开发中）'
        title='点赞（开发中）'
        onClick={() => {
          message.info('点赞功能正在开发中')
        }}
      >
        <svg viewBox='0 0 24 24' focusable='false' aria-hidden='true'>
          <path d='M7 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2' />
          <path d='M7 10h9.2a2 2 0 0 1 1.95 2.43l-1.2 6A2 2 0 0 1 15 20H7' />
          <path d='M7 10V6.8a3 3 0 0 1 .88-2.12L10 2l1.5 1.5A2.5 2.5 0 0 1 12 5.27V10' />
        </svg>
      </FloatingButton>
    </FloatingButtonGroup>
  )
}
