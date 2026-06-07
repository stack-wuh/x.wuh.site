import type { Metadata } from 'next'
import type { WereadBook } from '@wuh.site/shared-contracts'
import { wereadService } from '@wuh.site/shared-contracts/endpoints'
import WereadView from './WereadView'

const SITE_URL = 'https://wuh.site'
const PER_PAGE = 10

export const metadata: Metadata = {
  title: '微信读书 · wuh.site',
  description: 'stack-wuh 的微信读书书架',
  alternates: { canonical: `${SITE_URL}/weread` },
  openGraph: {
    title: '微信读书 · wuh.site',
    description: 'stack-wuh 的微信读书书架',
    url: `${SITE_URL}/weread`,
    siteName: 'wuh.site',
    type: 'website',
  },
}

const toPageNumber = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw || '1', 10)
  return Number.isNaN(page) || page < 1 ? 1 : page
}

async function getBooks(page: number): Promise<{ books: WereadBook[]; total: number; currentPage: number; totalPages: number }> {
  const { data, error } = await wereadService.getBooks.server({
    query: { page: String(page), limit: String(PER_PAGE) },
    revalidate: 3600,
  })

  if (error || !data) {
    return { books: [], total: 0, currentPage: page, totalPages: 1 }
  }

  const result = data as any
  return {
    books: (result.data || []) as WereadBook[],
    total: result.pagination?.total || 0,
    currentPage: result.pagination?.page || page,
    totalPages: result.pagination?.totalPages || 1,
  }
}

export default async function Page({
  searchParams
}: {
  searchParams?: { page?: string | string[] } | Promise<{ page?: string | string[] }>
}) {
  const resolvedSearchParams = await searchParams
  const currentPage = toPageNumber(resolvedSearchParams?.page)
  const { books, total, totalPages } = await getBooks(currentPage)

  return <WereadView books={books} total={total} currentPage={currentPage} totalPages={totalPages} />
}
