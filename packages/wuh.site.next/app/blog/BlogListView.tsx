'use client'

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

const Root = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  font-family: var(--font-geist-sans);
  background-color: var(--background-color);

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
`

const Main = styled.main`
  display: flex;
  min-height: 100vh;
  width: 100%;
  max-width: 920px;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xl);
  padding: 72px 56px;

  @media (max-width: 900px) {
    padding: 64px 32px;
  }

  @media (max-width: 640px) {
    padding: 48px 20px;
  }
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
  gap: var(--space-sm);
`

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text-primary);
`

const Subtitle = styled.p`
  font-size: var(--font-size-md);
  line-height: 1.7;
  color: var(--text-secondary);
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`

const BackLink = styled(Link)`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-decoration: none;

  &:hover {
    color: var(--primary-color);
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: 16px 20px;
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--normal-300);
  border-radius: 12px;
  background: var(--background-100);
  transition: background 0.15s ease, transform 0.18s ease, box-shadow 0.18s ease;
  opacity: 0;
  animation: blogRowRise 0.35s ease forwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }

  &:hover {
    background: var(--background-200);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,.08);
  }

  @media (prefers-color-scheme: dark) {
    background: var(--normal-800);
    border-color: var(--normal-600);

    &:hover {
      background: rgba(255, 255, 255, 0.04);
      box-shadow: 0 6px 20px rgba(0,0,0,.4);
    }
  }
`

const AnimatedCard = styled(Card)<{ $index: number }>`
  animation-delay: ${props => `${props.$index * 0.04}s`};
`

const RowTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
  width: 100%;
  flex-wrap: wrap;
`

const TitleLine = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`

const TitleText = styled.span`
  font-weight: 600;
  font-size: var(--font-size-md);
  color: var(--text-primary);
`

const IssueNumber = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1 1 auto;
  min-width: 160px;
  justify-content: flex-start;
`

const MetaLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);

  @media (prefers-color-scheme: dark) {
    color: var(--text-secondary);
  }
`

const Dot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--text-muted);
  opacity: 0.6;
`

const CommentCount = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
`

const Empty = styled.div`
  width: 100%;
  text-align: center;
  color: var(--text-secondary);
  padding: var(--space-2xl) 0;

  @media (prefers-color-scheme: dark) {
    color: var(--text-primary);
    opacity: 0.7;
  }
`

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

const getPageHref = (page: number) => (page <= 1 ? '/blog' : `/blog?page=${page}`)

const getPageNumbers = (currentPage: number, lastPage: number | null) => {
  if (!lastPage) return [currentPage]
  const maxButtons = 5
  const half = Math.floor(maxButtons / 2)
  const start = Math.max(1, Math.min(currentPage - half, lastPage - maxButtons + 1))
  const end = Math.min(lastPage, start + maxButtons - 1)
  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx)
}

export default function BlogListView({ posts, pagination }: Props) {
  const pageNumbers = getPageNumbers(pagination.currentPage, pagination.lastPage)

  return (
    <Root>
      <Main>
        <Header>
          <TitleGroup>
            <Title>博客列表</Title>
            <Subtitle>收录 GitHub Issues 中的全部博客文章</Subtitle>
          </TitleGroup>
          <HeaderActions>
            <BackLink href='/'>返回首页</BackLink>
          </HeaderActions>
        </Header>

        {posts.length === 0 ? (
          <Empty>暂时没有可展示的博客内容</Empty>
        ) : (
          <List>
            {posts.map((post, index) => (
              <AnimatedCard key={post.id} href={`/post/${post.number}`} $index={index}>
                <RowTop>
                  <TitleLine>
                    <TitleText>{post.title}</TitleText>
                    <IssueNumber>#{post.number}</IssueNumber>
                  </TitleLine>
                  <CommentCount>💬 {post.comments}</CommentCount>
                </RowTop>
                {post.labels?.length > 0 && (
                  <CardTags>
                    {post.labels.slice(0, TAG_DISPLAY_LIMIT).map(label => (
                      <Tag key={`${post.id}-${label.name}`} label={label.name} color={label.color} />
                    ))}
                  </CardTags>
                )}
                <MetaLine>
                  <span>发布于 {new Date(post.created_at).toLocaleDateString()}</span>
                  <Dot />
                  <span>Issue</span>
                </MetaLine>
              </AnimatedCard>
            ))}
          </List>
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
