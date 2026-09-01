import styled from '@wuh.site/components/styled'
import Empty from '@wuh.site/components/empty'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'

export { MarkdownBody, UpdateDivider } from './post-markdown'

const hairline = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'

export const StatusEmpty = styled(Empty)`
  margin-bottom: var(--space-lg);
  min-height: 220px;
`

export const CommentPlaceholder = styled(Empty)`
  margin-top: var(--space-md);
`

export const RelatedPostsSection = styled.section`
  margin-top: var(--space-xl);

  > p {
    max-width: 32rem;
    margin: var(--space-xs) 0 var(--space-md);
    color: var(--text-secondary);
    font-family: var(--font-serif);
    font-size: var(--font-size-sm);
    line-height: 1.85;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`

export const RelatedPostsHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: var(--space-sm);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    grid-template-columns: 1fr;
    gap: 2px;
  }
`

export const RelatedPostsHeading = styled.h2`
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 500;
  letter-spacing: 0.08em;
`

export const RelatedPostsCount = styled.span`
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  white-space: nowrap;
`

export const RelatedPostRow = styled.span`
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);
`

export const RelatedPostMarker = styled.span`
  flex: none;
  color: var(--accent-color);
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  opacity: 0.9;
`

export const RelatedPostBody = styled.span`
  flex: 0 1 auto;
  min-width: 0;
`

export const RelatedPostTitle = styled.span`
  display: -webkit-box;
  overflow: hidden;
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  font-weight: 500;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 180ms ease;
`

export const RelatedPostSummary = styled.span`
  display: -webkit-box;
  overflow: hidden;
  margin-top: 2px;
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`

export const RelatedPostLabels = styled.span`
  display: block;
  margin-top: 2px;
  color: var(--text-muted);
  font-size: var(--font-size-xs);
  line-height: 1.5;
`

export const RelatedPostLeader = styled.span`
  flex: 1;
  min-width: 28px;
  align-self: baseline;
  overflow: hidden;
  border-bottom: 1px dotted color-mix(in oklab, var(--normal-400) 60%, transparent);
  transform: translateY(-5px);
  transition: border-color 180ms ease;
`

export const RelatedPostArrow = styled.span`
  flex: none;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  transition: color 180ms ease, transform 180ms ease;
`

export const RelatedPostLink = styled.a`
  display: block;
  padding: var(--space-xs) 0;
  color: var(--text-secondary);
  text-decoration: none;

  &:hover ${RelatedPostTitle},
  &:hover ${RelatedPostArrow} {
    color: var(--primary-color);
  }

  &:hover ${RelatedPostArrow} {
    transform: translateX(3px);
  }

  &:hover ${RelatedPostLeader} {
    border-bottom-color: color-mix(in oklab, var(--primary-color) 45%, transparent);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 36%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    ${RelatedPostTitle},
    ${RelatedPostArrow},
    ${RelatedPostLeader} {
      transition: none;
    }

    &:hover ${RelatedPostArrow} {
      transform: none;
    }
  }
`

/** 文章页脚：版权 / 来源 / 分享 / 点赞 合一的居中仪式式收笔 */
export const ArticleColophon = styled.footer`
  margin-top: var(--space-xl);
  padding: var(--space-lg) 0;
  text-align: center;
  border-top: 1px solid ${hairline};
  border-bottom: 1px solid ${hairline};
`

export const ColophonOrnament = styled.div`
  color: var(--accent-color);
  font-size: var(--font-size-xs);
  line-height: 1;
  opacity: 0.85;
`

export const ColophonRule = styled.div`
  width: 120px;
  height: 1px;
  margin: 10px auto 14px;
  background: linear-gradient(90deg, transparent, ${hairline}, transparent);
`

export const ColophonLicense = styled.p`
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  letter-spacing: 0.04em;
`

export const ColophonMeta = styled.p`
  margin: 6px 0 0;
  font-size: var(--font-size-xs);
  color: var(--text-muted);

  a {
    color: var(--accent-color);
    text-decoration: none;
    border-bottom: 1px dashed color-mix(in oklab, var(--accent-color) 42%, transparent);
    transition: border-color 0.2s ease;
  }

  a:hover {
    border-bottom-style: solid;
  }
`

export const ColophonShareRow = styled.div`
  margin-top: var(--space-md);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-xs);
`

/** 分享药丸：文字描边形态，与点赞按钮同族；动效仅颜色过渡（链接态用 as='a'） */
export const SharePill = styled.button`
  padding: 3px var(--space-base);
  font-family: inherit;
  font-size: var(--font-size-xs);
  line-height: 1.9;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid color-mix(in oklab, var(--normal-400) 70%, transparent);
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  transition: color 200ms ease, border-color 200ms ease;

  &:hover {
    color: var(--primary-color);
    border-color: color-mix(in oklab, var(--primary-color) 55%, transparent);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 36%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
