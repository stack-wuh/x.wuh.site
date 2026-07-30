'use client'

import { useEffect, useState } from 'react'
import { API_BASE } from '@wuh.site/hooks/useFetch/apiBase'
import { fetcher } from '@wuh.site/hooks/useFetch/fetcher'
import type { ContentItem } from '@wuh.site/shared-contracts'
import { selectRelatedPosts, type RelatedPost } from '../../lib/related-posts'
import { buildPostUrl } from '../../lib/slug'
import {
  RelatedPostsSection, RelatedPostsHeader, RelatedPostsHeading, RelatedPostsCount,
  RelatedPostLink, RelatedPostIndex, RelatedPostContent, RelatedPostTitle,
  RelatedPostSummary, RelatedPostLabels, RelatedPostArrow,
} from '../styles'

type Props = { number: number; labels: string[] }

export default function RelatedPosts({ number, labels }: Props) {
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
        <RelatedPostsHeading id='related-posts-title'>继续阅读</RelatedPostsHeading>
        <RelatedPostsCount>{posts.length} 篇同题文章</RelatedPostsCount>
      </RelatedPostsHeader>
      <ul>
        {posts.map((post, index) => {
          const summary = post.summary?.trim()
          const sharedLabels = post.sharedLabels.slice(0, 2).map((label) => `#${label}`).join(' · ')
          return (
            <li key={post.number}>
              <RelatedPostLink href={buildPostUrl(post.number, post.title)} aria-label={`继续阅读：${post.title}`}>
                <RelatedPostIndex>{String(index + 1).padStart(2, '0')}</RelatedPostIndex>
                <RelatedPostContent>
                  <RelatedPostTitle>{post.title}</RelatedPostTitle>
                  {summary && <RelatedPostSummary>{summary}</RelatedPostSummary>}
                  {sharedLabels && <RelatedPostLabels>{sharedLabels}</RelatedPostLabels>}
                </RelatedPostContent>
                <RelatedPostArrow aria-hidden='true'>→</RelatedPostArrow>
              </RelatedPostLink>
            </li>
          )
        })}
      </ul>
    </RelatedPostsSection>
  )
}
