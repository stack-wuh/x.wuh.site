'use client'

import Link from 'next/link'
import Pagination from '@wuh.site/components/pagination'
import {
  MessageCard,
  MessageContent,
  MessageMeta,
  MessageName,
  MessageTime,
} from '@wuh.site/components/message-card'
import * as S from './styles'
import type { GuestbookPageViewProps } from './specs'

function formatTime(createdAt: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(createdAt))
}

function formatDate(createdAt: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(createdAt))
}

function formatDateKey(createdAt: string): string {
  const d = new Date(createdAt)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function formatRelativeDate(createdAt: string): string {
  const now = new Date()
  const date = new Date(createdAt)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff === 2) return '前天'
  return formatDate(createdAt)
}

export default function GuestbookPageView({
  comments,
  pagination,
  currentPage,
}: GuestbookPageViewProps) {
  const grouped = comments.reduce<
    { date: string; dateLabel: string; items: typeof comments }[]
  >((acc, comment) => {
    const key = formatDateKey(comment.createdAt)
    const last = acc[acc.length - 1]
    if (last && last.date === key) {
      last.items.push(comment)
    } else {
      acc.push({
        date: key,
        dateLabel: formatRelativeDate(comment.createdAt),
        items: [comment],
      })
    }
    return acc
  }, [])

  return (
    <S.PageWrapper>
      <S.PageHeader>
        <S.PageTitle>留言板</S.PageTitle>
        <S.PageSubtitle>
          共 {pagination.total} 条留言 · 第 {currentPage} / {pagination.totalPages} 页
        </S.PageSubtitle>
      </S.PageHeader>

      {comments.length === 0 ? (
        <S.EmptyState>
          <S.EmptyText>暂时没有留言，快去打个招呼吧。</S.EmptyText>
          <S.BackLink as={Link} href='/about'>
            前往留言板 →
          </S.BackLink>
        </S.EmptyState>
      ) : (
        <S.CommentList aria-label='留言列表'>
          <S.Timeline>
            {grouped.map((group) => (
              <S.TimelineItem key={group.date}>
                {grouped.length > 1 && (
                  <S.TimelineDateLabel>
                    <S.TimelineDateText>{group.dateLabel}</S.TimelineDateText>
                  </S.TimelineDateLabel>
                )}
                {group.items.map((comment) => (
                  <S.TimelineCard key={comment.id}>
                    <S.TimelineDot />
                    <MessageCard>
                      <MessageMeta>
                        <MessageName>{comment.nickname}</MessageName>
                        <MessageTime dateTime={comment.createdAt}>
                          {formatTime(comment.createdAt)}
                        </MessageTime>
                      </MessageMeta>
                      <MessageContent>{comment.content}</MessageContent>
                    </MessageCard>
                  </S.TimelineCard>
                ))}
              </S.TimelineItem>
            ))}
          </S.Timeline>
        </S.CommentList>
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          getPageUrl={(p) => `/guestbook?page=${p}`}
        />
      )}
    </S.PageWrapper>
  )
}
