import { Metadata } from 'next'
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
    const res = await fetch('https://api.github.com/users/stack-wuh/repos', {
      headers: { 'Accept': 'application/vnd.github+json' },
      next: { revalidate: 3600 }
    })
    if (!res.ok) return []
    const data = (await res.json()) as Repo[]
    return data
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
  } catch {
    return []
  }
}

export default async function Home() {
  const repos = await getRepos()
  const posts = await getFeaturedIssues()
  return <HomeView repos={repos} posts={posts} />
}

type Issue = {
  id: number
  number: number
  title: string
  html_url: string
  comments: number
  created_at: string
  labels: { name: string; color?: string | null }[]
}

async function getFeaturedIssues(): Promise<Issue[]> {
  try {
    const res = await fetch('https://api.github.com/repos/stack-wuh/blog/issues?per_page=6&state=open&sort=update', {
      headers: { 'Accept': 'application/vnd.github+json' },
      next: { revalidate: 1800 }
    })
    if (!res.ok) return []
    const data = (await res.json()) as Issue[]
    return data
  } catch {
    return []
  }
}
