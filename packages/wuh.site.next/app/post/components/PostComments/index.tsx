'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Button from '@wuh.site/components/button'
import { IconGithub, IconTag } from '@wuh.site/components/icons'
import Image from '@wuh.site/components/image'
import message from '@wuh.site/components/message'
import * as S from './styles'
import { NICKNAME_STORAGE_KEY, type PostComment, type PostCommentsProps } from './specs'

function formatTime(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin} 分钟前`

  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} 小时前`

  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay} 天前`

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getAvatarInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function getAvatarUrl(comment: PostComment): string | null {
  if (comment.user?.avatarUrl) return comment.user.avatarUrl
  if (comment.avatarUrl) return comment.avatarUrl
  return null
}

function getDisplayName(comment: PostComment): string {
  if (comment.user?.login) return comment.user.login
  return comment.nickname || '匿名'
}

function isGithubComment(comment: PostComment): boolean {
  return Boolean(comment.user?.login)
}

export default function PostComments({ issueNumber }: PostCommentsProps) {
  const [comments, setComments] = useState<PostComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/comments?issueNumber=${issueNumber}&limit=50`, { cache: 'no-store' })
      if (!res.ok) throw new Error('评论加载失败')
      const data = await res.json()
      const list = data.data || data || []
      if (!Array.isArray(list)) throw new Error('数据格式异常')
      setComments(list.filter((c: PostComment) => c.status !== 'rejected'))
    } catch {
      setError('评论加载失败')
    } finally {
      setLoading(false)
    }
  }, [issueNumber])

  useEffect(() => {
    fetchComments()
    try {
      const saved = window.localStorage.getItem(NICKNAME_STORAGE_KEY)
      if (saved) setNickname(saved)
    } catch { /* noop */ }
  }, [fetchComments])

  const trimmedNickname = nickname.trim()
  const trimmedContent = content.trim()
  const canSubmit = trimmedNickname.length >= 2 && trimmedContent.length >= 5

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: trimmedNickname,
          content: trimmedContent,
          issueNumber,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || '评论提交失败')
      }

      try { window.localStorage.setItem(NICKNAME_STORAGE_KEY, trimmedNickname) } catch { /* noop */ }

      const optimistic: PostComment = {
        _id: data._id || `optimistic-${Date.now()}`,
        issueNumber,
        body: trimmedContent,
        nickname: trimmedNickname,
        avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(trimmedNickname)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      setComments((prev) => [...prev, optimistic])
      setContent('')
      message.success('评论已提交，等待审核')
    } catch (error) {
      const msg = error instanceof Error ? error.message : '评论提交失败'
      message.error(msg)
    } finally {
      setSubmitting(false)
    }
  }, [canSubmit, submitting, trimmedNickname, trimmedContent, issueNumber])

  const totalCount = comments.length

  return (
    <S.Wrapper>
      <S.CommentsHeader>
        评论{totalCount > 0 ? ` (${totalCount})` : ''}
      </S.CommentsHeader>

      {loading ? (
        <S.LoadingState>加载中...</S.LoadingState>
      ) : comments.length === 0 ? (
        error ? <S.EmptyState>{error}</S.EmptyState> : <S.EmptyState>还没有评论，来发表第一条吧。</S.EmptyState>
      ) : (
        comments.map((comment) => (
          <S.CommentItem key={comment._id || comment.externalId} $isGithub={isGithubComment(comment)}>
            <S.CommentAvatar>
              {getAvatarUrl(comment) ? (
                <Image
                  role='avatar'
                  src={getAvatarUrl(comment)!}
                  alt={getDisplayName(comment)}
                  width={36}
                  height={36}
                  errorFallback={<S.AvatarFallback>{getAvatarInitial(getDisplayName(comment))}</S.AvatarFallback>}
                />
              ) : (
                getAvatarInitial(getDisplayName(comment))
              )}
            </S.CommentAvatar>
            <S.CommentBody>
              <S.CommentMeta>
                <S.CommentAuthor>{getDisplayName(comment)}</S.CommentAuthor>
                <S.CommentTime>{formatTime(comment.createdAtGitHub || comment.createdAt)}</S.CommentTime>
                {isGithubComment(comment) ? (
                  <S.CommentSource><IconGithub /> GitHub</S.CommentSource>
                ) : (
                  <S.CommentSource><IconTag /> 网站</S.CommentSource>
                )}
                {comment.status === 'pending' && (
                  <S.CommentStatusBadge $status='pending'>审核中</S.CommentStatusBadge>
                )}
                {comment.status === 'approved' && (
                  <S.CommentStatusBadge $status='approved'>已同步到 Issue</S.CommentStatusBadge>
                )}
              </S.CommentMeta>
              <S.CommentText>
                {comment.bodyHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: comment.bodyHtml }} />
                ) : (
                  comment.body
                )}
              </S.CommentText>
            </S.CommentBody>
          </S.CommentItem>
        ))
      )}

      <S.InputArea>
        <S.NicknameRow>
          <S.NicknameInput
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder='你的昵称'
            maxLength={20}
          />
        </S.NicknameRow>
        <S.ContentTextarea
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='说点什么...'
          maxLength={500}
        />
        <S.SubmitRow>
          <Button
            variant='filled'
            color='primary'
            size='small'
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
          >
            {submitting ? '提交中...' : '发表评论'}
          </Button>
        </S.SubmitRow>
      </S.InputArea>
    </S.Wrapper>
  )
}
