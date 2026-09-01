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
    position: relative;
    display: grid;
    gap: var(--space-md);
    margin: 0;
    padding: 0 0 0 var(--space-md);
    list-style: none;

    &::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 8px;
      bottom: 18px;
      width: 1px;
      background: linear-gradient(
        180deg,
        color-mix(in oklab, var(--primary-color) 42%, transparent),
        color-mix(in oklab, var(--accent-color) 24%, transparent)
      );
    }
  }

  li {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: calc(0px - var(--space-md));
      top: 9px;
      width: 9px;
      height: 9px;
      border: 1px solid color-mix(in oklab, var(--primary-color) 55%, transparent);
      border-radius: 50%;
      background: var(--background-100);
    }
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

export const RelatedPostContent = styled.span`
  display: grid;
  min-width: 0;
  gap: 5px;
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
  transition: color 180ms ease;
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
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-sm);
  min-height: 44px;
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

  @media (prefers-reduced-motion: reduce) {
    ${RelatedPostTitle},
    ${RelatedPostArrow} {
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
  justify-content: center;

  /* 仅中和 SharedLinkGroup 自带的分区容器壳（上边距/内边距/上边框），按钮保留组件原生按钮组样式 */
  > div {
    margin-top: 0 !important;
    padding: 0 !important;
    border-top: none !important;
  }
`
