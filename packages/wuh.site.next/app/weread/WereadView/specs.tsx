import type { WereadBook } from '@wuh.site/shared-contracts'

export type WereadViewProps = {
  books: WereadBook[]
  total: number
  currentPage: number
  totalPages: number
}
