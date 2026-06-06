'use client'

import Link from 'next/link'
import { useCallback, useEffect, useId, useState } from 'react'
import styled from '@wuh.site/components/styled'
import Image from '@wuh.site/components/image'
import { IconBars } from '@wuh.site/components/icons'
import { useThemeMode } from './theme/ThemeModeProvider'

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
  justify-content: flex-start;
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

const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
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

const ThemeToggle = styled.button`
  --toggle-h: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: var(--toggle-h);
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 26%, rgba(0, 0, 0, 0.06));
  background: color-mix(in oklab, var(--primary-color) 14%, var(--background-100) 86%);
  color: var(--primary-color);
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: transform var(--transition-fast) ease, border-color var(--transition-fast) ease, background var(--transition-fast) ease;

  &:hover {
    transform: translateY(-1px);
    border-color: color-mix(in oklab, var(--primary-color) 38%, rgba(0, 0, 0, 0.06));
    background: color-mix(in oklab, var(--primary-color) 20%, var(--background-100) 80%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`

const ThemeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--primary-color);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary-color) 18%, transparent);
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

const MobileActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

const MobileActionButton = styled.button`
  padding: 12px 14px;
  border-radius: 14px;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid color-mix(in oklab, var(--primary-color) 26%, rgba(0,0,0,0.06));
  cursor: pointer;
  transition: background var(--transition-fast) ease, border-color var(--transition-fast) ease, box-shadow var(--transition-fast) ease;

  &:hover {
    background: color-mix(in oklab, var(--primary-color) 12%, var(--background-100) 88%);
    border-color: color-mix(in oklab, var(--primary-color) 40%, rgba(0,0,0,0.06));
    box-shadow: var(--elevation-soft);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }
`

const MobileThemeLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

export default function SiteHeader() {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const { mode, toggleMode } = useThemeMode()

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
          <Image src='/logo.svg' alt='wuh.site' width={42} height={26} priority inline showSkeleton={false} appearance='plain' />
        </Brand>

        <Right>
          <Nav aria-label='主导航'>
            <NavLink href='/blog'>博客</NavLink>
            <NavLink href='/about'>关于</NavLink>
            <NavLink href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer'>
              知识库
            </NavLink>
          </Nav>

          <ThemeToggle type='button' onClick={toggleMode} aria-label={`切换主题（当前：${mode === 'money' ? '酒红' : '素雅'}）`}>
            <ThemeDot aria-hidden='true' />
            <span>{mode === 'money' ? '酒红' : '素雅'}</span>
          </ThemeToggle>

          <MobileToggle
            type='button'
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
          >
            <IconBars />
          </MobileToggle>
        </Right>
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
          <MobileActions>
            <MobileActionButton
              type='button'
              onClick={() => {
                toggleMode()
                close()
              }}
            >
              <MobileThemeLabel>
                <ThemeDot aria-hidden='true' />
                <span>主题：{mode === 'money' ? '酒红' : '素雅'}</span>
              </MobileThemeLabel>
            </MobileActionButton>
          </MobileActions>
        </MobileNav>
      </MobilePanel>
    </HeaderRoot>
  )
}
