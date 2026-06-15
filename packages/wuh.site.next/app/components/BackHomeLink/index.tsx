'use client'

import styled from '@wuh.site/components/styled'
import Button from '@wuh.site/components/button'
import { IconChevronLeft } from '@wuh.site/components/icons'

const Wrapper = styled.span`
  display: inline-flex;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 4px;
    right: 4px;
    height: 1.5px;
    background: var(--primary-color);
    transform: scaleX(0);
    transition: transform 0.25s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &:hover .button-icon {
    transform: translateX(3px);
  }

  .button-icon {
    transition: transform 0.25s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after,
    .button-icon {
      transition: none;
    }
  }
`

type Props = {
  href: string
  label?: string
}

export default function BackHomeLink({ href, label = '返回首页' }: Props) {
  return (
    <Wrapper>
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
    </Wrapper>
  )
}
