import type { Metadata } from 'next'
import api from '../lib/api'
import type { ContentItem, PostListItem } from '@wuh.site/shared-contracts'
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

type PaginationState = {
  currentPage: number
  lastPage: number
  hasPrev: boolean
  hasNext: boolean
}

const mapContentToPost = (item: ContentItem): PostListItem => ({
  id: item.externalId,
  number: item.number,
  title: item.title,
  comments: item.comments,
  created_at: item.createdAtGitHub || '',
  labels: item.labels.map((l) => ({ name: l })),
})

const toPageNumber = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw || '1', 10)
  return Number.isNaN(page) || page < 1 ? 1 : page
}

async function getIssues(page: number): Promise<{ posts: PostListItem[]; pagination: PaginationState }> {
  try {
    const result = await api.content.getPosts(
      { page, limit: PER_PAGE, state: 'open' },
      { revalidate: 600 }
    )

    const { data, pagination } = result

    return {
      posts: data.map(mapContentToPost),
      pagination: {
        currentPage: pagination.page,
        lastPage: pagination.totalPages,
        hasPrev: pagination.hasPreviousPage,
        hasNext: pagination.hasNextPage,
      },
    }
  } catch {
    return {
      posts: [],
      pagination: { currentPage: page, lastPage: page, hasPrev: page > 1, hasNext: false }
    }
  }
}

export default async function Page({
  searchParams
}: {
  searchParams?: { page?: string | string[] } | Promise<{ page?: string | string[] }>
}) {
  const resolvedSearchParams = await searchParams
  const currentPage = toPageNumber(resolvedSearchParams?.page)
  const { posts, pagination } = await getIssues(currentPage)

  return <BlogListView posts={posts} pagination={pagination} />
}
