import styled from 'styled-components'
import Link from 'next/link'
import { responsive } from '@wuh.site/components/themes/responsive'

const hairline = 'color-mix(in oklab, var(--normal-400) 55%, transparent)'

export const Toolbar = styled.nav`
  margin-top: var(--space-xl);
`

export const ToolbarMeta = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);

  > span {
    white-space: nowrap;
    letter-spacing: 0.04em;
    user-select: none;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 180ms ease;

    svg {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }

    &:hover {
      color: var(--primary-color);
    }
  }
`

export const SpreadLabel = styled.span`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  white-space: nowrap;
`

export const SpreadTitle = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-serif);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  transition: color 180ms ease;
`

export const SpreadArrow = styled.span`
  flex-shrink: 0;
  color: var(--text-muted);
  transition: color 180ms ease, transform 180ms ease;
`

export const Spread = styled.div`
  align-items: center;
  margin-top: 12px;

  /* 桌面端前后篇已移入目录侧栏（TocPrevNext），文末仅移动/平板保留。
     折叠/显隐经 themes/responsive 唯一编译口（载体 grid-div 不可 Flex 化，备忘⑦）：
     基线=≤640 单列零 gap，md 槽(641)三列桌面形，lg 槽(1024)整体隐藏 */
  ${responsive(['grid-template-columns: minmax(0, 1fr); gap: 0;', undefined, 'grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr); gap: clamp(14px, 3vw, 32px);'], (v) => v)}
  ${responsive([false, undefined, undefined, true], (v) => (v ? 'display: none;' : 'display: grid;'))}
`

export const SpreadDivider = styled.div`
  background: ${hairline};

  /* ≤640 竖线转横线走编译口：基线=移动形（横线拉伸），md 槽(641)起桌面竖线 */
  ${responsive(['width: auto; height: 1px; justify-self: stretch;', undefined, 'width: 1px; height: 44px; justify-self: center;'], (v) => v)}
`

export const SpreadSide = styled(Link)<{ $next?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 44px;
  text-decoration: none;
  ${({ $next }) => ($next ? 'justify-content: flex-end;' : 'justify-content: flex-start;')}

  /* ≤640 行内纵垫走编译口（载体 styled(Link) 锚点保留，备忘⑥）：基线 12px 0，md 槽(641)归零 */
  ${responsive(['12px 0', undefined, '0'], (v) => `padding: ${v};`)}

  &:hover ${SpreadTitle},
  &:hover ${SpreadArrow} {
    color: var(--primary-color);
  }

  &:hover ${SpreadArrow} {
    transform: translateX(${({ $next }) => ($next ? '3px' : '-3px')});
  }

  ${({ $disabled }) =>
    $disabled
      ? `pointer-events: none; cursor: default;
  ${SpreadTitle}, ${SpreadArrow} { opacity: 0.45; }`
      : ''}

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--primary-color) 24%, transparent);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    ${SpreadTitle},
    ${SpreadArrow} {
      transition: none;
    }

    &:hover ${SpreadArrow} {
      transform: none;
    }
  }
`
