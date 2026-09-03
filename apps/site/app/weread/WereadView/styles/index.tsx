'use client'

import styled from 'styled-components'
import Image from '@wuh.site/components/image'

export const Root = styled.div`
  font-family: var(--font-sans);
  background: transparent;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: clamp(16px, 2.4vw, 48px) clamp(16px, 5vw, 48px);
`

export const Main = styled.main`
  width: min(720px, 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: var(--space-lg);
  padding: clamp(24px, 3vw, 48px) clamp(12px, 3vw, 40px);
`

export const BookList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`

export const BookRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
`

export const BookCover = styled(Image)`
  width: 40px;
  height: 54px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`

export const BookInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const BookTitle = styled.div`
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
`

export const BookMeta = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: 2px;
`

export const CountTag = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  flex-shrink: 0;
`
