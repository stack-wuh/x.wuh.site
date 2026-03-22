import type { Metadata } from 'next'
import { fetcher } from '@wuh.site/hooks/useFetch/fetcher'
import BlogListView from './BlogListView'

export const metadata: Metadata = {
  title: 'wuh.site · 悟已往之不谏',
  description: '收录 GitHub Issues 中的全部博客文章'
}

const PER_PAGE = 10

type Issue = {
  id: number
  number: number
  title: string
  html_url: string
  comments: number
  created_at: string
  labels: { name: string; color?: string | null }[]
  pull_request?: object
}

type PaginationState = {
  currentPage: number
  lastPage: number | null
  hasPrev: boolean
  hasNext: boolean
}

type PaginationLinks = {
  next?: string
  prev?: string
  last?: string
  first?: string
}

const parseLinkHeader = (header: string | null): PaginationLinks => {
  if (!header) return {}
  return header.split(',').reduce<PaginationLinks>((acc, part) => {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/)
    if (!match) return acc
    const [, url, rel] = match
    acc[rel as keyof PaginationLinks] = url
    return acc
  }, {})
}

const parsePageNumber = (link?: string) => {
  if (!link) return null
  try {
    const url = new URL(link)
    const page = Number.parseInt(url.searchParams.get('page') || '', 10)
    return Number.isNaN(page) ? null : page
  } catch {
    return null
  }
}

const getPaginationState = (currentPage: number, linkHeader: string | null, hasMore: boolean): PaginationState => {
  const links = parseLinkHeader(linkHeader)
  const lastPage = parsePageNumber(links.last)
  const hasNext = Boolean(links.next) || hasMore
  const hasPrev = currentPage > 1

  return {
    currentPage,
    lastPage: lastPage ?? (hasNext ? null : currentPage),
    hasPrev,
    hasNext
  }
}

const toPageNumber = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw || '1', 10)
  return Number.isNaN(page) || page < 1 ? 1 : page
}

async function getIssues(page: number): Promise<{ posts: Issue[]; pagination: PaginationState }> {
  try {
    const res = await fetcher<Issue[]>(
      `https://api.github.com/repos/stack-wuh/blog/issues?per_page=${PER_PAGE}&page=${page}&state=open&sort=created&direction=desc`,
      {
        headers: { 'Accept': 'application/vnd.github+json' },
        next: { revalidate: 600 }
      }
    )

    if (!res.ok || !res.data) {
      return {
        posts: [],
        pagination: { currentPage: page, lastPage: page, hasPrev: page > 1, hasNext: false }
      }
    }

    const posts = res.data
      .filter(item => !item.pull_request)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const linkHeader = res.headers?.get('link') ?? null
    const pagination = getPaginationState(page, linkHeader, posts.length === PER_PAGE)

    return { posts, pagination }
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
