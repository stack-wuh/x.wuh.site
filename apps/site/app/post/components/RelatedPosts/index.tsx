'use client'

import { useEffect, useState } from 'react'
import { API_BASE } from '@wuh.site/hooks/useFetch/apiBase'
import { fetcher } from '@wuh.site/hooks/useFetch/fetcher'
import { useLocale, type Locale } from '@wuh.site/components/locales'
import type { ContentItem } from '@wuh.site/core'
import { selectRelatedPosts, type RelatedPost } from '../../../lib/related-posts'
import { buildPostUrl } from '../../../lib/slug'
import {
  RelatedPostsSection, RelatedPostsHeader, RelatedPostsHeading, RelatedPostsCount,
  RelatedPostLink, RelatedPostRow, RelatedPostMarker, RelatedPostBody, RelatedPostTitle,
  RelatedPostSummary, RelatedPostLabels, RelatedPostLeader, RelatedPostArrow,
} from '../../styles'
import type { RelatedPostsProps } from './specs'

/** 条目装饰序号（跨语言的排印选择，不进词典）：zh/ja 用汉字，en 用罗马数字 */
const ENTRY_MARKERS: Record<Locale, readonly string[]> = {
  zh: ['一', '二', '三'],
  en: ['I', 'II', 'III'],
  ja: ['一', '二', '三'],
}

export default function RelatedPosts({ number, labels }: RelatedPostsProps) {
  const { locale, t } = useLocale()
  const [posts, setPosts] = useState<RelatedPost[]>([])

  useEffect(() => {
    const selectedLabels = Array.from(new Set(labels.map((label) => label.trim()).filter(Boolean))).slice(0, 3)
    if (selectedLabels.length === 0) return
    let cancelled = false

    Promise.all(selectedLabels.map((label) => fetcher<{ data?: ContentItem[] }>(`${API_BASE}/content/posts`, {
      query: { labels: [label], limit: '10', state: 'open' },
    }))).then((responses) => {
      if (cancelled) return
      const candidates = responses.flatMap(({ data, error }) => {
        if (error || !data) return []
        return (data.data || []).map((item) => ({
          number: item.number,
          title: item.title,
          labels: item.labels,
          updatedAt: item.updatedAtGitHub || item.createdAtGitHub,
          summary: item.metadata?.summary || null,
        }))
      })
      setPosts(selectRelatedPosts({ number, labels: selectedLabels }, candidates))
    })

    return () => { cancelled = true }
  }, [number, labels])

  if (posts.length === 0) return null

  return (
    <RelatedPostsSection aria-labelledby='related-posts-title'>
      <RelatedPostsHeader>
        <RelatedPostsHeading id='related-posts-title'>{t('post.related.heading')}</RelatedPostsHeading>
        <RelatedPostsCount>{t('post.related.count', { n: posts.length })}</RelatedPostsCount>
      </RelatedPostsHeader>
      <p>{t('post.related.intro')}</p>
      <ul>
        {posts.map((post, index) => {
          const summary = post.summary?.trim()
          const sharedLabels = post.sharedLabels.slice(0, 2).join(' / ')
          return (
            <li key={post.number}>
              <RelatedPostLink href={buildPostUrl(post.number)} aria-label={t('post.related.itemAria', { title: post.title })}>
                <RelatedPostRow>
                  <RelatedPostMarker aria-hidden='true'>{ENTRY_MARKERS[locale][index] ?? index + 1}</RelatedPostMarker>
                  <RelatedPostBody>
                    <RelatedPostTitle>{post.title}</RelatedPostTitle>
                    {summary && <RelatedPostSummary>{summary}</RelatedPostSummary>}
                    {sharedLabels && <RelatedPostLabels>{t('post.related.clues', { labels: sharedLabels })}</RelatedPostLabels>}
                  </RelatedPostBody>
                  <RelatedPostLeader aria-hidden='true' />
                  <RelatedPostArrow aria-hidden='true'>→</RelatedPostArrow>
                </RelatedPostRow>
              </RelatedPostLink>
            </li>
          )
        })}
      </ul>
    </RelatedPostsSection>
  )
}
