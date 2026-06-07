import type { Metadata } from 'next'
import api from '../lib/api'
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

type Book = {
  bookId: string
  title: string
  author: string
  cover: string
  readUpdateTime: number
  finishReading: number
}

type PageData = {
  books: Book[]
  total: number
  currentPage: number
  totalPages: number
}

const toPageNumber = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(raw || '1', 10)
  return Number.isNaN(page) || page < 1 ? 1 : page
}

async function getBooks(page: number): Promise<PageData> {
  try {
    const result = await api.weread.getBooks({ page, limit: PER_PAGE }, { revalidate: 3600 })
    const data = result as any
    return {
      books: data.data || [],
      total: data.pagination?.total || 0,
      currentPage: data.pagination?.page || page,
      totalPages: data.pagination?.totalPages || 1,
    }
  } catch {
    return { books: [], total: 0, currentPage: page, totalPages: 1 }
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
