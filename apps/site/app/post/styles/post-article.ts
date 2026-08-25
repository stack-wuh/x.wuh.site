import styled from '@wuh.site/components/styled'
import Card from '@wuh.site/components/card'
import Empty from '@wuh.site/components/empty'

export const ArticleCard = styled.section`
  background: var(--background-100);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-card);
  padding: var(--space-lg);
  color: var(--text-primary);
  box-shadow:
    var(--elevation-card),
    inset 0 1px 0 rgba(255,255,255,0.5);
  transition: box-shadow var(--transition-fast) ease, border-color var(--transition-fast) ease;

  @media (max-width: 640px) {
    padding: var(--space-sm);
  }

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 35%, rgba(0,0,0,0.06));
    box-shadow:
      var(--elevation-card-hover),
      inset 0 1px 0 rgba(255,255,255,0.5);
  }

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
    box-shadow:
      var(--elevation-card),
      inset 0 1px 0 rgba(255,255,255,0.03);

    &:hover {
      box-shadow:
        var(--elevation-card-hover),
        inset 0 1px 0 rgba(255,255,255,0.03);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const RedundantInfoCard = styled(Card)`
  margin-top: var(--space-md);
  width: 100%;
  border-radius: var(--radius-card);
  border-color: color-mix(in oklab, var(--primary-color) 12%, var(--normal-300) 88%);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in oklab, var(--primary-color) 7%, transparent), transparent 52%),
    linear-gradient(
      180deg,
      color-mix(in oklab, var(--background-100) 97%, var(--primary-color) 3%),
      var(--background-100)
    );
  box-shadow: none;

  @media (max-width: 640px) {
    padding: var(--space-sm);
  }
`

export const ShareInfoCard = styled(RedundantInfoCard)`
  margin-top: var(--space-sm);
`

export const ShareCardInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-sm);

  > div {
    margin-top: 0 !important;
    padding: 0 !important;
    border-top: none !important;
    align-items: center;
    gap: var(--space-xs);
  }

  button {
    background: transparent !important;
    border-color: var(--normal-300) !important;
    border-radius: 4px !important;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }

  @media (prefers-color-scheme: dark) {
    button {
      border-color: var(--normal-500) !important;
    }
  }
`

export { MarkdownBody } from './post-markdown'

export const StatusEmpty = styled(Empty)`
  margin-bottom: var(--space-lg);
  min-height: 220px;
`

export const CommentPlaceholder = styled(Empty)`
  margin-top: var(--space-md);
`

export const RelatedPostsSection = styled.section`
  margin-top: var(--space-md);
  background: var(--background-100);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--radius-card);
  padding: var(--space-sm) var(--space-md);
  box-shadow:
    var(--elevation-card),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: box-shadow var(--transition-fast) ease, border-color var(--transition-fast) ease;

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 35%, rgba(0, 0, 0, 0.06));
    box-shadow:
      var(--elevation-card-hover),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 640px) {
    padding: var(--space-sm);
  }

  @media (prefers-color-scheme: dark) {
    border-color: color-mix(in oklab, var(--normal-700) 60%, transparent);
    box-shadow:
      var(--elevation-card),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);

    &:hover {
      box-shadow:
        var(--elevation-card-hover),
        inset 0 1px 0 rgba(255, 255, 255, 0.03);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  ul {
    display: grid;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li:last-child > a {
    border-bottom-color: transparent;
  }
`

export const RelatedPostsHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid color-mix(in oklab, var(--normal-300) 50%, transparent);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 2px;
  }
`

export const RelatedPostsHeading = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: var(--font-size-md);
  font-weight: 500;

  &::before {
    content: '◇';
    color: var(--accent-color);
    font-family: var(--font-sans);
    font-size: 10px;
  }
`

export const RelatedPostsCount = styled.span`
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  white-space: nowrap;
`

export const RelatedPostIndex = styled.span`
  padding-top: 2px;
  color: var(--accent-color);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

export const RelatedPostContent = styled.span`
  display: grid;
  min-width: 0;
  gap: 4px;
`

export const RelatedPostTitle = styled.span`
  overflow: hidden;
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-weight: 500;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RelatedPostSummary = styled.span`
  display: -webkit-box;
  overflow: hidden;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`

export const RelatedPostLabels = styled.span`
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  line-height: 1.5;
`

export const RelatedPostArrow = styled.span`
  align-self: center;
  color: var(--text-muted);
  font-size: var(--font-size-base);
  transition: color 180ms ease, transform 180ms ease;
`

export const RelatedPostLink = styled.a`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--space-sm);
  min-height: 44px;
  padding: 14px 0;
  border-bottom: 1px solid color-mix(in oklab, var(--text-muted) 18%, transparent);
  color: var(--text-secondary);
  text-decoration: none;

  &:hover ${RelatedPostTitle},
  &:hover ${RelatedPostArrow} {
    color: var(--primary-color);
  }

  &:hover ${RelatedPostArrow} {
    transform: translateX(3px);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 36%, transparent);
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 24px minmax(0, 1fr) auto;
  }

  @media (max-width: 420px) {
    gap: var(--space-xs);
  }

  @media (prefers-reduced-motion: reduce) {
    ${RelatedPostArrow} {
      transition: none;
    }

    &:hover ${RelatedPostArrow} {
      transform: none;
    }
  }
`
