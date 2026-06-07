import type { Metadata } from 'next'
import api from '../lib/api'

const SITE_URL = 'https://wuh.site'

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

async function getBooks(): Promise<Book[]> {
  try {
    const data = await api.weread.getBooks(undefined, { revalidate: 3600 })
    return (data as any).books || []
  } catch {
    return []
  }
}

type Props = {
  repos: Book[]
}

import WereadView from './WereadView'

export default async function Page() {
  const books = await getBooks()
  return <WereadView books={books} />
}
