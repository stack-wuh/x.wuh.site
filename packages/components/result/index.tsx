'use client'

import * as React from 'react'
import { useLocale } from '@wuh.site/components/locales'
import { IconWarning } from '../icons'
import * as S from './styles'
import { DEFAULT_CONTENT, type ResultProps, type ResultStatus } from './types'

export type { ResultLink, ResultProps, ResultStatus } from './types'

type TranslateFn = (key: string, params?: Record<string, string | number>) => string

const resolveContent = (status: ResultStatus | undefined, t: TranslateFn) => {
  if (status === '404') return DEFAULT_CONTENT['404']
  if (status === '500') return DEFAULT_CONTENT['500']
  return {
    title: status === 'error' ? t('components.result.errorTitle') : t('components.result.infoTitle'),
    description: t('components.result.unavailable'),
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

  const { t } = useLocale()
  const resolved = resolveContent(status, t)

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
