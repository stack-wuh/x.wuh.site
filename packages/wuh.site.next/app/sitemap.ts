import { type MetadataRoute } from 'next'
import api from './lib/api'

const SITE_URL = 'https://wuh.site'

const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE_URL}/design/system-color`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data: posts } = await api.content.getPosts({ limit: 9999, state: 'open' })

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${SITE_URL}/post/${post.number}`,
      lastModified: new Date(post.updatedAtGitHub || post.createdAtGitHub),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...postRoutes]
  } catch (err) {
    console.error('[sitemap] Failed to fetch posts from API:', err)
    return staticRoutes
  }
}
