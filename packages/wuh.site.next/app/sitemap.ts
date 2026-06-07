import { type MetadataRoute } from 'next'
import { contentService } from '@wuh.site/shared-contracts/endpoints'

const SITE_URL = 'https://wuh.site'

const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE_URL}/design/system-color`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data, error } = await contentService.getPosts.server({
    query: { limit: '9999', state: 'open' },
  })

  if (error || !data) {
    console.error('[sitemap] Failed to fetch posts from API:', error)
    return staticRoutes
  }

  const result = data as any
  const postRoutes: MetadataRoute.Sitemap = (result.data || []).map((post: any) => ({
    url: `${SITE_URL}/post/${post.number}`,
    lastModified: new Date(post.updatedAtGitHub || post.createdAtGitHub),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...postRoutes]
}
