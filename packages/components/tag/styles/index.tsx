'use client'

import styled from 'styled-components'

export const Chip = styled.span<{ $color: string }>`
  font-size: 12px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 4px;
  background: color-mix(in oklab, ${({ $color }) => $color} 12%, var(--background-100) 88%);
  color: var(--text-primary);
  border-left: 2.5px solid color-mix(in oklab, ${({ $color }) => $color} 50%, var(--text-muted) 50%);
  white-space: nowrap;
  transition: background-color var(--transition-fast) ease, border-color var(--transition-fast) ease;

  &:hover {
    background: color-mix(in oklab, ${({ $color }) => $color} 20%, var(--background-100) 80%);
    border-left-color: ${({ $color }) => $color};
  }
`
