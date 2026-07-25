import type { MetadataRoute } from 'next'
import { buildPostUrl } from './slug.ts'
import { buildTopicUrl } from './topic-url.ts'

export const SITE_URL = 'https://wuh.site'

export type SitemapTopic = {
  name: string
}

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
    { url: `${SITE_URL}/archive`, changeFrequency: 'daily', priority: 0.7 },
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


export function buildTopicSitemapEntry(topic: SitemapTopic): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${buildTopicUrl(topic.name)}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }
}
