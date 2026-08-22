import type { Metadata } from 'next'
import { contentService } from '@wuh.site/core/endpoints'
import type { ContentItem, PostListItem } from '@wuh.site/core'
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from '@wuh.site/core'
import HomeView from './HomeView'

export const dynamic = 'force-dynamic'

function logHomeFetchError(moduleName: string, error: unknown) {
  const message = error instanceof Error ? error.message : JSON.stringify(error)
  process.stderr.write(`[home] Failed to fetch ${moduleName}: ${message}\n`)
}

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

const mapContentToPost = (item: ContentItem): PostListItem => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/${item.repo}/issues/${item.number}`,
  views: item.viewCount ?? item.comments,
  created_at: item.createdAtGitHub || '',
  labels: item.labels.map((l) => ({ name: l })),
})

async function getFeaturedIssues(): Promise<PostListItem[]> {
  const { data, error } = await contentService.getPosts.server({
    query: { limit: '6', state: 'open' },
    revalidate: 1800,
  })
  if (error) logHomeFetchError('featured posts', error)
  if (!data) return []
  return (data as any).data.map(mapContentToPost) as PostListItem[]
}

export default async function Home() {
  const posts = await getFeaturedIssues()
  return <HomeView repos={[]} posts={posts} yearlySummaries={[]} wereadBooks={[]} />
}
