'use client'

import styled from '@wuh.site/components/styled'

export const PageWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px 80px;

  @media (max-width: 640px) {
    padding: 32px 16px 64px;
  }
`

export const PageHeader = styled.header`
  margin-bottom: 40px;
`

export const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
`

export const PageSubtitle = styled.p`
  font-size: 0.86rem;
  color: var(--text-muted);
  margin: 0;
`

export const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const CommentItem = styled.li`
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

export const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`

export const CommentNickname = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
`

export const CommentTime = styled.time`
  font-size: 0.72rem;
  color: var(--text-muted);
`

export const CommentContent = styled.p`
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-secondary);
  overflow-wrap: anywhere;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 64px 0;
  color: var(--text-muted);
  text-align: center;
`

export const EmptyText = styled.p`
  margin: 0;
  font-size: 0.88rem;
`

export const BackLink = styled.a`
  font-size: 0.82rem;
  color: var(--primary-color);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
