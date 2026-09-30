'use client'

import { useState, useCallback, useEffect } from 'react'
import message from '@wuh.site/components/message'
import { useLocale } from '@wuh.site/components/locales'
import { IconHome, IconArrowUp, IconThumbUp } from '@wuh.site/components/icons'
import { FloatingButtonGroup, FloatingButton, LikeButton } from '../../styles'
import type { FloatingActionsProps } from './specs'

export default function FloatingActions({ issueNumber, initialLikeCount = 0, initialLiked = false, variant = 'default' }: FloatingActionsProps) {
  const { t } = useLocale()
  const compact = variant === 'compact'
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
      message.error(t('post.floating.likeFailed'))
    } finally {
      setLoading(false)
    }
  }, [issueNumber, loading, t])

  return (
    <FloatingButtonGroup $compact={compact}>
      <FloatingButton
        $compact={compact}
        variant="outlined"
        color="secondary"
        size="small"
        icon={<IconHome />}
        type='button'
        aria-label={t('post.floating.home')}
        title={t('post.floating.home')}
        onClick={() => {
          window.location.href = '/'
        }}
      />
      <FloatingButton
        $compact={compact}
        variant="outlined"
        color="secondary"
        size="small"
        icon={<IconArrowUp />}
        type='button'
        aria-label={t('post.floating.top')}
        title={t('post.floating.top')}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
      <LikeButton
        $compact={compact}
        variant="outlined"
        color="primary"
        size="small"
        icon={<IconThumbUp />}
        type='button'
        aria-label={liked ? t('post.floating.unlike') : t('post.floating.like')}
        title={liked ? t('post.floating.unlike') : t('post.floating.like')}
        onClick={handleLike}
        disabled={loading}
        style={liked ? { opacity: 0.8 } : undefined}
      >
        {liked
          ? t('post.floating.liked', { n: likeCount })
          : likeCount > 0
            ? t('post.floating.likeCount', { n: likeCount })
            : t('post.floating.like')}
        {compact && !liked && (
          <span className='like-hint' aria-hidden='true'>
            {t('post.floating.likeHint')}
          </span>
        )}
      </LikeButton>
    </FloatingButtonGroup>
  )
}
