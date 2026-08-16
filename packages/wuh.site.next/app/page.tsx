import type { Metadata } from 'next'
import { contentService } from '@wuh.site/shared-contracts/endpoints'
import type { ContentItem, PostListItem } from '@wuh.site/shared-contracts'
import HomeView from './HomeView'

const SITE_URL = 'https://wuh.site'

export const dynamic = 'force-dynamic'

function logHomeFetchError(moduleName: string, error: unknown) {
  const message = error instanceof Error ? error.message : JSON.stringify(error)
  process.stderr.write(`[home] Failed to fetch ${moduleName}: ${message}\n`)
}

export const metadata: Metadata = {
  title: '朝朝如念 · wuh.site',
  description: '基于 Next.js 的个人站，汇集 GitHub 项目、文章与工具',
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: '朝朝如念·wuh.site',
    description: '吴尒红（Shadow）的个人站，汇集前端工程、GitHub 开源项目、技术文章与工具',
    url: SITE_URL,
    siteName: 'wuh.site',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '朝朝如念·wuh.site',
    description: '吴尒红（Shadow）的个人站，汇集前端工程、GitHub 开源项目、技术文章与工具',
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
