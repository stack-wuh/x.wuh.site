import type { WereadBook } from '@wuh.site/core'

export type WereadViewProps = {
  books: WereadBook[]
  total: number
  currentPage: number
  totalPages: number
}
