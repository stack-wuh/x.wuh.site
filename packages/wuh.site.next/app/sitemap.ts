import { type MetadataRoute } from 'next'
import { contentService } from '@wuh.site/shared-contracts/endpoints'
import {
  buildPostSitemapEntry,
  buildStaticSitemapRoutes,
  type SitemapPost,
} from './lib/sitemap'

const SITEMAP_PAGE_SIZE = 100

type SitemapPostsResponse = {
  data: SitemapPost[]
  pagination?: {
    hasNextPage?: boolean
  }
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
      throw new Error(`Failed to load sitemap posts on page ${page}`)
    }

    const result = data as SitemapPostsResponse
    posts.push(...(result.data || []))

    if (!result.pagination?.hasNextPage) break
    page += 1
  }

  return posts
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts()
  return [
    ...buildStaticSitemapRoutes(),
    ...posts.map(buildPostSitemapEntry),
  ]
}
