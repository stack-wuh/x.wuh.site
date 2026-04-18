'use client'

import Link from 'next/link'
import { useCallback, useEffect, useId, useState } from 'react'
import styled from 'styled-components'
import Image from '@wuh.site/components/image'

const BREAKPOINT = '768px'

const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid color-mix(in oklab, var(--normal-300) 60%, transparent);
  background:
    linear-gradient(
      180deg,
      color-mix(in oklab, var(--background-color) 72%, transparent),
      color-mix(in oklab, var(--background-color) 84%, transparent)
    );
  backdrop-filter: blur(10px);
`

const HeaderInner = styled.div`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 14px clamp(16px, 4vw, 60px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
`

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0;
  color: var(--text-color);
  min-width: 0;

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
    border-radius: 10px;
  }
`

const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: 12px;

  @media (min-width: ${BREAKPOINT}) {
    display: flex;
  }
`

const NavLink = styled(Link)`
  text-decoration: none;
  color: color-mix(in oklab, var(--text-color) 78%, transparent);
  font-size: var(--font-size-sm);
  padding: 10px 12px;
  border-radius: 999px;
  transition: background var(--transition-fast) ease, color var(--transition-fast) ease, transform var(--transition-fast) ease;

  &:hover {
    color: var(--text-color);
    background: color-mix(in oklab, var(--background-100) 75%, transparent);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }
`

const MobileToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 60%, transparent);
  background: color-mix(in oklab, var(--background-100) 70%, transparent);
  color: var(--text-primary);
  cursor: pointer;
  transition: transform var(--transition-fast) ease, background var(--transition-fast) ease, border-color var(--transition-fast) ease;

  @media (min-width: ${BREAKPOINT}) {
    display: none;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: color-mix(in oklab, var(--primary-color) 35%, var(--normal-300) 65%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`

const MobilePanel = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  padding: 0 clamp(16px, 4vw, 60px) 14px;

  @media (min-width: ${BREAKPOINT}) {
    display: none;
  }
`

const MobileNav = styled.nav`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 12px;
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in oklab, var(--normal-300) 55%, transparent);
  background: color-mix(in oklab, var(--background-100) 78%, transparent);
  box-shadow: var(--elevation-soft);
  display: grid;
  gap: 10px;
`

const MobileItem = styled(Link)`
  padding: 12px 14px;
  border-radius: 14px;
  text-decoration: none;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid transparent;
  transition: background var(--transition-fast) ease, border-color var(--transition-fast) ease;

  &:hover {
    background: color-mix(in oklab, var(--background-200) 80%, transparent);
    border-color: color-mix(in oklab, var(--primary-color) 25%, var(--normal-300) 75%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }
`

const IconBars = () => (
  <svg viewBox='0 0 24 24' width='18' height='18' aria-hidden='true' focusable='false'>
    <path
      fill='currentColor'
      d='M4 7.5c0-.55.45-1 1-1h14a1 1 0 1 1 0 2H5c-.55 0-1-.45-1-1Zm0 5c0-.55.45-1 1-1h14a1 1 0 1 1 0 2H5c-.55 0-1-.45-1-1Zm1 4c-.55 0-1 .45-1 1s.45 1 1 1h14a1 1 0 1 0 0-2H5Z'
    />
  </svg>
)

export default function SiteHeader() {
  const panelId = useId()
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((v) => !v), [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  return (
    <HeaderRoot>
      <HeaderInner>
        <Brand aria-label='站点标识'>
          <Image src='/logo.svg' alt='wuh.site' width={42} height={26} inline showSkeleton={false} appearance='plain' />
        </Brand>

        <Nav aria-label='主导航'>
          <NavLink href='/blog'>博客</NavLink>
          <NavLink href='/about'>关于</NavLink>
          <NavLink href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer'>
            知识库
          </NavLink>
        </Nav>

        <MobileToggle
          type='button'
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
        >
          <IconBars />
        </MobileToggle>
      </HeaderInner>

      <MobilePanel id={panelId} $open={open}>
        <MobileNav aria-label='移动端导航'>
          <MobileItem href='/' onClick={close}>
            首页
          </MobileItem>
          <MobileItem href='/blog' onClick={close}>
            博客
          </MobileItem>
          <MobileItem href='/about' onClick={close}>
            关于
          </MobileItem>
          <MobileItem href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer' onClick={close}>
            知识库
          </MobileItem>
        </MobileNav>
      </MobilePanel>
    </HeaderRoot>
  )
}
