'use client'

import styled from '@wuh.site/components/styled'

export const Nav = styled.nav`
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

export const LetterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`

export const LetterLink = styled.a<{ $active: boolean }>`
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

export const Ellipsis = styled.span`
  color: var(--text-muted);
  font-size: var(--font-size-sm);
`

export const NavLink = styled.a<{ $disabled: boolean }>`
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

export const NavLabelPrev = styled.span`
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.2s ease;

  ${NavLink}:hover & {
    max-width: 52px;
  }
`

export const NavLabelNext = styled.span`
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.2s ease;

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

  @media (max-width: 480px) {
    width: ${({ $size }) => Math.round($size * 0.85)}px;
    height: ${({ $size }) => Math.round($size * 0.85)}px;
  }
`

export const PageNum = styled.span`
  font-size: 18px;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`
