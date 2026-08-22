import styled from '@wuh.site/components/styled'

export const TocAside = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    position: sticky;
    top: 88px;
    align-self: start;
  }
`

export const TocCard = styled.div`
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, rgba(0,0,0,0.06) 85%, transparent);
  background: color-mix(in oklab, var(--background-100) 78%, transparent);
  box-shadow: var(--elevation-soft);
  padding: 16px 16px 12px;

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 55%, transparent);
  }
`

export const TocTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--text-primary) 75%, transparent);
  margin-bottom: 10px;
`

export const TocList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  margin: 0;
`

export const TocItemLink = styled.a<{ $active?: boolean; $depth?: number }>`
  display: block;
  text-decoration: none;
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'color-mix(in oklab, var(--text-primary) 84%, transparent)')};
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: ${({ $active }) => ($active ? 'color-mix(in oklab, var(--primary-color) 12%, transparent)' : 'transparent')};
  margin-left: ${({ $depth }) => `${Math.min(2, Math.max(0, ($depth ?? 2) - 2)) * 10}px`};
  transition: background var(--transition-fast) ease, border-color var(--transition-fast) ease, color var(--transition-fast) ease;

  &:hover {
    color: var(--text-primary);
    background: color-mix(in oklab, var(--background-200) 80%, transparent);
    border-color: color-mix(in oklab, var(--primary-color) 18%, transparent);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 35%, transparent);
    outline-offset: 2px;
  }
`

export const TocMobile = styled.details`
  margin: 0 0 var(--space-md);
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, rgba(0,0,0,0.06) 85%, transparent);
  background: color-mix(in oklab, var(--background-100) 78%, transparent);
  box-shadow: var(--elevation-soft);
  overflow: hidden;

  @media (min-width: 1024px) {
    display: none;
  }

  summary {
    list-style: none;
    cursor: pointer;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-weight: 700;
    color: var(--text-primary);
  }

  summary::-webkit-details-marker {
    display: none;
  }

  &[open] summary {
    border-bottom: 1px solid color-mix(in oklab, rgba(0,0,0,0.06) 85%, transparent);
  }

  .toc-body {
    padding: 10px 10px 12px;
  }
`
