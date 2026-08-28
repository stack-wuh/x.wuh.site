'use client'

import styled from '@wuh.site/components/styled'

export const Wrapper = styled.span`
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
    transition: transform var(--motion-dur-quick) var(--motion-ease-out-soft);
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &:hover .button-icon {
    transform: translateX(3px);
  }

  .button-icon {
    transition: transform var(--motion-dur-quick) var(--motion-ease-out-soft);
  }

  @media (prefers-reduced-motion: reduce) {
    &::after,
    .button-icon {
      transition: none;
    }
  }
`
