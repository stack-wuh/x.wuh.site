'use client'

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Tag from '@wuh.site/components/tag'

const TAG_DISPLAY_LIMIT = 3

type TagItem = {
  name: string
  color?: string | null
}

type PostItem = {
  id: number
  number: number
  title: string
  comments: number
  created_at: string
  labels: TagItem[]
}

type PaginationState = {
  currentPage: number
  lastPage: number | null
  hasPrev: boolean
  hasNext: boolean
}

type Props = {
  posts: PostItem[]
  pagination: PaginationState
}

/* ====== Styled Components ====== */

const Root = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  font-family: var(--font-geist-sans);
  background: transparent;
  padding: clamp(24px, 3vw, 64px) clamp(16px, 4vw, 60px);
`

const Main = styled.main`
  width: min(720px, 100%);
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xl);
  padding: clamp(24px, 3vw, 48px) clamp(20px, 5vw, 32px);
`

const Header = styled.header`
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-lg);
  flex-wrap: wrap;
`

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`

const Title = styled.h1`
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.03em;
  color: var(--text-primary);
`

const Subtitle = styled.p`
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: var(--text-muted);
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`

const BackLink = styled(Link)`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  text-decoration: none;

  &:hover {
    color: var(--text-primary);
  }
`

/* Timeline */
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
`

const YearGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  animation: blogRowRise 0.35s ease forwards;

  @keyframes blogRowRise {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`

const YearLabel = styled.div`
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  padding: var(--space-xs) 0;
  letter-spacing: 0.05em;
  border-bottom: 1px solid color-mix(in oklab, var(--text-muted) 25%, transparent);

  @media (prefers-color-scheme: dark) {
    border-bottom-color: color-mix(in oklab, var(--text-muted) 20%, transparent);
  }
`

const PostRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background-color var(--transition-fast) ease, padding-left var(--transition-fast) ease;

  &:hover {
    background-color: color-mix(in oklab, var(--accent-color) 8%, transparent);
    padding-left: 12px;
    text-decoration: none;
  }

  @media (max-width: 520px) {
    flex-wrap: wrap;
    gap: 6px;
  }
`

const InkDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.6;
  flex-shrink: 0;
`

const IssueNumber = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  opacity: 0.6;
  flex-shrink: 0;
  min-width: 36px;
  text-align: right;
`

const TitleTextContainer = styled.div`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
`

const TitleText = styled.span`
  display: block;
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TitleTooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: min(360px, 80vw);
  padding: var(--space-sm);
  border-radius: var(--border-radius-base);
  background: var(--background-100);
  color: var(--text-primary);
  box-shadow: var(--elevation-card);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  pointer-events: none;
  z-index: 10;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '4px')});
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
`

const TitleWithTooltip = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLSpanElement>(null)
  const [overflow, setOverflow] = useState(false)
  const [hovering, setHovering] = useState(false)

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const checkOverflow = () => {
      setOverflow(el.scrollWidth - el.clientWidth > 1)
    }
    checkOverflow()
    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(checkOverflow)
      observer.observe(el)
    }
    window.addEventListener('resize', checkOverflow)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', checkOverflow)
    }
  }, [text])

  return (
    <TitleTextContainer
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <TitleText ref={textRef} title={overflow ? text : undefined}>
        {text}
      </TitleText>
      {overflow && (
        <TitleTooltip role='tooltip' $visible={hovering}>
          {text}
        </TitleTooltip>
      )}
    </TitleTextContainer>
  )
}

const PostTags = styled.span`
  display: flex;
  gap: 4px;
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: calc(6px + var(--space-sm));
    width: 100%;
  }
`

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  flex-shrink: 0;

  @media (max-width: 520px) {
    margin-left: calc(6px + var(--space-sm));
  }
`

const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.5;
`

const Empty = styled.div`
  width: 100%;
  text-align: center;
  color: var(--text-muted);
  padding: var(--space-2xl) 0;
  font-size: var(--font-size-sm);
`

/* Pagination */
const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 6px;
  margin-top: var(--space-lg);
  flex-wrap: wrap;
`

const PaginationLink = styled(Link)<{ $active?: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--normal-300);
  font-size: var(--font-size-xs);
  text-decoration: none;
  color: ${props => (props.$active ? 'var(--text-primary)' : 'var(--text-secondary)')};
  background: ${props => (props.$active ? 'var(--background-200)' : 'transparent')};

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
    color: ${props => (props.$active ? 'var(--text-primary)' : 'var(--text-secondary)')};
    background: ${props => (props.$active ? 'rgba(255,255,255,0.06)' : 'transparent')};
  }
`

const PaginationText = styled.span<{ $active?: boolean; $disabled?: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--normal-300);
  font-size: var(--font-size-xs);
  color: ${props => (props.$active ? 'var(--text-primary)' : 'var(--text-muted)')};
  background: ${props => (props.$active ? 'var(--background-200)' : 'transparent')};
  opacity: ${props => (props.$disabled ? 0.5 : 1)};

  @media (prefers-color-scheme: dark) {
    border-color: var(--normal-600);
    color: ${props => (props.$active ? 'var(--text-primary)' : 'var(--text-secondary)')};
    background: ${props => (props.$active ? 'rgba(255,255,255,0.06)' : 'transparent')};
  }
`

const PageMeta = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-left: var(--space-sm);
`

/* ====== Helpers ====== */

const getPageHref = (page: number) => (page <= 1 ? '/blog' : `/blog?page=${page}`)

const getPageNumbers = (currentPage: number, lastPage: number | null) => {
  if (!lastPage) return [currentPage]
  const maxButtons = 5
  const half = Math.floor(maxButtons / 2)
  const start = Math.max(1, Math.min(currentPage - half, lastPage - maxButtons + 1))
  const end = Math.min(lastPage, start + maxButtons - 1)
  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx)
}

const groupByYear = (posts: PostItem[]) => {
  const map = new Map<number, PostItem[]>()
  posts.forEach(post => {
    const year = new Date(post.created_at).getFullYear()
    const list = map.get(year)
    if (list) {
      list.push(post)
    } else {
      map.set(year, [post])
    }
  })
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0])
}

/* ====== Component ====== */

export default function BlogListView({ posts, pagination }: Props) {
  const pageNumbers = getPageNumbers(pagination.currentPage, pagination.lastPage)
  const yearGroups = useMemo(() => groupByYear(posts), [posts])

  return (
    <Root>
      <Main>
        <Header>
          <TitleGroup>
            <Title>全部博客</Title>
            <Subtitle>收录 GitHub Issues 中的全部博客文章</Subtitle>
          </TitleGroup>
          <HeaderActions>
            <BackLink href='/'>返回首页</BackLink>
          </HeaderActions>
        </Header>

        {posts.length === 0 ? (
          <Empty>暂时没有可展示的博客内容</Empty>
        ) : (
          <Timeline>
            {yearGroups.map(([year, yearPosts]) => (
              <YearGroup key={year}>
                <YearLabel>{year}</YearLabel>
                {yearPosts.map(post => (
                  <PostRow key={post.id} href={`/post/${post.number}`}>
                    <InkDot />
                    <TitleWithTooltip text={post.title} />
                    <IssueNumber>#{post.number}</IssueNumber>
                    {post.labels?.length > 0 && (
                      <PostTags>
                        {post.labels.slice(0, TAG_DISPLAY_LIMIT).map(label => (
                          <Tag key={`${post.id}-${label.name}`} label={label.name} color={label.color} />
                        ))}
                      </PostTags>
                    )}
                    <PostMeta>
                      <span>{new Date(post.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                      <MetaDot />
                      <span>{post.comments}</span>
                    </PostMeta>
                  </PostRow>
                ))}
              </YearGroup>
            ))}
          </Timeline>
        )}

        <Pagination aria-label='Pagination'>
          {pagination.hasPrev ? (
            <PaginationLink href={getPageHref(pagination.currentPage - 1)}>上一页</PaginationLink>
          ) : (
            <PaginationText $disabled>上一页</PaginationText>
          )}

          {pageNumbers.map(page =>
            page === pagination.currentPage ? (
              <PaginationText key={page} $active aria-current='page'>
                {page}
              </PaginationText>
            ) : (
              <PaginationLink key={page} href={getPageHref(page)}>
                {page}
              </PaginationLink>
            )
          )}

          {pagination.hasNext ? (
            <PaginationLink href={getPageHref(pagination.currentPage + 1)}>下一页</PaginationLink>
          ) : (
            <PaginationText $disabled>下一页</PaginationText>
          )}

          <PageMeta>
            第 {pagination.currentPage} 页
            {pagination.lastPage ? ` / 共 ${pagination.lastPage} 页` : ''}
          </PageMeta>
        </Pagination>
      </Main>
    </Root>
  )
}
