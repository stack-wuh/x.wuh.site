'use client'

import * as React from 'react'
import { IconWarning } from '../icons'
import * as S from './styles'
import { DEFAULT_CONTENT, type ResultProps, type ResultStatus } from './specs'

export type { ResultLink, ResultProps, ResultStatus } from './specs'

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
    <S.Root ref={ref} {...rest}>
      <S.Card>
        <S.IconWrap>{icon ?? resolved.icon}</S.IconWrap>
        <S.Content>
          <S.StatusText $status={status}>{status}</S.StatusText>
          <S.Title>{title ?? resolved.title}</S.Title>
          <S.Description>{description ?? resolved.description}</S.Description>
          {children}
          {links?.length ? (
            <S.LinkRow>
              {links.map((link) =>
                link.href ? (
                  <S.LinkItem key={link.label} href={link.href} target={link.target} rel={link.rel ?? 'noopener noreferrer'}>
                    {link.label}
                  </S.LinkItem>
                ) : (
                  <S.LinkText key={link.label}>{link.label}</S.LinkText>
                )
              )}
            </S.LinkRow>
          ) : null}
          {extra ? <S.ExtraRow>{extra}</S.ExtraRow> : null}
        </S.Content>
      </S.Card>
    </S.Root>
  )
})

export default Result
