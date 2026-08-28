'use client'

import { useEffect, useRef, useState } from 'react'
import Button from '@wuh.site/components/button'
import { IconLibrary, IconChevronRight } from '@wuh.site/components/icons'
import type { WereadBook } from '@wuh.site/core'
import { wereadService } from '@wuh.site/core/endpoints'
import * as S from '../styles'
import Empty from '@wuh.site/components/empty'

/** 微信读书书架：滚动进入视口后加载数据，客户端叶子 */
export default function WereadSection({ fallbackBooks }: { fallbackBooks: WereadBook[] }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { data: booksData } = wereadService.getBooks.use({ query: { page: '1', limit: '6', finishReading: '0' } })
  const books = booksData ? (((booksData as any).data || []) as WereadBook[]) : fallbackBooks

  return (
    <div ref={ref} style={{ width: '100%' }}>
      {!visible ? (
        <S.SectionSkeleton />
      ) : (
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>微信读书</S.SectionTitle>
            {books.length > 0 && <Button href='/weread' variant='text' color='secondary' size='small' icon={<IconChevronRight />} iconPosition='right'>我的书架</Button>}
          </S.SectionHeader>
          {books.length === 0 ? (
            <Empty icon={<IconLibrary />} title="暂无书架" description="微信读书同步后这里会展示" actions={[{ label: '去看看书架', href: '/weread' }]} />
          ) : (
            <S.BooksList>
              {books.map((book) => (
                <S.BookRow key={book.bookId}>
                  <S.BookCover role='book-cover' src={book.cover || ''} alt={book.title} width={36} height={54} />
                  <S.BookInfo>
                    <S.BookTitle>{book.title}</S.BookTitle>
                    <S.BookMeta>{book.author}{book.finishReading ? ' · 已读完' : ' · 阅读中'}</S.BookMeta>
                  </S.BookInfo>
                </S.BookRow>
              ))}
            </S.BooksList>
          )}
        </S.Section>
      )}
    </div>
  )
}
