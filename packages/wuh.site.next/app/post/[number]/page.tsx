import { Metadata } from 'next'
import PostView from '../PostView'

export const metadata: Metadata = {
  title: '博客详情 · wuh.site',
  description: '从 GitHub Issues 渲染的博客文章详情'
}

type Issue = {
  id: number
  number: number
  title: string
  html_url: string
  comments: number
  created_at: string
  labels: { name: string }[]
  body: string
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

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params
  const issue = await getIssue(number)
  if (!issue) return <PostView issue={null} />
  const body_html = await renderMarkdown(issue.body || '')
  return <PostView issue={{ ...issue, body_html }} />
}
