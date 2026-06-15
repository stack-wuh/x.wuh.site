'use client'

import styled from '@wuh.site/components/styled'
import Pagination from '@wuh.site/components/pagination'
import Image from '@wuh.site/components/image'
import type { WereadBook } from '@wuh.site/shared-contracts'
import Empty from '@wuh.site/components/empty'
import { IconLibrary } from '@wuh.site/components/icons'
import BackHomeLink from '@/app/components/BackHomeLink'
import { Header, TitleGroup, Title, Subtitle, HeaderActions } from '@/app/components/PageHeader/styles'

type Props = {
  books: WereadBook[]
  total: number
  currentPage: number
  totalPages: number
}

const Root = styled.div`
  font-family: var(--font-sans);
  background: transparent;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: clamp(16px, 2.4vw, 48px) clamp(16px, 5vw, 48px);
`

const Main = styled.main`
  width: min(720px, 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: var(--space-lg);
  padding: clamp(24px, 3vw, 48px) clamp(12px, 3vw, 40px);
`

const BookList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`

const BookRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 8px;
  border-radius: 6px;
`

const BookCover = styled(Image).attrs({
  showSkeleton: true,
  appearance: 'plain',
  variant: 'contain',
})`
  width: 40px;
  min-width: 40px;
  max-width: 40px;
  height: 54px;
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`

const BookInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const BookTitle = styled.div`
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
`

const BookMeta = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: 2px;
`

const CountTag = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  flex-shrink: 0;
`

export default function WereadView({ books, total, currentPage, totalPages }: Props) {
  const reading = books.filter((b) => !b.finishReading)
  const finished = books.filter((b) => b.finishReading)

  return (
    <Root>
      <Main>
        <Header>
          <TitleGroup>
            <Title>微信读书</Title>
            <Subtitle>共 {total} 本书，本页 {reading.length} 本在读 · {finished.length} 本已读完</Subtitle>
          </TitleGroup>
          <HeaderActions>
            <BackHomeLink href='/' />
          </HeaderActions>
        </Header>

        {books.length === 0 ? (
          <Empty icon={<IconLibrary />} title="书架为空" description="暂无同步的书籍数据" />
        ) : (
          <BookList>
            {books.map((book) => (
              <BookRow key={book.bookId}>
                <BookCover src={book.cover || ''} alt={book.title} width={40} height={54} />
                <BookInfo>
                  <BookTitle>{book.title}</BookTitle>
                  <BookMeta>{book.author}{book.finishReading ? ' · 已读完' : ' · 阅读中'}</BookMeta>
                </BookInfo>
                <CountTag>
                  {new Date(book.readUpdateTime * 1000).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </CountTag>
              </BookRow>
            ))}
          </BookList>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          getPageUrl={(page) => (page <= 1 ? '/weread' : `/weread?page=${page}`)}
        />
      </Main>
    </Root>
  )
}
