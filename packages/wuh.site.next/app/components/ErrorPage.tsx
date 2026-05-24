'use client'

import type { ReactNode } from 'react'
import styled from '@wuh.site/components/styled'

type ErrorPageProps = {
  code: '404' | '500'
  title: string
  description: ReactNode
  children?: ReactNode
}

const Root = styled.div`
  flex: 1;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  font-family: var(--font-geist-sans);
`

const StatusCode = styled.p`
  margin: 0;
  font-size: clamp(96px, 14vw, 160px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--primary-color);
  opacity: 0.55;
  user-select: none;
`

const Title = styled.h1`
  margin: var(--space-lg) 0 0;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
`

const Description = styled.p`
  margin: var(--space-md) 0 0;
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.7;
  text-align: center;
  text-wrap: pretty;
  max-width: 480px;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-2xl);
  justify-content: center;
`

export default function ErrorPage({ code, title, description, children }: ErrorPageProps) {
  return (
    <Root>
      <StatusCode>{code}</StatusCode>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {children ? <Actions>{children}</Actions> : null}
    </Root>
  )
}
