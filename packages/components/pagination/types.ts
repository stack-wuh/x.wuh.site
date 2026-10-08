export type PaginationProps = {
  currentPage: number
  totalPages: number
  getPageUrl: (page: number) => string
}

export type PageItem =
  | { type: 'w'; page: 1; label: string }
  | { type: 'u'; page: number; label: string }
  | { type: 'h'; page: number; label: string }
  | { type: 'ellipsis'; key: string; label: string }
