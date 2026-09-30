'use client'

import Pagination from '@wuh.site/components/pagination'
import Empty from '@wuh.site/components/empty'
import { IconLibrary } from '@wuh.site/components/icons'
import BackHomeLink from '@/app/components/BackHomeLink'
import { Header, TitleGroup, Title, Subtitle, HeaderActions } from '@/app/components/PageHeader/styles'
import { useLocale, type Locale } from '@wuh.site/components/locales'
import * as S from './styles'
import type { WereadViewProps } from './specs'

/** locale → Intl 地区码（zh 需显式 zh-CN） */
const INTL_LOCALE: Record<Locale, string> = { zh: 'zh-CN', en: 'en', ja: 'ja' }

export default function WereadView({ books, total, currentPage, totalPages }: WereadViewProps) {
  const { t, locale } = useLocale()
  const reading = books.filter((b) => !b.finishReading)
  const finished = books.filter((b) => b.finishReading)

  return (
    <S.Root>
      <S.Main>
        <Header>
          <TitleGroup>
            <Title>{t('weread.page.title')}</Title>
            <Subtitle>
              {t('weread.page.subtitle', {
                total,
                reading: reading.length,
                finished: finished.length,
              })}
            </Subtitle>
          </TitleGroup>
          <HeaderActions>
            <BackHomeLink href='/' />
          </HeaderActions>
        </Header>

        {books.length === 0 ? (
          <Empty
            icon={<IconLibrary />}
            title={t('weread.page.emptyTitle')}
            description={t('weread.page.emptyDesc')}
          />
        ) : (
          <S.BookList>
            {books.map((book) => (
              <S.BookRow key={book.bookId}>
                <S.BookCover role='book-cover' src={book.cover || ''} alt={book.title} width={40} height={54} />
                <S.BookInfo>
                  <S.BookTitle>{book.title}</S.BookTitle>
                  <S.BookMeta>
                    {book.author}
                    {book.finishReading ? t('weread.page.metaFinished') : t('weread.page.metaReading')}
                  </S.BookMeta>
                </S.BookInfo>
                <S.CountTag>
                  {new Date(book.readUpdateTime * 1000).toLocaleDateString(INTL_LOCALE[locale], { year: 'numeric', month: 'short', day: 'numeric' })}
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
