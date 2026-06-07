'use client'

import styled from '@wuh.site/components/styled'

export type PaginationProps = {
  currentPage: number
  totalPages: number
  getPageUrl: (page: number) => string
}

type PageItem =
  | { type: 'w'; page: 1; label: string }
  | { type: 'u'; page: number; label: string }
  | { type: 'h'; page: number; label: string }
  | { type: 'ellipsis'; key: string; label: string }

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

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 10px;
  margin-top: var(--space-lg);
  flex-wrap: wrap;
`

const LetterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  letter-spacing: 4px;
`

const LetterLink = styled.a<{ $active: boolean }>`
  text-decoration: none;
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'var(--text-muted)')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: color 0.15s ease;

  &:hover {
    color: var(--primary-color);
  }
`

const Ellipsis = styled.span`
  color: var(--text-muted);
  letter-spacing: 0;
  font-size: var(--font-size-sm);
`

const NavLink = styled.a<{ $disabled: boolean }>`
  font-size: var(--font-size-sm);
  color: ${({ $disabled }) => ($disabled ? 'var(--text-muted)' : 'var(--text-secondary)')};
  text-decoration: none;
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  transition: color 0.15s ease, opacity 0.15s ease;

  &:hover {
    color: ${({ $disabled }) => ($disabled ? 'var(--text-muted)' : 'var(--primary-color)')};
  }
`

export default function Pagination({ currentPage, totalPages, getPageUrl }: PaginationProps) {
  if (totalPages <= 1) return null

  const items = getPageItems(currentPage, totalPages)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <Nav aria-label="分页导航">
      <NavLink
        $disabled={!hasPrev}
        href={hasPrev ? getPageUrl(currentPage - 1) : undefined}
        aria-disabled={!hasPrev}
      >上一页</NavLink>

      <LetterGroup>
        {items.map((item) => {
          if (item.type === 'ellipsis') {
            return <Ellipsis key={item.key}>{item.label}</Ellipsis>
          }

          const isActive = item.page === currentPage
          const displayText = isActive && item.type === 'u' ? String(item.page) : item.label

          return (
            <LetterLink
              key={`${item.type}-${item.page}`}
              href={getPageUrl(item.page)}
              $active={isActive}
              aria-current={isActive ? 'page' : undefined}
            >
              {displayText}
            </LetterLink>
          )
        })}
      </LetterGroup>

      <NavLink
        $disabled={!hasNext}
        href={hasNext ? getPageUrl(currentPage + 1) : undefined}
        aria-disabled={!hasNext}
      >下一页</NavLink>
    </Nav>
  )
}
