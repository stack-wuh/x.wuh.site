'use client'

import { useState, useCallback } from 'react'
import message from '@wuh.site/components/message'
import { IconHome, IconArrowUp, IconThumbUp } from '@wuh.site/components/icons'
import { FloatingButtonGroup, FloatingButton, LikeButton } from '../styles'

export default function FloatingActions({ issueNumber, initialLikeCount = 0 }: {
  issueNumber: number
  initialLikeCount?: number
}) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [loading, setLoading] = useState(false)

  const handleLike = useCallback(async () => {
    if (liked || loading) return
    setLoading(true)
    try {
      const res = await fetch(`/v2/content/posts/${issueNumber}/like`, { method: 'POST' })
      const data = await res.json()
      if (data.liked) {
        setLiked(true)
        setLikeCount((c) => c + 1)
      } else {
        message.info('你已经点过赞了')
      }
    } catch {
      message.error('点赞失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }, [issueNumber, liked, loading])

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
        onClick={handleLike}
        disabled={loading}
        style={liked ? { opacity: 0.7, cursor: 'default' } : undefined}
      >
        <IconThumbUp />
        <span>{likeCount > 0 ? `赞 ${likeCount}` : '点赞'}</span>
      </LikeButton>
    </FloatingButtonGroup>
  )
}
