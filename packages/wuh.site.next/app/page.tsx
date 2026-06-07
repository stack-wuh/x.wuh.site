import { Metadata } from 'next'
import api from './lib/api'
import type { ContentItem } from '@wuh.site/shared-contracts'
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

type Repo = {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  homepage: string | null
  fork: boolean
}

async function getRepos(): Promise<Repo[]> {
  try {
    const data = await api.repos.getAll({ revalidate: 3600 })
    return data.repos.slice(0, 6)
  } catch {
    return []
  }
}

type PostItem = {
  id: number
  number: number
  title: string
  html_url: string
  comments: number
  created_at: string
  labels: { name: string; color?: string | null }[]
}

type YearlySummary = PostItem

type WereadBook = {
  bookId: string
  title: string
  author: string
  cover: string
  readUpdateTime: number
  finishReading: number
}

const mapContentToPost = (item: ContentItem): PostItem => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/${item.repo}/issues/${item.number}`,
  comments: item.comments,
  created_at: item.createdAtGitHub || '',
  labels: item.labels.map((l) => ({ name: l })),
})

async function getFeaturedIssues(): Promise<PostItem[]> {
  try {
    const result = await api.content.getPosts({ limit: 6, state: 'open' }, { revalidate: 1800 })
    return result.data.map(mapContentToPost)
  } catch {
    return []
  }
}

async function getYearlySummaries(): Promise<YearlySummary[]> {
  try {
    const result = await api.content.getPosts({ limit: 50, state: 'open' }, { revalidate: 1800 })
    return result.data
      .map(mapContentToPost)
      .filter((post) => post.title.includes('年度总结'))
      .slice(0, 3)
  } catch {
    return []
  }
}

async function getWereadBooks(): Promise<WereadBook[]> {
  try {
    const data = await api.weread.getBooks(5, { revalidate: 3600 })
    return (data as any).books || []
  } catch {
    return []
  }
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
