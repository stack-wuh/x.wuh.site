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
