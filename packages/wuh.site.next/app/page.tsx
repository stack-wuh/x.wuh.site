import { Metadata } from 'next'
import { contentService, reposService, wereadService } from '@wuh.site/shared-contracts/endpoints'
import type { ContentItem, RepoDto, PostListItem, WereadBook } from '@wuh.site/shared-contracts'
import HomeView from './HomeView'

const SITE_URL = 'https://wuh.site'

export const metadata: Metadata = {
  title: 'wuh.site · 朝朝如念',
  description: '基于 Next.js 的个人站，汇集 GitHub 项目、文章与工具',
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'wuh.site · 朝朝如念',
    description: '基于 Next.js 的个人站，汇集 GitHub 项目、文章与工具',
    url: SITE_URL,
    siteName: 'wuh.site',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'wuh.site · 朝朝如念',
    description: '基于 Next.js 的个人站，汇集 GitHub 项目、文章与工具',
  },
}

async function getRepos(): Promise<RepoDto[]> {
  const { data } = await reposService.getAll.server({ revalidate: 3600 })
  if (!data) return []
  return (data as any).repos.slice(0, 6) as RepoDto[]
}

const mapContentToPost = (item: ContentItem): PostListItem => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/${item.repo}/issues/${item.number}`,
  views: (item as any).viewCount ?? item.comments,
  created_at: item.createdAtGitHub || '',
  labels: item.labels.map((l) => ({ name: l })),
})

async function getFeaturedIssues(): Promise<PostListItem[]> {
  const { data } = await contentService.getPosts.server({
    query: { limit: '6', state: 'open' },
    revalidate: 1800,
  })
  if (!data) return []
  return (data as any).data.map(mapContentToPost) as PostListItem[]
}

async function getYearlySummaries(): Promise<PostListItem[]> {
  const { data } = await contentService.getPosts.server({
    query: { limit: '50', state: 'open' },
    revalidate: 1800,
  })
  if (!data) return []
  return (data as any).data
    .map(mapContentToPost)
    .filter((post: PostListItem) => post.title.includes('年度总结'))
    .slice(0, 3) as PostListItem[]
}

async function getWereadBooks(): Promise<WereadBook[]> {
  const { data } = await wereadService.getBooks.server({
    query: { page: '5', limit: '6' },
    revalidate: 3600,
  })
  if (!data) return []
  return ((data as any).data || []) as WereadBook[]
}

export default async function Home() {
  const [repos, posts, yearlySummaries, wereadBooks] = await Promise.all([
    getRepos(),
    getFeaturedIssues(),
    getYearlySummaries(),
    getWereadBooks(),
  ])
  return <HomeView repos={repos} posts={posts} yearlySummaries={yearlySummaries} wereadBooks={wereadBooks} />
}
