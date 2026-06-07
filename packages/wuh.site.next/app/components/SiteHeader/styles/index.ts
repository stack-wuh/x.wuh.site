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

export const MobileToggle = styled.button`
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

export const ThemeToggle = styled.button`
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

  @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }
  @media (max-width: ${BREAKPOINT}) { display: none; }
`

export const ThemeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--primary-color);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary-color) 18%, transparent);
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

export const MobileActionButton = styled.button`
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

export const MobileThemeLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`
