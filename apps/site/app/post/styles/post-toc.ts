import styled from '@wuh.site/components/styled'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

const hairline = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'

export const TocAside = styled.aside`
  display: none;

  @media (min-width: ${BREAKPOINTS.tablet}px) {
    display: block;
    position: sticky;
    top: 88px;
    align-self: start;
  }
`

export const TocTitle = styled.div`
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  font-weight: 500;
  letter-spacing: 0.32em;
  color: var(--text-secondary);
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid ${hairline};
`

export const TocList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0;
  margin: 0;
`

export const TocItemLink = styled.a<{ $active?: boolean; $depth?: number }>`
  position: relative;
  display: block;
  text-decoration: none;
  font-size: var(--font-size-xs);
  line-height: 1.6;
  padding: 5px 4px 5px 14px;
  margin-left: ${({ $depth }) => `${Math.max(0, ($depth ?? 2) - 2) * 12}px`};
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'var(--text-secondary)')};
  transition: color 180ms ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    border-radius: 999px;
    background: linear-gradient(180deg, var(--primary-color), var(--accent-color));
    transition: height 200ms ease;
  }

  ${({ $active }) => ($active ? '&::before { height: 14px; }' : '')}

  &:hover {
    color: var(--text-primary);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      transition: none;
    }
  }
`

export const TocMobile = styled.details`
  margin: 0 0 var(--space-md);
  border-top: 1px solid ${hairline};
  border-bottom: 1px solid ${hairline};

  @media (min-width: ${BREAKPOINTS.tablet}px) {
    display: none;
  }

  summary {
    list-style: none;
    cursor: pointer;
    padding: 12px 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-family: var(--font-serif);
    font-size: var(--font-size-sm);
    font-weight: 500;
    letter-spacing: 0.32em;
    color: var(--text-secondary);
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary > span {
    letter-spacing: 0;
    transition: transform 200ms ease;
  }

  &[open] summary > span {
    transform: rotate(180deg);
  }

  .toc-body {
    padding: 4px 2px 14px;
  }

  @media (prefers-reduced-motion: reduce) {
    summary > span {
      transition: none;
    }
  }
`
