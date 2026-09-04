'use client'

import styled from 'styled-components'

const BREAKPOINT_MOBILE = '768px'

export const StyledFooter = styled.div`
  padding: var(--space-xl) var(--space-2xl);
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  border-top: 1px solid color-mix(in oklab, var(--text-muted) 18%, transparent);

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    padding: var(--space-md) var(--space-md);

    .footer-inner {
      flex-direction: column;
      align-items: center;
      gap: var(--space-xl);
    }

    .footer-row {
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);
    }

    .footer-col {
      align-items: center;
    }
  }
`

export const StatsText = styled.div`
  font-size: var(--font-size-sm);
`
