// ============================================
// 博客列表分页导航
// import 路径：
//   Pagination → @wuh.site/components/pagination
// ============================================

import Pagination from '@wuh.site/components/pagination'
import { usePathname, useSearchParams } from 'next/navigation'

export function BlogPagination({ currentPage, totalPages }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getPageUrl = (page) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    return `${pathname}?${params.toString()}`
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      getPageUrl={getPageUrl}
    />
  )
}
