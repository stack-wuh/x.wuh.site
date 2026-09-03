'use client'

import styled from 'styled-components'

const hairline = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'
const vermilionFade = 'color-mix(in oklab, var(--primary-color) 45%, transparent)'

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
  }

  &::before {
    background: linear-gradient(to right, transparent, ${vermilionFade});
  }

  &::after {
    background: linear-gradient(to left, transparent, ${vermilionFade});
  }
`

export const SOrnamentGlyph = styled.span`
  color: var(--primary-color);
  font-size: var(--font-size-xs);
  line-height: 1;
  opacity: 0.85;
`
