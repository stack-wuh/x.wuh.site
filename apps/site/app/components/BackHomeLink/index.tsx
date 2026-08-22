'use client'

import Button from '@wuh.site/components/button'
import { IconChevronLeft } from '@wuh.site/components/icons'
import * as S from './styles'
import type { BackHomeLinkProps } from './specs'

export default function BackHomeLink({ href, label = '返回首页' }: BackHomeLinkProps) {
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
        {label}
      </Button>
    </S.Wrapper>
  )
}
