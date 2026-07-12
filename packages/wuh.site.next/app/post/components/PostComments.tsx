'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from '@wuh.site/components/styled'
import Button from '@wuh.site/components/button'
import { IconGithub, IconTag } from '@wuh.site/components/icons'
import message from '@wuh.site/components/message'

type Comment = {
  _id?: string
  externalId?: string | number
  issueNumber: number
  body: string
  bodyHtml?: string
  user?: {
    login: string
    avatarUrl: string
    url: string
  } | null
  nickname?: string
  avatarUrl?: string
  status?: 'pending' | 'approved' | 'rejected'
  createdAtGitHub?: string
  createdAt?: string
}

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

function getAvatarText(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function getAvatarUrl(comment: Comment): string | null {
  if (comment.user?.avatarUrl) return comment.user.avatarUrl
  if (comment.avatarUrl) return comment.avatarUrl
  return null
}

function getDisplayName(comment: Comment): string {
  if (comment.user?.login) return comment.user.login
  return comment.nickname || '匿名'
}

function isGithubComment(comment: Comment): boolean {
  return Boolean(comment.user?.login)
}

// Styles
const Wrapper = styled.div`
  margin-top: var(--space-xl);
`

const CommentsHeader = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-md);
`

const CommentItem = styled.div<{ $isGithub?: boolean }>`
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid color-mix(in oklab, var(--normal-300) 20%, transparent);

  &:last-child {
    border-bottom: none;
  }
`

const CommentAvatar = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: color-mix(in oklab, var(--primary-color) 14%, var(--background-100));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-color);
  border: 1px solid color-mix(in oklab, var(--primary-color) 18%, transparent);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const CommentBody = styled.div`
  flex: 1;
  min-width: 0;
`

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: var(--font-size-sm);
`

const CommentAuthor = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`

const CommentTime = styled.time`
  color: var(--text-muted);
  font-size: var(--font-size-xs);
`

const CommentSource = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--text-muted);
  padding: 1px 6px;
  border-radius: 4px;
  background: color-mix(in oklab, var(--normal-300) 12%, transparent);
`

const CommentText = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  word-break: break-word;
`

const CommentStatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  color: ${({ $status }) =>
    $status === 'approved' ? 'var(--success-color)' :
    $status === 'pending' ? 'var(--warning-color)' :
    'var(--danger-color)'};
  background: ${({ $status }) =>
    $status === 'approved' ? 'color-mix(in oklab, var(--success-color) 10%, transparent)' :
    $status === 'pending' ? 'color-mix(in oklab, var(--warning-color) 10%, transparent)' :
    'color-mix(in oklab, var(--danger-color) 10%, transparent)'};
`

const InputArea = styled.div`
  margin-top: var(--space-lg);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 24%, transparent);
  background: var(--background-100);
`

const NicknameRow = styled.div`
  margin-bottom: 10px;
`

const NicknameInput = styled.input`
  width: 100%;
  max-width: 200px;
  padding: 8px 12px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 36%, transparent);
  border-radius: 8px;
  background: var(--background-200);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  outline: none;

  &:focus {
    border-color: color-mix(in oklab, var(--primary-color) 36%, transparent);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`

const ContentTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 10px 12px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 36%, transparent);
  border-radius: 8px;
  background: var(--background-200);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    border-color: color-mix(in oklab, var(--primary-color) 36%, transparent);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`

const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 0;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
`

const LoadingState = styled.div`
  text-align: center;
  padding: 24px 0;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
`

const NICKNAME_STORAGE_KEY = 'wuh.site.comment.nickname'

type Props = {
  issueNumber: number
}

export default function PostComments({ issueNumber }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
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
      setComments(list.filter((c: Comment) => c.status !== 'rejected'))
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

      // Save nickname and add optimistic comment
      try { window.localStorage.setItem(NICKNAME_STORAGE_KEY, trimmedNickname) } catch { /* noop */ }

      const optimistic: Comment = {
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

  const approveCount = comments.filter((c) => c.status === 'approved').length
  const pendingCount = comments.filter((c) => c.status === 'pending').length
  const totalCount = comments.length

  return (
    <Wrapper>
      <CommentsHeader>
        评论{totalCount > 0 ? ` (${totalCount})` : ''}
      </CommentsHeader>

      {loading ? (
        <LoadingState>加载中...</LoadingState>
      ) : comments.length === 0 ? (
        error ? <EmptyState>{error}</EmptyState> : <EmptyState>还没有评论，来发表第一条吧。</EmptyState>
      ) : (
        comments.map((comment) => (
          <CommentItem key={comment._id || comment.externalId} $isGithub={isGithubComment(comment)}>
            <CommentAvatar>
              {getAvatarUrl(comment) ? (
                <img src={getAvatarUrl(comment)!} alt={getDisplayName(comment)} />
              ) : (
                getAvatarText(getDisplayName(comment))
              )}
            </CommentAvatar>
            <CommentBody>
              <CommentMeta>
                <CommentAuthor>{getDisplayName(comment)}</CommentAuthor>
                <CommentTime>{formatTime(comment.createdAtGitHub || comment.createdAt)}</CommentTime>
                {isGithubComment(comment) ? (
                  <CommentSource><IconGithub /> GitHub</CommentSource>
                ) : (
                  <CommentSource><IconTag /> 网站</CommentSource>
                )}
                {comment.status === 'pending' && (
                  <CommentStatusBadge $status='pending'>审核中</CommentStatusBadge>
                )}
                {comment.status === 'approved' && (
                  <CommentStatusBadge $status='approved'>已同步到 Issue</CommentStatusBadge>
                )}
              </CommentMeta>
              <CommentText>
                {comment.bodyHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: comment.bodyHtml }} />
                ) : (
                  comment.body
                )}
              </CommentText>
            </CommentBody>
          </CommentItem>
        ))
      )}

      <InputArea>
        <NicknameRow>
          <NicknameInput
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder='你的昵称'
            maxLength={20}
          />
        </NicknameRow>
        <ContentTextarea
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='说点什么...'
          maxLength={500}
        />
        <SubmitRow>
          <Button
            variant='filled'
            color='primary'
            size='small'
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
          >
            {submitting ? '提交中...' : '发表评论'}
          </Button>
        </SubmitRow>
      </InputArea>
    </Wrapper>
  )
}
