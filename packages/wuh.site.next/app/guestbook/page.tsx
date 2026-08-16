import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import GuestbookPageView from './GuestbookPageView'
import { GUESTBOOK_ISSUE_NUMBER, GUESTBOOK_LIMIT, nestApiUrl, type GuestbookResponse, type GuestbookSearchParams } from './specs'

export const metadata: Metadata = {
  title: '留言板 - wuh.site',
  description: '在吴尒红（Shadow）的个人站留下足迹，分享想法与问候。',
}

function clampPage(raw: unknown): number {
  const n = Number(raw)
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
}

export default async function GuestbookPage({
  searchParams,
}: {
  searchParams: Promise<GuestbookSearchParams>
}) {
  const params = await searchParams
  const page = clampPage(params?.page)

  const url = `${nestApiUrl}/comments?issueNumber=${GUESTBOOK_ISSUE_NUMBER}&page=${page}&limit=${GUESTBOOK_LIMIT}`

  let data: GuestbookResponse

  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    data = await res.json()
  } catch {
    throw new Error('留言板数据加载失败，请稍后重试。')
  }

  const totalPages = data.pagination.totalPages || 1

  // 越界页码归一到第 1 页
  if (page > totalPages && totalPages > 0) {
    redirect('/guestbook?page=1')
  }

  const comments = data.data.map((item) => ({
    id: String(item.externalId || item._id),
    nickname: item.nickname,
    content: item.content,
    createdAt: item.createdAt,
  }))

  return (
    <GuestbookPageView
      comments={comments}
      pagination={data.pagination}
      currentPage={page}
    />
  )
}
