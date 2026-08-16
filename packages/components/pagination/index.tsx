'use client'

import * as S from './styles'
import type { PageItem, PaginationProps } from './specs'

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 1) return []

  const items: PageItem[] = []
  items.push({ type: 'w', page: 1, label: 'W' })

  if (totalPages <= 5) {
    for (let p = 2; p < totalPages; p++) {
      items.push({ type: 'u', page: p, label: 'u' })
    }
  } else {
    const rangeStart = Math.max(2, currentPage - 2)
    const rangeEnd = Math.min(totalPages - 1, currentPage + 2)

    if (rangeStart > 2) {
      items.push({ type: 'ellipsis', key: 'ellipsis-l', label: '...' })
    }
    for (let p = rangeStart; p <= rangeEnd; p++) {
      items.push({ type: 'u', page: p, label: 'u' })
    }
    if (rangeEnd < totalPages - 1) {
      items.push({ type: 'ellipsis', key: 'ellipsis-r', label: '...' })
    }
  }

  items.push({ type: 'h', page: totalPages, label: 'H' })
  return items
}

function WIcon() {
  return (
    <S.SvgIcon $size={20} viewBox='0 0 24 18'>
      <path d='M2 2 L6 16 L12 8 L18 16 L22 2' />
    </S.SvgIcon>
  )
}

function UIcon() {
  return (
    <S.SvgIcon $size={14} viewBox='0 0 18 18'>
      <path d='M3 4 C3 12 4 14 9 14 C14 14 15 12 15 4' />
    </S.SvgIcon>
  )
}

function HIcon() {
  return (
    <S.SvgIcon $size={20} viewBox='0 0 18 18'>
      <path d='M3 2 L3 16' />
      <path d='M15 2 L15 16' />
      <path d='M3 9 L15 9' />
    </S.SvgIcon>
  )
}

function ArrowLeftIcon() {
  return (
    <S.SvgIcon $size={16} viewBox='0 0 18 18'>
      <path d='M11 4 L5 9 L11 14' />
    </S.SvgIcon>
  )
}

function ArrowRightIcon() {
  return (
    <S.SvgIcon $size={16} viewBox='0 0 18 18'>
      <path d='M7 4 L13 9 L7 14' />
    </S.SvgIcon>
  )
}

function PageNumber({ page }: { page: number }) {
  return <S.PageNum>{page}</S.PageNum>
}

const iconMap: Record<string, () => React.ReactElement> = {
  w: WIcon,
  u: UIcon,
  h: HIcon,
}

export default function Pagination({ currentPage, totalPages, getPageUrl }: PaginationProps) {
  if (totalPages <= 1) return null

  const items = getPageItems(currentPage, totalPages)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <S.Nav aria-label='分页导航'>
      <S.NavLink
        $disabled={!hasPrev}
        href={hasPrev ? getPageUrl(currentPage - 1) : undefined}
        aria-label='上一页'
        aria-disabled={!hasPrev}
      ><S.NavLabelPrev>上一页</S.NavLabelPrev><ArrowLeftIcon /></S.NavLink>

      <S.LetterGroup>
        {items.map((item) => {
          if (item.type === 'ellipsis') {
            return <S.Ellipsis key={item.key}>{item.label}</S.Ellipsis>
          }

          const isActive = item.page === currentPage
          const Icon = iconMap[item.type]

          return (
            <S.LetterLink
              key={`${item.type}-${item.page}`}
              href={getPageUrl(item.page)}
              $active={isActive}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && item.type === 'u' ? <PageNumber page={item.page} /> : <Icon />}
            </S.LetterLink>
          )
        })}
      </S.LetterGroup>

      <S.NavLink
        $disabled={!hasNext}
        href={hasNext ? getPageUrl(currentPage + 1) : undefined}
        aria-label='下一页'
        aria-disabled={!hasNext}
      ><ArrowRightIcon /><S.NavLabelNext>下一页</S.NavLabelNext></S.NavLink>
    </S.Nav>
  )
}
