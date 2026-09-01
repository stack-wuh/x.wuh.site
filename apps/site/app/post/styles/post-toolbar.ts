import styled from '@wuh.site/components/styled'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

const hairline = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'

export const Toolbar = styled.nav`
  margin-top: var(--space-xl);
`

export const ToolbarMeta = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);

  > span {
    white-space: nowrap;
    letter-spacing: 0.04em;
    user-select: none;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 180ms ease;

    svg {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }

    &:hover {
      color: var(--primary-color);
    }
  }
`

export const SpreadLabel = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  white-space: nowrap;
`

export const SpreadTitle = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  transition: color 180ms ease;
`

export const SpreadArrow = styled.span`
  flex-shrink: 0;
  color: var(--text-muted);
  transition: color 180ms ease, transform 180ms ease;
`

export const Spread = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
  gap: clamp(14px, 3vw, 32px);
  align-items: center;
  margin-top: 12px;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`

export const SpreadDivider = styled.div`
  width: 1px;
  height: 44px;
  background: ${hairline};
  justify-self: center;

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    width: auto;
    height: 1px;
    justify-self: stretch;
  }
`

export const SpreadSide = styled.a<{ $next?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 44px;
  text-decoration: none;
  ${({ $next }) => ($next ? 'justify-content: flex-end;' : 'justify-content: flex-start;')}

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    padding: 12px 0;
  }

  &:hover ${SpreadTitle},
  &:hover ${SpreadArrow} {
    color: var(--primary-color);
  }

  &:hover ${SpreadArrow} {
    transform: translateX(${({ $next }) => ($next ? '3px' : '-3px')});
  }

  ${({ $disabled }) =>
    $disabled
      ? `pointer-events: none; cursor: default;
  ${SpreadTitle}, ${SpreadArrow} { opacity: 0.45; }`
      : ''}

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 24%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    ${SpreadTitle},
    ${SpreadArrow} {
      transition: none;
    }

    &:hover ${SpreadArrow} {
      transform: none;
    }
  }
`
