import { type MetadataRoute } from 'next'
import { contentService } from '@wuh.site/core/endpoints'
import {
  buildPostSitemapEntry,
  buildStaticSitemapRoutes,
  buildTopicSitemapEntry,
  type SitemapPost,
  type SitemapTopic,
} from './lib/sitemap-utils'

const SITEMAP_PAGE_SIZE = 100

type SitemapLabelsResponse = SitemapTopic[]

type SitemapPostsResponse = {
  data: SitemapPost[]
  pagination?: {
    hasNextPage?: boolean
  }
}

function logSitemapFetchError(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : JSON.stringify(error)
  process.stderr.write(`[sitemap] Failed to fetch ${scope}: ${message}\n`)
}

async function getOpenLabels(): Promise<SitemapTopic[]> {
  const { data, error } = await contentService.getLabels.server({
    query: { state: 'open' },
    revalidate: 3600,
  })

  if (error || !data) {
    logSitemapFetchError('open labels', error || new Error('empty response'))
    return []
  }

  return (data as SitemapLabelsResponse).filter((label) => label.name?.trim())
}

async function getPublishedPosts(): Promise<SitemapPost[]> {
  const posts: SitemapPost[] = []
  let page = 1

  while (true) {
    const { data, error } = await contentService.getPosts.server({
      query: {
        page: String(page),
        limit: String(SITEMAP_PAGE_SIZE),
        state: 'open',
      },
      revalidate: 3600,
    })

    if (error || !data) {
      logSitemapFetchError(`open posts page ${page}`, error || new Error('empty response'))
      return posts
    }

    const result = data as SitemapPostsResponse
    posts.push(...(result.data || []))

    if (!result.pagination?.hasNextPage) break
    page += 1
  }

  return posts
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [labels, posts] = await Promise.all([getOpenLabels(), getPublishedPosts()])
  return [
    ...buildStaticSitemapRoutes(),
    ...labels.map(buildTopicSitemapEntry),
    ...posts.map(buildPostSitemapEntry),
  ]
}
