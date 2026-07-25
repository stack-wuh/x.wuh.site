import { cache } from 'react'
import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { contentService } from '@wuh.site/shared-contracts/endpoints'
import { renderMarkdown } from '../../lib/markdown'
import { buildPostUrl, isCanonicalPostPath } from '../../lib/slug'
import type { ContentItem, AdjacentPost } from '@wuh.site/shared-contracts'
import PostView from '../PostView'
import type { Issue } from '../PostView.types'
import { selectRelatedPosts, type RelatedPostCandidate } from '../../lib/related-posts'
import JsonLd from '../../components/JsonLd'
import { createArticleStructuredData, createBreadcrumbStructuredData } from '../../lib/structured-data'

const SITE_URL = 'https://wuh.site'

function buildDescription(issue: Issue): string {
  if (issue.metadata?.summary) return issue.metadata.summary
  if (issue.body) {
    const plain = issue.body.replace(/[#*`[\]()>{}!|-]/g, '').replace(/\s+/g, ' ').trim()
    return plain.length > 160 ? plain.slice(0, 157) + '...' : plain
  }
  return '阅读这篇博客文章'
}

const FALLBACK_METADATA: Metadata = {
  title: '博客详情',
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
  } : null,
})


const mapContentToRelatedPost = (item: ContentItem): RelatedPostCandidate => ({
  number: item.number,
  title: item.title,
  labels: item.labels,
  updatedAt: item.updatedAtGitHub || item.createdAtGitHub,
  summary: item.metadata?.summary || null,
})

async function getRelatedPosts(issue: Issue) {
  const labels = Array.from(new Set(issue.labels.map((label) => label.name.trim()).filter(Boolean))).slice(0, 3)
  if (labels.length === 0) return []

  const responses = await Promise.all(
    labels.map((label) => contentService.getPosts.server({
      query: { labels: [label], limit: '10', state: 'open' },
      revalidate: 3600,
    })),
  )
  const candidates = responses.flatMap(({ data, error }) => {
    if (error || !data) return []
    return (((data as any).data || []) as ContentItem[]).map(mapContentToRelatedPost)
  })

  return selectRelatedPosts({ number: issue.number, labels }, candidates)
}

type IssueData = {
  issue: Issue | null
  prev: AdjacentPost
  next: AdjacentPost
  total: number
  position: number
}

const getIssue = cache(async (num: string): Promise<IssueData> => {
  const { data, error } = await contentService.getPost.server({
    params: { slug: num },
    revalidate: 3600,
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
  const { issue } = await getIssue(number)

  if (!issue) {
    return FALLBACK_METADATA
  }

  const description = buildDescription(issue)
  const url = `${SITE_URL}${buildPostUrl(issue.number, issue.title)}`
  const cover = issue.metadata?.cover

  return {
    title: issue.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: issue.title,
      description,
      url,
      siteName: 'wuh.site',
      type: 'article',
      publishedTime: issue.created_at,
      modifiedTime: issue.updated_at,
      images: cover ? [{ url: cover, alt: issue.metadata?.coverAlt || issue.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: issue.title,
      description,
      images: cover ? [cover] : [],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number: raw } = await params;
  const number = raw.split('-')[0];
  const { issue, prev: prevIssue, next: nextIssue, total, position } = await getIssue(number)
  if (!issue) return <PostView issue={null} prevIssue={null} nextIssue={null} />

  if (!isCanonicalPostPath(raw, issue.number, issue.title)) {
    permanentRedirect(buildPostUrl(issue.number, issue.title))
  }

  const relatedPosts = await getRelatedPosts(issue)
  const url = `${SITE_URL}${buildPostUrl(issue.number, issue.title)}`
  const articleJsonLd = createArticleStructuredData({
    url,
    title: issue.title,
    description: buildDescription(issue),
    publishedAt: issue.created_at,
    modifiedAt: issue.updated_at,
    image: issue.metadata?.cover,
    imageAlt: issue.metadata?.coverAlt,
    keywords: issue.metadata?.keywords,
    labels: issue.labels.map((label) => label.name),
  })
  const breadcrumbJsonLd = createBreadcrumbStructuredData([
    { name: '首页', url: SITE_URL },
    { name: '博客', url: `${SITE_URL}/blog` },
    { name: issue.title, url },
  ])

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PostView issue={issue} prevIssue={prevIssue} nextIssue={nextIssue} total={total} position={position} relatedPosts={relatedPosts} />
    </>
  )
}
