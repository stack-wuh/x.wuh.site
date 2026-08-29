import styled from '@wuh.site/components/styled'
import Card from '@wuh.site/components/card'
import Empty from '@wuh.site/components/empty'

export const ArticleCard = styled.section`
  background: var(--background-100);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-card);
  padding: 32px;
  color: var(--text-primary);
  box-shadow:
    var(--elevation-card),
    inset 0 1px 0 rgba(255,255,255,0.5);
  transition: box-shadow var(--transition-fast) ease, border-color var(--transition-fast) ease;

  @media (max-width: 640px) {
    padding: 20px;
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
  margin-top: var(--space-xl);
  padding: var(--space-lg);
  border: 1px solid color-mix(in oklab, var(--primary-color) 14%, var(--normal-300));
  border-radius: var(--radius-card);
  background:
    radial-gradient(circle at 12% 0%, color-mix(in oklab, var(--accent-color) 10%, transparent), transparent 34%),
    linear-gradient(135deg, color-mix(in oklab, var(--background-100) 94%, var(--primary-color) 6%), var(--background-100));

  > p {
    max-width: 34rem;
    margin: var(--space-xs) 0 var(--space-md);
    color: var(--text-secondary);
    font-family: var(--font-serif);
    font-size: var(--font-size-sm);
    line-height: 1.8;
  }

  ul {
    display: grid;
    gap: var(--space-sm);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li:nth-child(even) > a {
    margin-left: var(--space-md);
  }

  @media (max-width: 640px) {
    padding: var(--space-md);

    li:nth-child(even) > a {
      margin-left: 0;
    }
  }
`

export const RelatedPostsHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: var(--space-sm);

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
  font-size: var(--font-size-lg);
  font-weight: 500;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border: 1px solid color-mix(in oklab, var(--accent-color) 72%, transparent);
    border-radius: 999px;
    background: color-mix(in oklab, var(--accent-color) 18%, transparent);
  }
`

export const RelatedPostsCount = styled.span`
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  white-space: nowrap;
`

export const RelatedPostIndex = styled.span`
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  color: color-mix(in oklab, var(--primary-color) 42%, var(--text-muted));
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  font-variant-numeric: tabular-nums;
`

export const RelatedPostContent = styled.span`
  display: grid;
  min-width: 0;
  gap: 5px;
  padding-right: var(--space-lg);
`

export const RelatedPostTitle = styled.span`
  overflow: hidden;
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  font-weight: 500;
  line-height: 1.55;
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
  align-self: end;
  color: var(--text-muted);
  font-size: var(--font-size-base);
  transition: color 180ms ease, transform 180ms ease;
`

export const RelatedPostLink = styled.a`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: var(--space-sm);
  min-height: 44px;
  padding: var(--space-md);
  border: 1px solid color-mix(in oklab, var(--primary-color) 12%, var(--normal-300));
  border-radius: calc(var(--radius-card) - 6px);
  background:
    linear-gradient(180deg, color-mix(in oklab, var(--background-100) 98%, var(--accent-color) 2%), var(--background-100));
  box-shadow: 0 10px 24px color-mix(in oklab, var(--primary-color) 7%, transparent);
  color: var(--text-secondary);
  text-decoration: none;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 26px;
    height: 26px;
    border-bottom-left-radius: 10px;
    background: linear-gradient(225deg, color-mix(in oklab, var(--primary-color) 12%, transparent) 0 50%, transparent 52%);
  }

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 32%, var(--normal-300));
    box-shadow: 0 14px 30px color-mix(in oklab, var(--primary-color) 10%, transparent);
    transform: translateY(-2px);
  }

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

  @media (max-width: 420px) {
    gap: var(--space-xs);
    padding: var(--space-sm);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    ${RelatedPostArrow} {
      transition: none;
    }

    &:hover,
    &:hover ${RelatedPostArrow} {
      transform: none;
    }
  }
`
