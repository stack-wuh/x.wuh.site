import type { Metadata } from 'next'
import PostView from '../PostView'

const FALLBACK_METADATA: Metadata = {
  title: '博客详情 · wuh.site',
  description: '从 GitHub Issues 渲染的博客文章详情',
}

type Issue = {
  id: number
  number: number
  title: string
  html_url: string
  repository_url?: string | null
  comments: number
  created_at: string
  updated_at?: string
  user?: {
    login?: string | null
    userName?: string | null
  } | null
  labels: { name: string; color?: string | null; url?: string }[]
  body: string
}

type AdjacentIssue = {
  number: number
  title: string
}

async function getIssue(num: string): Promise<Issue | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/stack-wuh/blog/issues/${num}`, {
      headers: { 'Accept': 'application/vnd.github+json' },
      next: { revalidate: 1800 }
    })
    if (!res.ok) return null
    const data = (await res.json()) as Issue
    return data
  } catch {
    return null
  }
}

async function renderMarkdown(text: string): Promise<string> {
  try {
    const res = await fetch('https://api.github.com/markdown', {
      method: 'POST',
      headers: {
        'Accept': 'text/html',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, mode: 'gfm' }),
      next: { revalidate: 1800 }
    })
    if (!res.ok) return ''
    const html = await res.text()
    return html
  } catch {
    return ''
  }
}

async function getAdjacentIssue(issueNumber: number, offset: -1 | 1): Promise<AdjacentIssue | null> {
  const adjacentNumber = issueNumber + offset
  if (adjacentNumber <= 0) return null

  try {
    const res = await fetch(`https://api.github.com/repos/stack-wuh/blog/issues/${adjacentNumber}`, {
      headers: { 'Accept': 'application/vnd.github+json' },
      next: { revalidate: 1800 }
    })
    if (!res.ok) return null

    const data = (await res.json()) as AdjacentIssue & { pull_request?: object }
    if (data.pull_request) return null

    return {
      number: data.number,
      title: data.title,
    }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ number: string }> }): Promise<Metadata> {
  const { number } = await params
  const issue = await getIssue(number)

  if (!issue) {
    return FALLBACK_METADATA
  }

  return {
    title: `wuh.site · ${issue.title} · 朝朝如念`,
    description: FALLBACK_METADATA.description,
  }
}

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params
  const issue = await getIssue(number)
  if (!issue) return <PostView issue={null} prevIssue={null} nextIssue={null} />

  const [body_html, prevIssue, nextIssue] = await Promise.all([
    renderMarkdown(issue.body || ''),
    getAdjacentIssue(issue.number, -1),
    getAdjacentIssue(issue.number, 1)
  ])

  return <PostView issue={{ ...issue, body_html }} prevIssue={prevIssue} nextIssue={nextIssue} />
}
