'use client'

import Link from 'next/link'
import Pagination from '@wuh.site/components/pagination'
import {
  MessageCard,
  MessageContent,
  MessageMeta,
  MessageName,
  MessageTime,
} from '@wuh.site/components/message-card'
import { useLocale, type Locale } from '@wuh.site/components/locales'
import * as S from './styles'
import type { GuestbookPageViewProps } from './specs'

/** locale → Intl 地区码（zh 需显式 zh-CN） */
const INTL_LOCALE: Record<Locale, string> = { zh: 'zh-CN', en: 'en', ja: 'ja' }

function formatTime(createdAt: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(createdAt))
}

function formatDate(createdAt: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(createdAt))
}

function formatDateKey(createdAt: string): string {
  const d = new Date(createdAt)
  // 固定 UTC 日历日分组（审计 P1-15）：SSR 与客户端输出一致，消除 hydration mismatch
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
}

function formatRelativeDate(createdAt: string, locale: string, t: (key: string) => string): string {
  // 「今天/昨天」判定同样固定 UTC 日历日，与分组键口径一致
  const now = new Date()
  const date = new Date(createdAt)
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const target = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  const diff = Math.floor((today - target) / (1000 * 60 * 60 * 24))

  if (diff === 0) return t('guestbook.page.today')
  if (diff === 1) return t('guestbook.page.yesterday')
  if (diff === 2) return t('guestbook.page.beforeYesterday')
  return formatDate(createdAt, locale)
}

export default function GuestbookPageView({
  comments,
  pagination,
  currentPage,
}: GuestbookPageViewProps) {
  const { t, locale } = useLocale()
  const intlLocale = INTL_LOCALE[locale]
  const grouped = comments.reduce<
    { date: string; dateLabel: string; items: typeof comments }[]
  >((acc, comment) => {
    const key = formatDateKey(comment.createdAt)
    const last = acc[acc.length - 1]
    if (last && last.date === key) {
      last.items.push(comment)
    } else {
      acc.push({
        date: key,
        dateLabel: formatRelativeDate(comment.createdAt, intlLocale, t),
        items: [comment],
      })
    }
    return acc
  }, [])

  return (
    <S.PageWrapper>
      <S.PageHeader>
        <S.PageTitle>{t('guestbook.page.title')}</S.PageTitle>
        <S.PageSubtitle>
          {t('guestbook.page.subtitle', {
            total: pagination.total,
            current: currentPage,
            totalPages: pagination.totalPages,
          })}
        </S.PageSubtitle>
      </S.PageHeader>

      {comments.length === 0 ? (
        <S.EmptyState>
          <S.EmptyText>{t('guestbook.page.empty')}</S.EmptyText>
          <S.BackLink as={Link} href='/about'>
            {t('guestbook.page.backLink')}
          </S.BackLink>
        </S.EmptyState>
      ) : (
        /* 换幕层 2：按页身份挂 key，翻页数据替换时重挂重播 mount-rise（MotionStyles 定档） */
        <S.CommentList
          key={currentPage}
          className="mount-rise"
          aria-label={t('guestbook.page.listAria')}
        >
          <S.Timeline>
            {grouped.map((group) => (
              <S.TimelineItem key={group.date}>
                {grouped.length > 1 && (
                  <S.TimelineDateLabel>
                    <S.TimelineDateText>{group.dateLabel}</S.TimelineDateText>
                  </S.TimelineDateLabel>
                )}
                {group.items.map((comment) => (
                  <S.TimelineCard key={comment.id}>
                    <S.TimelineDot />
                    <MessageCard>
                      <MessageMeta>
                        <MessageName>{comment.nickname}</MessageName>
                        <MessageTime dateTime={comment.createdAt}>
                          {formatTime(comment.createdAt, intlLocale)}
                        </MessageTime>
                      </MessageMeta>
                      <MessageContent>{comment.content}</MessageContent>
                    </MessageCard>
                  </S.TimelineCard>
                ))}
              </S.TimelineItem>
            ))}
          </S.Timeline>
        </S.CommentList>
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          getPageUrl={(p) => `/guestbook?page=${p}`}
        />
      )}
    </S.PageWrapper>
  )
}
