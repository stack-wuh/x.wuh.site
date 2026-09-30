'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Button from '@wuh.site/components/button'
import Divider from '@wuh.site/components/divider'
import { useLocale, type Locale, type TranslateParams } from '@wuh.site/components/locales'
import { IconGithub, IconTag } from '@wuh.site/components/icons'
import Image from '@wuh.site/components/image'
import message from '@wuh.site/components/message'
import * as S from './styles'
import { NICKNAME_STORAGE_KEY, type PostComment, type PostCommentsProps } from './specs'

type TranslateFn = (key: string, params?: TranslateParams) => string

/** toLocaleDateString 的 locale 参数随界面语言切换 */
const DATE_LOCALES: Record<Locale, string> = { zh: 'zh-CN', en: 'en', ja: 'ja' }

function formatTime(dateStr: string | undefined, t: TranslateFn, dateLocale: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return t('post.comments.justNow')
  if (diffMin < 60) return t('post.comments.minutesAgo', { n: diffMin })

  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return t('post.comments.hoursAgo', { n: diffHour })

  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return t('post.comments.daysAgo', { n: diffDay })

  return date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })
}

function getAvatarInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function getAvatarUrl(comment: PostComment): string | null {
  if (comment.user?.avatarUrl) return comment.user.avatarUrl
  if (comment.avatarUrl) return comment.avatarUrl
  return null
}

function getDisplayName(comment: PostComment, anonymousText: string): string {
  if (comment.user?.login) return comment.user.login
  return comment.nickname || anonymousText
}

function isGithubComment(comment: PostComment): boolean {
  return Boolean(comment.user?.login)
}

export default function PostComments({ issueNumber }: PostCommentsProps) {
  const { locale, t } = useLocale()
  const [comments, setComments] = useState<PostComment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    setLoadFailed(false)
    try {
      const res = await fetch(`/api/comments?issueNumber=${issueNumber}&limit=50`, { cache: 'no-store' })
      if (!res.ok) throw new Error('评论加载失败')
      const data = await res.json()
      const list = data.data || data || []
      if (!Array.isArray(list)) throw new Error('数据格式异常')
      setComments(list.filter((c: PostComment) => c.status !== 'rejected'))
    } catch {
      setLoadFailed(true)
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
        throw new Error(data.message || t('post.comments.submitFailed'))
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
      message.success(t('post.comments.submitted'))
    } catch (error) {
      const msg = error instanceof Error ? error.message : t('post.comments.submitFailed')
      message.error(msg)
    } finally {
      setSubmitting(false)
    }
  }, [canSubmit, submitting, trimmedNickname, trimmedContent, issueNumber, t])

  const totalCount = comments.length

  return (
    <S.Wrapper>
      <S.CommentsHeader>
        {t('post.comments.title')}{totalCount > 0 ? ` (${totalCount})` : ''}
      </S.CommentsHeader>
      <Divider style={{ margin: '10px 0 var(--space-sm)' }} />

      {loading ? (
        <S.LoadingState>{t('post.comments.loading')}</S.LoadingState>
      ) : comments.length === 0 ? (
        loadFailed ? <S.EmptyState>{t('post.comments.loadFailed')}</S.EmptyState> : <S.EmptyState>{t('post.comments.empty')}</S.EmptyState>
      ) : (
        comments.map((comment) => (
          <S.CommentItem key={comment._id || comment.externalId} $isGithub={isGithubComment(comment)}>
            <S.CommentAvatar>
              {getAvatarUrl(comment) ? (
                <Image
                  role='avatar'
                  src={getAvatarUrl(comment)!}
                  alt={getDisplayName(comment, t('post.comments.anonymous'))}
                  width={36}
                  height={36}
                  errorFallback={<S.AvatarFallback>{getAvatarInitial(getDisplayName(comment, t('post.comments.anonymous')))}</S.AvatarFallback>}
                />
              ) : (
                getAvatarInitial(getDisplayName(comment, t('post.comments.anonymous')))
              )}
            </S.CommentAvatar>
            <S.CommentBody>
              <S.CommentMeta>
                <S.CommentAuthor>{getDisplayName(comment, t('post.comments.anonymous'))}</S.CommentAuthor>
                <S.CommentTime>{formatTime(comment.createdAtGitHub || comment.createdAt, t, DATE_LOCALES[locale])}</S.CommentTime>
                {isGithubComment(comment) ? (
                  <S.CommentSource><IconGithub /> GitHub</S.CommentSource>
                ) : (
                  <S.CommentSource><IconTag /> {t('post.comments.sourceSite')}</S.CommentSource>
                )}
                {comment.status === 'pending' && (
                  <S.CommentStatusBadge $status='pending'>{t('post.comments.statusPending')}</S.CommentStatusBadge>
                )}
                {comment.status === 'approved' && (
                  <S.CommentStatusBadge $status='approved'>{t('post.comments.statusApproved')}</S.CommentStatusBadge>
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
            placeholder={t('post.comments.nicknamePlaceholder')}
            maxLength={20}
          />
        </S.NicknameRow>
        <S.ContentTextarea
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('post.comments.contentPlaceholder')}
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
            {submitting ? t('post.comments.submitting') : t('post.comments.submit')}
          </Button>
        </S.SubmitRow>
      </S.InputArea>
    </S.Wrapper>
  )
}
