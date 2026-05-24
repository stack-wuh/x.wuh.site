import { cache } from 'react'
import type { Metadata } from 'next'
import api from '../../lib/api'
import { renderMarkdown } from '../../lib/markdown'
import type { ContentItem } from '@wuh.site/shared-contracts'
import PostView from '../PostView'
import type { Issue, AdjacentIssue } from '../PostView.types'
import JsonLd from '../../components/JsonLd'

const SITE_URL = 'https://wuh.site'

function buildDescription(issue: Issue): string {
  if (issue.metadata?.summary) return issue.metadata.summary
  if (issue.body) {
    const plain = issue.body.replace(/[#*`\[\]()>!|-]/g, '').replace(/\s+/g, ' ').trim()
    return plain.length > 160 ? plain.slice(0, 157) + '...' : plain
  }
  return '阅读这篇博客文章'
}

const FALLBACK_METADATA: Metadata = {
  title: '博客详情 · wuh.site',
  description: '阅读这篇博客文章',
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

const getIssue = cache(async (num: string) => {
  try {
    const content = await api.content.getPost(num, { revalidate: 1800 });
    const issue = mapContentToIssue(content);
    if (issue.body) {
      issue.body_html = await renderMarkdown(issue.body);
    }
    return {
      issue,
      prev: content.prev ? { number: content.prev.number, title: content.prev.title } : null,
      next: content.next ? { number: content.next.number, title: content.next.title } : null,
      total: content.total,
      position: content.position,
    };
  } catch {
    return { issue: null, prev: null, next: null, total: 0, position: 0 };
  }
})

export async function generateMetadata({ params }: { params: Promise<{ number: string }> }): Promise<Metadata> {
  const { number } = await params
  const { issue } = await getIssue(number)

  if (!issue) {
    return FALLBACK_METADATA
  }

  const description = buildDescription(issue)
  const url = `${SITE_URL}/post/${issue.number}`
  const cover = issue.metadata?.cover

  return {
    title: `${issue.title} · wuh.site`,
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
      images: cover ? [{ url: cover, alt: issue.title }] : [],
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
  const { number } = await params;
  const { issue, prev: prevIssue, next: nextIssue, total, position } = await getIssue(number);
  if (!issue) return <PostView issue={null} prevIssue={null} nextIssue={null} />;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: issue.title,
    description: buildDescription(issue),
    image: issue.metadata?.cover || undefined,
    datePublished: issue.created_at,
    dateModified: issue.updated_at,
    url: `${SITE_URL}/post/${issue.number}`,
    author: {
      '@type': 'Person',
      name: 'shadow',
      url: 'https://github.com/stack-wuh',
    },
  }

  return (
    <>
      <JsonLd data={jsonLd as unknown as Record<string, unknown>} />
      <PostView issue={issue} prevIssue={prevIssue} nextIssue={nextIssue} total={total} position={position} />
    </>
  );
}
