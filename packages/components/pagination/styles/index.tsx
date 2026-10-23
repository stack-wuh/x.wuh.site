'use client'

import styled from 'styled-components'
import Link from 'next/link'
import { OFF_LADDER_BREAKPOINTS } from '../../themes/breakpoints'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 14px;
  margin-top: var(--space-lg);
  flex-wrap: wrap;

  @media (max-width: ${OFF_LADDER_BREAKPOINTS.paginationCompact}px) {
    gap: 8px;
  }
`

export const LetterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: ${OFF_LADDER_BREAKPOINTS.paginationCompact}px) {
    gap: 6px;
  }
`

export const LetterLink = styled(Link)<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'var(--text-muted)')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: color var(--motion-dur-quick, 150ms) var(--motion-ease-out-soft, ease-out);

  &:hover {
    color: var(--primary-color);
  }
`

export const Ellipsis = styled.span`
  color: var(--text-muted);
  font-size: var(--font-size-sm);
`

export const NavLink = styled(Link)<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  color: ${({ $disabled }) => ($disabled ? 'var(--text-muted)' : 'var(--text-secondary)')};
  text-decoration: none;
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  transition: color var(--motion-dur-quick, 150ms) var(--motion-ease-out-soft, ease-out), opacity var(--motion-dur-quick, 150ms) var(--motion-ease-out-soft, ease-out);

  &:hover {
    color: ${({ $disabled }) => ($disabled ? 'var(--text-muted)' : 'var(--primary-color)')};
  }
`

export const NavLabelPrev = styled.span`
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width var(--motion-dur-base, 220ms) var(--motion-ease-out-soft, ease-out);

  ${NavLink}:hover & {
    max-width: 52px;
  }
`

export const NavLabelNext = styled.span`
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width var(--motion-dur-base, 220ms) var(--motion-ease-out-soft, ease-out);

  ${NavLink}:hover & {
    max-width: 52px;
  }
`

export const SvgIcon = styled.svg<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;

  // ⑩ 族保留手写：块内声明吃 $size transient（非编译口槽值射程），仅断点值常量化
  @media (max-width: ${OFF_LADDER_BREAKPOINTS.paginationCompact}px) {
    width: ${({ $size }) => Math.round($size * 0.85)}px;
    height: ${({ $size }) => Math.round($size * 0.85)}px;
  }
`

export const PageNum = styled.span`
  font-size: 18px;
  line-height: 1;

  @media (max-width: ${OFF_LADDER_BREAKPOINTS.paginationCompact}px) {
    font-size: 15px;
  }
`
