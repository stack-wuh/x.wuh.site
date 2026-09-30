'use client'

import Button from '@wuh.site/components/button'
import { IconChevronLeft } from '@wuh.site/components/icons'
import { useLocale } from '@wuh.site/components/locales'
import * as S from './styles'
import type { BackHomeLinkProps } from './specs'

export default function BackHomeLink({ href = '/', label }: BackHomeLinkProps) {
  const { t } = useLocale()
  return (
    <S.Wrapper>
      <Button
        href={href}
        variant='text'
        color='secondary'
        size='small'
        icon={<IconChevronLeft />}
        iconPosition='left'
      >
        {label ?? t('site.backHome')}
      </Button>
    </S.Wrapper>
  )
}
