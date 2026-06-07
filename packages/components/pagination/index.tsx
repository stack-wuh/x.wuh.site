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
  gap: 14px;
  margin-top: var(--space-lg);
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 8px;
  }
`

const LetterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`

const LetterLink = styled.a<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
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
  font-size: var(--font-size-sm);
`

const NavLink = styled.a<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
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

const NavLabelPrev = styled.span`
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.2s ease;

  ${NavLink}:hover & {
    max-width: 52px;
  }
`

const NavLabelNext = styled.span`
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.2s ease;

  ${NavLink}:hover & {
    max-width: 52px;
  }
`

const SvgIcon = styled.svg<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;

  @media (max-width: 480px) {
    width: ${({ $size }) => Math.round($size * 0.85)}px;
    height: ${({ $size }) => Math.round($size * 0.85)}px;
  }
`

function WIcon() {
  return (
    <SvgIcon $size={20} viewBox="0 0 24 18">
      <path d="M2 2 L6 16 L12 8 L18 16 L22 2" />
    </SvgIcon>
  )
}

function UIcon() {
  return (
    <SvgIcon $size={14} viewBox="0 0 18 18">
      <path d="M3 4 C3 12 4 14 9 14 C14 14 15 12 15 4" />
    </SvgIcon>
  )
}

function HIcon() {
  return (
    <SvgIcon $size={20} viewBox="0 0 18 18">
      <path d="M3 2 L3 16" />
      <path d="M15 2 L15 16" />
      <path d="M3 9 L15 9" />
    </SvgIcon>
  )
}

function ArrowLeftIcon() {
  return (
    <SvgIcon $size={16} viewBox="0 0 18 18">
      <path d="M11 4 L5 9 L11 14" />
    </SvgIcon>
  )
}

function ArrowRightIcon() {
  return (
    <SvgIcon $size={16} viewBox="0 0 18 18">
      <path d="M7 4 L13 9 L7 14" />
    </SvgIcon>
  )
}

const PageNum = styled.span`
  font-size: 18px;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`

function PageNumber({ page }: { page: number }) {
  return <PageNum>{page}</PageNum>
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
    <Nav aria-label="分页导航">
      <NavLink
        $disabled={!hasPrev}
        href={hasPrev ? getPageUrl(currentPage - 1) : undefined}
        aria-label="上一页"
        aria-disabled={!hasPrev}
      ><NavLabelPrev>上一页</NavLabelPrev><ArrowLeftIcon /></NavLink>

      <LetterGroup>
        {items.map((item) => {
          if (item.type === 'ellipsis') {
            return <Ellipsis key={item.key}>{item.label}</Ellipsis>
          }

          const isActive = item.page === currentPage
          const Icon = iconMap[item.type]

          return (
            <LetterLink
              key={`${item.type}-${item.page}`}
              href={getPageUrl(item.page)}
              $active={isActive}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && item.type === 'u' ? <PageNumber page={item.page} /> : <Icon />}
            </LetterLink>
          )
        })}
      </LetterGroup>

      <NavLink
        $disabled={!hasNext}
        href={hasNext ? getPageUrl(currentPage + 1) : undefined}
        aria-label="下一页"
        aria-disabled={!hasNext}
      ><ArrowRightIcon /><NavLabelNext>下一页</NavLabelNext></NavLink>
    </Nav>
  )
}
