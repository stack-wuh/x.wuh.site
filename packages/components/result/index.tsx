'use client'

import * as React from 'react'
import styled from 'styled-components'
import { IconCompass, IconWarning } from '../icons'

export type ResultStatus = '404' | '500' | 'info' | 'error'

export type ResultLink = {
  label: string
  href?: string
  target?: string
  rel?: string
}

export type ResultProps = React.HTMLAttributes<HTMLElement> & {
  status?: ResultStatus
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  links?: ResultLink[]
  extra?: React.ReactNode
}

const Root = styled.section`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: var(--text-primary);
`

const Card = styled.div`
  width: 100%;
  max-width: 760px;
  border-radius: 18px;
  border: 1px solid var(--normal-300);
  background: var(--background-100);
  box-shadow: var(--elevation-soft);
  padding: 36px 40px;
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: 28px 24px;
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-800);
    border-color: var(--normal-600);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  }
`

const IconWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, color-mix(in oklab, var(--primary-color) 10%, transparent), transparent 60%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);

  svg {
    width: 32px;
    height: 32px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`

const StatusText = styled.span<{ $status: ResultStatus }>`
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => (p.$status === '404' || p.$status === '500' ? 'var(--danger-color)' : 'var(--text-muted)')};
  background: ${(p) =>
    p.$status === '404' || p.$status === '500'
      ? 'color-mix(in oklab, var(--danger-color) 14%, transparent)'
      : 'color-mix(in oklab, var(--normal-300) 12%, transparent)'};
  padding: 6px 10px;
  border-radius: 999px;
  width: fit-content;
`

const Title = styled.h1`
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
`

const Description = styled.p`
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.7;
`

const LinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`

const LinkItem = styled.a`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--normal-300);
  text-decoration: none;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 8%, transparent);
  }

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
  }
`

const LinkText = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px dashed var(--normal-300);
  font-size: var(--font-size-xs);
  color: var(--text-muted);

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
  }
`

const ExtraRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`

const DEFAULT_CONTENT: Record<'404' | '500', { title: string; description: string; icon: React.ReactNode }> = {
  '404': {
    title: '页面不存在',
    description: '我们找不到你要访问的页面。你可以前往其他平台继续阅读。',
    icon: <IconCompass />
  },
  '500': {
    title: '服务异常',
    description: '页面暂时无法加载，请稍后重试或查看其他平台的内容。',
    icon: <IconWarning />
  }
}

const resolveContent = (status?: ResultStatus) => {
  if (status === '404') return DEFAULT_CONTENT['404']
  if (status === '500') return DEFAULT_CONTENT['500']
  return {
    title: status === 'error' ? '发生错误' : '提示',
    description: '页面暂时不可用，请稍后再试。',
    icon: <IconWarning />
  }
}

const Result = React.forwardRef<HTMLElement, ResultProps>(function Result(props, ref) {
  const {
    status = 'info',
    title,
    description,
    icon,
    links,
    extra,
    children,
    ...rest
  } = props

  const resolved = resolveContent(status)

  return (
    <Root ref={ref} {...rest}>
      <Card>
        <IconWrap>{icon ?? resolved.icon}</IconWrap>
        <Content>
          <StatusText $status={status}>{status}</StatusText>
          <Title>{title ?? resolved.title}</Title>
          <Description>{description ?? resolved.description}</Description>
          {children}
          {links?.length ? (
            <LinkRow>
              {links.map((link) =>
                link.href ? (
                  <LinkItem key={link.label} href={link.href} target={link.target} rel={link.rel ?? 'noopener noreferrer'}>
                    {link.label}
                  </LinkItem>
                ) : (
                  <LinkText key={link.label}>{link.label}</LinkText>
                )
              )}
            </LinkRow>
          ) : null}
          {extra ? <ExtraRow>{extra}</ExtraRow> : null}
        </Content>
      </Card>
    </Root>
  )
})

export default Result
