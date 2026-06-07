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
  > div {
    margin-top: 0 !important;
    padding: 0 !important;
    border-top: none !important;
    align-items: flex-start;
    gap: var(--space-xs);
  }

  button {
    background: transparent !important;
    border-color: var(--normal-300) !important;
    border-radius: 4px !important;
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
