'use client'

import { useState, useCallback, useEffect } from 'react'
import message from '@wuh.site/components/message'
import { IconHome, IconArrowUp, IconThumbUp } from '@wuh.site/components/icons'
import { FloatingButtonGroup, FloatingButton, LikeButton } from '../styles'

export default function FloatingActions({ issueNumber, initialLikeCount = 0, initialLiked = false }: {
  issueNumber: number
  initialLikeCount?: number
  initialLiked?: boolean
}) {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLiked(initialLiked)
  }, [initialLiked])

  useEffect(() => {
    setLikeCount(initialLikeCount)
  }, [initialLikeCount])

  const handleLike = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/content/posts/${issueNumber}/like`, { method: 'POST' })
      const data = await res.json()
      if (data.liked) {
        setLiked(true)
        setLikeCount((c) => c + 1)
      } else {
        setLiked(false)
        setLikeCount((c) => Math.max(0, c - 1))
      }
    } catch {
      message.error('点赞失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }, [issueNumber, loading])

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
        aria-label={liked ? '取消点赞' : '点赞'}
        title={liked ? '取消点赞' : '点赞'}
        onClick={handleLike}
        disabled={loading}
        style={liked ? { opacity: 0.8 } : undefined}
      >
        <IconThumbUp />
        <span>{liked ? `已赞 ${likeCount}` : likeCount > 0 ? `赞 ${likeCount}` : '点赞'}</span>
      </LikeButton>
    </FloatingButtonGroup>
  )
}
