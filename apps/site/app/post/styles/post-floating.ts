import styled, { keyframes } from '@wuh.site/components/styled'
import Button from '@wuh.site/components/button'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

/** 点赞单次心跳：800ms 一次，不循环 */
const beat = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.28); }
  55% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

export const FloatingButton = styled(Button)`
  --btn-px: 0;
  --btn-py: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  outline: none;

  svg {
    width: 1em;
    height: 1em;
  }

  &:hover:not(:disabled) {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  &:active:not(:disabled) {
    transform: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--background-100), 0 0 0 4px var(--primary-300);
  }
`

export const LikeButton = styled(Button)<{ $beat?: boolean }>`
  --btn-px: 0;
  --btn-py: 0;
  width: auto;
  padding: 0 20px;
  gap: 8px;
  border-radius: 999px;
  background: var(--background-100) !important;
  border-color: color-mix(in oklab, var(--primary-color) 40%, transparent) !important;
  color: var(--primary-color);

  svg {
    width: 1em;
    height: 1em;
  }

  &:hover:not(:disabled) {
    background: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
    color: #fff;
  }

  &:active:not(:disabled) {
    transform: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--background-100), 0 0 0 4px var(--primary-300);
  }

  ${({ $beat }) => ($beat ? `svg { animation: ${beat} 800ms ease; }` : '')}

  @media (prefers-reduced-motion: reduce) {
    ${({ $beat }) => ($beat ? `svg { animation: none; }` : '')}
  }
`

export const FloatingButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: var(--space-sm);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`
