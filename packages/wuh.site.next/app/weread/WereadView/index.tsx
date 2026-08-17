'use client'

import Pagination from '@wuh.site/components/pagination'
import Empty from '@wuh.site/components/empty'
import { IconLibrary } from '@wuh.site/components/icons'
import BackHomeLink from '@/app/components/BackHomeLink'
import { Header, TitleGroup, Title, Subtitle, HeaderActions } from '@/app/components/PageHeader/styles'
import * as S from './styles'
import type { WereadViewProps } from './specs'

export default function WereadView({ books, total, currentPage, totalPages }: WereadViewProps) {
  const reading = books.filter((b) => !b.finishReading)
  const finished = books.filter((b) => b.finishReading)

  return (
    <S.Root>
      <S.Main>
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
          <Empty icon={<IconLibrary />} title='书架为空' description='暂无同步的书籍数据' />
        ) : (
          <S.BookList>
            {books.map((book) => (
              <S.BookRow key={book.bookId}>
                <S.BookCover role='book-cover' src={book.cover || ''} alt={book.title} width={40} height={54} />
                <S.BookInfo>
                  <S.BookTitle>{book.title}</S.BookTitle>
                  <S.BookMeta>{book.author}{book.finishReading ? ' · 已读完' : ' · 阅读中'}</S.BookMeta>
                </S.BookInfo>
                <S.CountTag>
                  {new Date(book.readUpdateTime * 1000).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </S.CountTag>
              </S.BookRow>
            ))}
          </S.BookList>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          getPageUrl={(page) => (page <= 1 ? '/weread' : `/weread?page=${page}`)}
        />
      </S.Main>
    </S.Root>
  )
}
