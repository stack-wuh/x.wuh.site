import { cache } from 'react'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { contentService } from '@wuh.site/shared-contracts/endpoints'
import { renderMarkdown } from '../../lib/markdown'
import { buildArticleMetadata, buildBlogPostingJsonLd } from '../../lib/seo'
import type { ContentItem, AdjacentPost } from '@wuh.site/shared-contracts'
import PostView from '../PostView'
import type { Issue } from '../PostView.types'
import JsonLd from '../../components/JsonLd'

const ANON_COOKIE_NAME = 'anonId'

async function getAnonCookieHeader() {
  const anonId = (await cookies()).get(ANON_COOKIE_NAME)?.value
  if (!anonId) return undefined
  return `${ANON_COOKIE_NAME}=${encodeURIComponent(anonId)}`
}


const FALLBACK_METADATA: Metadata = {
  title: '博客详情 · wuh.site',
  description: '阅读这篇博客文章',
}

const mapContentToIssue = (item: ContentItem): Issue => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/stack-wuh/blog/issues/${item.number}`,
  repository_url: 'https://api.github.com/repos/stack-wuh/blog',
  comments: item.comments,
  viewCount: item.viewCount ?? 0,
  likeCount: item.likeCount ?? 0,
  liked: item.liked ?? false,
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
    coverAlt: item.metadata.coverAlt || null,
    summary: item.metadata.summary || null,
    slug: item.metadata.slug || null,
    keywords: item.metadata.keywords || null,
    extra: item.metadata.extra || undefined,
  } : null,
})

type IssueData = {
  issue: Issue | null
  prev: AdjacentPost
  next: AdjacentPost
  total: number
  position: number
}

const getIssue = cache(async (num: string, cookie?: string): Promise<IssueData> => {
  const { data, error } = await contentService.getPost.server({
    params: { slug: num },
    revalidate: 0,
    headers: cookie ? { Cookie: cookie } : undefined,
  })

  if (error || !data) {
    return { issue: null, prev: null, next: null, total: 0, position: 0 }
  }

  const content = data as any
  const issue = mapContentToIssue(content)
  if (issue.body) {
    issue.body_html = await renderMarkdown(issue.body)
  }
  return {
    issue,
    prev: content.prev ? { number: content.prev.number, title: content.prev.title } : null,
    next: content.next ? { number: content.next.number, title: content.next.title } : null,
    total: content.total,
    position: content.position,
  }
})

export async function generateMetadata({ params }: { params: Promise<{ number: string }> }): Promise<Metadata> {
  const { number: raw } = await params
  const number = raw.split('-')[0]
  const cookie = await getAnonCookieHeader()
  const { issue } = await getIssue(number, cookie)

  if (!issue) {
    return FALLBACK_METADATA
  }

  return buildArticleMetadata(issue)
}

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number: raw } = await params;
  const number = raw.split('-')[0];
  const cookie = await getAnonCookieHeader()
  const { issue, prev: prevIssue, next: nextIssue, total, position } = await getIssue(number, cookie);
  if (!issue) return <PostView issue={null} prevIssue={null} nextIssue={null} />;

  const jsonLd = buildBlogPostingJsonLd(issue)

  return (
    <>
      <JsonLd data={jsonLd as unknown as Record<string, unknown>} />
      <PostView issue={issue} prevIssue={prevIssue} nextIssue={nextIssue} total={total} position={position} />
    </>
  );
}
