import { Metadata } from 'next'
import api from './lib/api'
import type { ContentItem, RepoDto } from '@wuh.site/shared-contracts'
import HomeView from './HomeView'

export const metadata: Metadata = {
  title: 'wuh.site · 朝朝如念',
  description: '基于 Next.js 的个人站，汇集 GitHub 项目、文章与工具'
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

export default async function Home() {
  const repos = await getRepos()
  const posts = await getFeaturedIssues()
  return <HomeView repos={repos} posts={posts} />
}
