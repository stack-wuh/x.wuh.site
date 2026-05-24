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

async function getIssue(num: string): Promise<{
  issue: Issue | null;
  prev: AdjacentIssue | null;
  next: AdjacentIssue | null;
}> {
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
    };
  } catch {
    return { issue: null, prev: null, next: null };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ number: string }> }): Promise<Metadata> {
  const { number } = await params
  const { issue } = await getIssue(number)

  if (!issue) {
    return FALLBACK_METADATA
  }

  return {
    title: `wuh.site · ${issue.title} · 朝朝如念`,
    description: FALLBACK_METADATA.description,
  }
}

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const { issue, prev: prevIssue, next: nextIssue } = await getIssue(number);
  if (!issue) return <PostView issue={null} prevIssue={null} nextIssue={null} />;

  return <PostView issue={issue} prevIssue={prevIssue} nextIssue={nextIssue} />;
}
