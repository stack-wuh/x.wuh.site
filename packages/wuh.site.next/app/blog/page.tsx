import type { Metadata } from 'next'
import { contentService } from '@wuh.site/shared-contracts/endpoints'
import type { ContentItem, ContentLabelSummary, PostListItem } from '@wuh.site/shared-contracts'
import BlogListView from './BlogListView'

const SITE_URL = 'https://wuh.site'

export const metadata: Metadata = {
  title: '博客 · wuh.site',
  description: '收录 GitHub Issues 中的全部博客文章',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'wuh.site 博客',
    description: '收录 GitHub Issues 中的全部博客文章',
    url: `${SITE_URL}/blog`,
    siteName: 'wuh.site',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'wuh.site 博客',
    description: '收录 GitHub Issues 中的全部博客文章',
  },
}

const PER_PAGE = 10

type BlogSearchParams = {
  page?: string | string[]
  labels?: string | string[]
}

const mapContentToPost = (item: ContentItem): PostListItem => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  html_url: `https://github.com/${item.repo}/issues/${item.number}`,
  views: item.viewCount ?? 0,
  created_at: item.createdAtGitHub || '',
  labels: item.labels.map((l) => ({ name: l })),
})

const toPageNumber = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw || '1', 10)
  return Number.isNaN(page) || page < 1 ? 1 : page
}

const toLabelParam = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const label = raw?.trim()
  return label ? label : undefined
}

async function getIssues(page: number, label?: string) {
  const { data, error } = await contentService.getPosts.server({
    query: { page: String(page), limit: String(PER_PAGE), state: 'open', labels: label },
    revalidate: 600,
  })

  if (error || !data) {
    return {
      posts: [] as PostListItem[],
      pagination: { currentPage: page, lastPage: page, hasPrev: page > 1, hasNext: false, total: 0 }
    }
  }

  const result = data as any
  const { pagination } = result
  return {
    posts: result.data.map(mapContentToPost) as PostListItem[],
    pagination: {
      currentPage: pagination.page,
      lastPage: pagination.totalPages,
      hasPrev: pagination.hasPreviousPage,
      hasNext: pagination.hasNextPage,
      total: pagination.total,
    },
  }
}

async function getLabels() {
  const { data } = await contentService.getLabels.server({
    query: { state: 'open' },
    revalidate: 600,
  })

  return Array.isArray(data) ? (data as ContentLabelSummary[]) : []
}

export default async function Page({
  searchParams
}: {
  searchParams?: BlogSearchParams | Promise<BlogSearchParams>
}) {
  const resolvedSearchParams = await searchParams
  const currentPage = toPageNumber(resolvedSearchParams?.page)
  const activeLabel = toLabelParam(resolvedSearchParams?.labels)
  const [{ posts, pagination }, availableLabels] = await Promise.all([
    getIssues(currentPage, activeLabel),
    getLabels(),
  ])

  return (
    <BlogListView
      posts={posts}
      pagination={pagination}
      activeLabel={activeLabel}
      availableLabels={availableLabels}
    />
  )
}
