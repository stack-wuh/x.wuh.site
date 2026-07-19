import Button from '@wuh.site/components/button'
import styled from '@wuh.site/components/styled'
import Link from 'next/link'

const BREAKPOINT = '768px'

export const HeaderRoot = styled.header`
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

export const HeaderInner = styled.div`
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 14px clamp(16px, 4vw, 60px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-sm);
`

export const Brand = styled.div`
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

export const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: 12px;

  @media (min-width: ${BREAKPOINT}) { display: flex; }
`

export const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
`

export const NavLink = styled(Link)`
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

export const MobileToggle = styled(Button)`
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

  @media (min-width: ${BREAKPOINT}) { display: none; }

  &:hover {
    transform: translateY(-1px);
    border-color: color-mix(in oklab, var(--primary-color) 35%, var(--normal-300) 65%);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 65%, white);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }
`

export const DesktopThemeToggle = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 44px;
  min-height: 36px;
  padding: 0 10px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 28%, var(--normal-300) 72%);
  border-radius: 999px;
  background: color-mix(in oklab, var(--primary-color) 10%, var(--background-100) 90%);
  color: var(--text-primary);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition:
    transform 180ms ease-out,
    background-color 180ms ease-out,
    border-color 180ms ease-out,
    box-shadow 180ms ease-out;

  &:hover {
    transform: translateY(-1px);
    border-color: color-mix(in oklab, var(--primary-color) 48%, var(--normal-300) 52%);
    background: color-mix(in oklab, var(--primary-color) 16%, var(--background-100) 84%);
    box-shadow: 0 4px 12px color-mix(in oklab, var(--primary-color) 12%, transparent);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 72%, white);
    outline-offset: 3px;
  }

  @media (max-width: ${BREAKPOINT}) { display: none; }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`

export const ThemeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  color: var(--primary-color);
`

export const ThemeValue = styled.span`
  min-width: 0;
  white-space: nowrap;
`

export const ThemeChevron = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
`

export const MobilePanel = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  padding: 0 clamp(16px, 4vw, 60px) 14px;

  @media (min-width: ${BREAKPOINT}) { display: none; }
`

export const MobileNav = styled.nav`
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

export const MobileItem = styled(Link)`
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

export const MobileActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

export const MobileThemeAction = styled.button`
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 44px;
  min-height: 48px;
  padding: 8px 14px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 28%, var(--normal-300) 72%);
  border-radius: 14px;
  background: color-mix(in oklab, var(--primary-color) 8%, var(--background-100) 92%);
  color: var(--text-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  touch-action: manipulation;
  transition:
    background-color 180ms ease-out,
    border-color 180ms ease-out,
    box-shadow 180ms ease-out;

  &:hover {
    border-color: color-mix(in oklab, var(--primary-color) 46%, var(--normal-300) 54%);
    background: color-mix(in oklab, var(--primary-color) 14%, var(--background-100) 86%);
    box-shadow: var(--elevation-soft);
  }

  &:active {
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--primary-color) 72%, white);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`

export const MobileThemeMain = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1 1 auto;
`

export const MobileThemeCopy = styled.span`
  display: grid;
  gap: 2px;
  min-width: 0;
`

export const MobileThemeTitle = styled.span`
  overflow: hidden;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MobileThemeCurrent = styled.span`
  overflow: hidden;
  color: var(--text-secondary);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
`
