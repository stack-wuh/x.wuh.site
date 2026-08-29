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

function formatCommentTime(createdAt: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(createdAt))
}

export default function GuestbookPageView({
  comments,
  pagination,
  currentPage,
}: GuestbookPageViewProps) {
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
          {comments.map((comment) => (
            <MessageCard key={comment.id} as='li'>
              <MessageMeta>
                <MessageName>{comment.nickname}</MessageName>
                <MessageTime dateTime={comment.createdAt}>
                  {formatCommentTime(comment.createdAt)}
                </MessageTime>
              </MessageMeta>
              <MessageContent>{comment.content}</MessageContent>
            </MessageCard>
          ))}
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
