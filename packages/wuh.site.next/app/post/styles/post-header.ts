import styled from '@wuh.site/components/styled'

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  order: 1;

  @media (max-width: 767px) {
    order: 2;
  }
`

export const Title = styled.h1`
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
`

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  color: color-mix(in oklab, var(--text-color) 76%, transparent);
  font-size: var(--font-size-sm);
  align-items: center;
`

export const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const CoverImage = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 360px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: var(--space-lg);
  order: 2;
  background: color-mix(in oklab, var(--background-200) 88%, var(--accent-color) 12%);
  animation: coverEnter 280ms ease-out both;

  @keyframes coverEnter {
    from { opacity: 0; transform: scale(1.02); }
    to { opacity: 1; transform: scale(1); }
  }

  @media (max-width: 767px) {
    width: calc(100% + 48px);
    height: clamp(220px, 60vw, 300px);
    aspect-ratio: auto;
    max-height: none;
    margin: 0 -24px var(--space-lg);
    border-radius: 0;
    order: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  > * { height: 100%; }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const PostLead = styled.div`
  display: flex;
  flex-direction: column;
`

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`

export const AuthorAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid color-mix(in oklab, var(--accent-color) 30%, transparent);
  flex-shrink: 0;
`

export const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);

  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`

export const Summary = styled.blockquote`
  margin: 0 0 var(--space-lg);
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--accent-color);
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.7;
  background: color-mix(in oklab, var(--accent-color) 6%, transparent);
  border-radius: 0 8px 8px 0;
`

export const OrnamentDivider = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  max-width: 360px;
  margin: var(--space-md) auto;
  color: var(--text-muted);
  opacity: 0.5;

  .divider-line {
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.35;
  }

  .divider-diamond {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
  }
`

export const BreadcrumbNav = styled.nav`
  margin-bottom: var(--space-md);
  color: var(--text-muted);
  font-size: var(--font-size-sm);

  ol {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li[aria-hidden='true'] {
    color: var(--normal-400);
    user-select: none;
  }
`

export const BreadcrumbLink = styled.a`
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--accent-color);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 36%, transparent);
    outline-offset: 2px;
    border-radius: 4px;
  }
`

export const BreadcrumbCurrent = styled(BreadcrumbLink)`
  max-width: min(52ch, 100%);
  overflow: hidden;
  color: var(--text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
`
