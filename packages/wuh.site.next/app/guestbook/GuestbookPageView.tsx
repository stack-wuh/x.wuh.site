'use client'

import * as React from 'react'
import Link from 'next/link'
import Pagination from '@wuh.site/components/pagination'
import styled from '@wuh.site/components/styled'

interface GuestbookComment {
  id: string
  nickname: string
  content: string
  createdAt: string
}

interface PaginationInfo {
  total: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface GuestbookPageViewProps {
  comments: GuestbookComment[]
  pagination: PaginationInfo
  currentPage: number
}

const PageWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px 80px;

  @media (max-width: 640px) {
    padding: 32px 16px 64px;
  }
`

const PageHeader = styled.header`
  margin-bottom: 40px;
`

const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
`

const PageSubtitle = styled.p`
  font-size: 0.86rem;
  color: var(--text-muted);
  margin: 0;
`

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const CommentItem = styled.li`
  padding: 16px 18px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 40%, transparent);
  border-radius: 12px;
  background: var(--background-100);
  transition: border-color 180ms ease;

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 20%, var(--normal-300) 80%);
  }

  [data-color-scheme='dark'] & {
    border-color: color-mix(in oklab, var(--normal-600) 45%, transparent);
    background: color-mix(in oklab, var(--background-100) 90%, var(--background-200) 10%);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`

const CommentNickname = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
`

const CommentTime = styled.time`
  font-size: 0.72rem;
  color: var(--text-muted);
`

const CommentContent = styled.p`
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-secondary);
  overflow-wrap: anywhere;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 64px 0;
  color: var(--text-muted);
  text-align: center;
`

const EmptyText = styled.p`
  margin: 0;
  font-size: 0.88rem;
`

const BackLink = styled.a`
  font-size: 0.82rem;
  color: var(--primary-color);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

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
    <PageWrapper>
      <PageHeader>
        <PageTitle>留言板</PageTitle>
        <PageSubtitle>
          共 {pagination.total} 条留言 · 第 {currentPage} / {pagination.totalPages} 页
        </PageSubtitle>
      </PageHeader>

      {comments.length === 0 ? (
        <EmptyState>
          <EmptyText>暂时没有留言，快去打个招呼吧。</EmptyText>
          <BackLink as={Link} href='/about'>
            前往留言板 →
          </BackLink>
        </EmptyState>
      ) : (
        <CommentList aria-label='留言列表'>
          {comments.map((comment) => (
            <CommentItem key={comment.id}>
              <CommentMeta>
                <CommentNickname>{comment.nickname}</CommentNickname>
                <CommentTime dateTime={comment.createdAt}>
                  {formatCommentTime(comment.createdAt)}
                </CommentTime>
              </CommentMeta>
              <CommentContent>{comment.content}</CommentContent>
            </CommentItem>
          ))}
        </CommentList>
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          getPageUrl={(p) => `/guestbook?page=${p}`}
        />
      )}
    </PageWrapper>
  )
}
