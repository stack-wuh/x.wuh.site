import type { MetadataRoute } from 'next'
import { buildPostUrl } from './slug.ts'

export const SITE_URL = 'https://wuh.site'

export type SitemapPost = {
  number: number
  title: string
  updatedAtGitHub?: string | null
  createdAtGitHub?: string | null
}

export function buildStaticSitemapRoutes(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
  ]
}

export function buildPostSitemapEntry(post: SitemapPost): MetadataRoute.Sitemap[number] {
  const lastModified = post.updatedAtGitHub || post.createdAtGitHub

  return {
    url: `${SITE_URL}${buildPostUrl(post.number, post.title)}`,
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
    changeFrequency: 'weekly',
    priority: 0.6,
  }
}
