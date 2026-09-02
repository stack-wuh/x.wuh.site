'use client'

import styled from 'styled-components'

const hairline = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'

export const SDivider = styled.div`
  height: 1px;
  margin: var(--space-lg) 0;
  background: ${hairline};
`

export const SOrnament = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin: var(--space-lg) 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${hairline};
  }
`

export const SOrnamentGlyph = styled.span`
  color: var(--accent-color);
  font-size: var(--font-size-xs);
  line-height: 1;
  opacity: 0.85;
`
