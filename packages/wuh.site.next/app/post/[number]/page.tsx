import type { Metadata } from 'next'
import api from '../../lib/api'
import { renderMarkdown } from '../../lib/markdown'
import type { ContentItem } from '@wuh.site/shared-contracts'
import PostView from '../PostView'
import type { Issue, AdjacentIssue } from '../PostView.types'

const FALLBACK_METADATA: Metadata = {
  title: '博客详情 · wuh.site',
  description: '从 GitHub Issues 渲染的博客文章详情',
}

const mapContentToIssue = (item: ContentItem): Issue => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/${item.repo}/issues/${item.number}`,
  repository_url: item.repo ? `https://api.github.com/repos/${item.repo}` : null,
  comments: item.comments,
  created_at: item.createdAtGitHub || '',
  updated_at: item.updatedAtGitHub || item.createdAtGitHub || '',
  user: item.author ? {
    login: item.author.login,
    userName: item.author.login,
    avatarUrl: item.author.avatarUrl || null,
  } : null,
  labels: item.labels.map((l) => ({ name: l })),
  body: item.body || '',
  body_html: item.bodyHtml || '',
  metadata: item.metadata ? {
    cover: item.metadata.cover || null,
    summary: item.metadata.summary || null,
    slug: item.metadata.slug || null,
    keywords: item.metadata.keywords || null,
  } : null,
})

async function getIssue(num: string): Promise<Issue | null> {
  try {
    const content = await api.content.getPost(num, { revalidate: 1800 })
    const issue = mapContentToIssue(content)
    if (issue.body) {
      issue.body_html = await renderMarkdown(issue.body)
    }
    return issue
  } catch {
    return null
  }
}

async function getAdjacentIssue(issueNumber: number, offset: -1 | 1): Promise<AdjacentIssue | null> {
  const adjacentNumber = issueNumber + offset
  if (adjacentNumber <= 0) return null

  try {
    const content = await api.content.getPost(String(adjacentNumber), { revalidate: 1800 })
    // Filter out pull requests (not in our content DB, but just in case)
    return {
      number: content.number,
      title: content.title,
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

  const [prevIssue, nextIssue] = await Promise.all([
    getAdjacentIssue(issue.number, -1),
    getAdjacentIssue(issue.number, 1)
  ])

  return <PostView issue={issue} prevIssue={prevIssue} nextIssue={nextIssue} />
}
