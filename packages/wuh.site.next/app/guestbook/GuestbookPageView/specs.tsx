export type GuestbookComment = {
  id: string
  nickname: string
  content: string
  createdAt: string
}

export type PaginationInfo = {
  total: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type GuestbookPageViewProps = {
  comments: GuestbookComment[]
  pagination: PaginationInfo
  currentPage: number
}
