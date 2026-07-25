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
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 60%, transparent);
  padding: 0;
  background: color-mix(in oklab, var(--background-100) 70%, transparent);
  color: var(--text-primary);
  font: inherit;
  cursor: pointer;
  transition: transform var(--transition-fast) ease, background var(--transition-fast) ease, border-color var(--transition-fast) ease;

  svg {
    display: block;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

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

export const AppearanceRoot = styled.div`
  position: relative;
  display: none;

  @media (min-width: ${BREAKPOINT}) { display: block; }
`

export const AppearanceTrigger = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 88px;
  min-height: 36px;
  padding: 0 11px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 25%, var(--normal-300) 75%);
  border-radius: 999px;
  background: color-mix(in oklab, var(--background-100) 88%, transparent);
  color: var(--text-primary);
  box-shadow: inset 0 1px color-mix(in oklab, white 45%, transparent);
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform 180ms ease-out, background-color 180ms ease-out, border-color 180ms ease-out, box-shadow 180ms ease-out;

  &:hover {
    transform: translateY(-1px);
    border-color: color-mix(in oklab, var(--primary-color) 48%, var(--normal-300) 52%);
    background: color-mix(in oklab, var(--primary-color) 8%, var(--background-100) 92%);
    box-shadow: 0 6px 16px color-mix(in oklab, var(--primary-color) 12%, transparent);
  }

  &:active { transform: translateY(0); box-shadow: none; }
  &:focus-visible { outline: 2px solid color-mix(in oklab, var(--primary-color) 72%, white); outline-offset: 3px; }

  @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }
`

export const DesktopAppearancePopover = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 70;
  width: 292px;
  padding: 16px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 58%, transparent);
  border-radius: 20px;
  background: color-mix(in oklab, var(--background-100) 97%, transparent);
  box-shadow: 0 20px 45px color-mix(in oklab, var(--normal-900) 14%, transparent), inset 0 1px color-mix(in oklab, white 50%, transparent);
  backdrop-filter: blur(18px);
  animation: appearance-enter 200ms ease-out;

  @keyframes appearance-enter {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) { animation: none; }
`

export const AppearanceHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 17px;
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 700;

  small { color: var(--text-secondary); font-family: var(--font-sans); font-size: 11px; font-weight: 500; }
`

export const AppearanceGroup = styled.div`
  & + & { margin-top: 17px; padding-top: 16px; border-top: 1px solid color-mix(in oklab, var(--normal-300) 48%, transparent); }
`

export const AppearanceLabel = styled.div`
  margin-bottom: 9px;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
`

export const ThemeSwatches = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
`

export const ThemeSwatch = styled.button<{ $family: 'wine' | 'plain' }>`
  appearance: none;
  position: relative;
  display: grid;
  gap: 7px;
  min-height: 80px;
  padding: 7px;
  border: 1px solid ${({ $family }) => $family === 'wine' ? 'color-mix(in oklab, var(--primary-color) 22%, var(--normal-300) 78%)' : 'color-mix(in oklab, var(--normal-400) 45%, transparent)'};
  border-radius: 13px;
  background: color-mix(in oklab, var(--background-200) 78%, transparent);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  text-align: left;
  cursor: pointer;

  &[aria-pressed='true'] { border-color: var(--primary-color); box-shadow: 0 0 0 2px color-mix(in oklab, var(--primary-color) 14%, transparent); }
  &:focus-visible { outline: 2px solid color-mix(in oklab, var(--primary-color) 72%, white); outline-offset: 2px; }
`

export const SwatchPreview = styled.span`
  display: block;
  height: 39px;
  border-radius: 8px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 45%, transparent);
  background: linear-gradient(135deg, var(--primary-color) 0 48%, var(--background-color) 48% 100%);
`

export const SelectionMark = styled.span`
  position: absolute;
  top: 11px;
  right: 11px;
  display: none;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--background-100);
  color: var(--primary-color);
  font-size: 11px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 18%);

  [aria-pressed='true'] & { display: grid; }
`

export const SchemeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px;
  padding: 4px;
  border-radius: 12px;
  background: color-mix(in oklab, var(--background-200) 82%, transparent);
`

export const SchemeOption = styled.button`
  appearance: none;
  min-height: 38px;
  padding: 0 7px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--text-secondary);
  font: inherit;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;

  &[aria-pressed='true'] { border-color: color-mix(in oklab, var(--primary-color) 26%, transparent); background: var(--primary-color); color: var(--background-100); box-shadow: 0 4px 10px color-mix(in oklab, var(--primary-color) 20%, transparent); }
  &:focus-visible { outline: 2px solid color-mix(in oklab, var(--primary-color) 72%, white); outline-offset: 2px; }
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

export const ThemeChevron = styled.span<{ $open?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0')});
  transition: transform 180ms ease-out;

  @media (prefers-reduced-motion: reduce) { transition: none; }
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

export const MobileAppearanceAction = styled.button`
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

export const MobileAppearanceOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgb(18 10 12 / 44%);
  backdrop-filter: blur(3px);
  animation: overlay-enter 200ms ease-out;

  @keyframes overlay-enter { from { opacity: 0; } to { opacity: 1; } }
  @media (min-width: ${BREAKPOINT}) { display: none; }
  @media (prefers-reduced-motion: reduce) { animation: none; }
`

export const MobileAppearanceSheet = styled.div`
  width: 100%;
  max-height: 80dvh;
  overflow-y: auto;
  padding: 10px 18px calc(22px + env(safe-area-inset-bottom));
  border: 1px solid color-mix(in oklab, var(--normal-300) 58%, transparent);
  border-bottom: 0;
  border-radius: 22px 22px 0 0;
  background: color-mix(in oklab, var(--background-100) 98%, transparent);
  color: var(--text-primary);
  box-shadow: 0 -24px 60px rgb(0 0 0 / 22%);
  overscroll-behavior: contain;
  animation: sheet-enter 220ms ease-out;

  @keyframes sheet-enter {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) { animation: none; }
`

export const SheetHandle = styled.div`
  width: 42px;
  height: 4px;
  margin: 0 auto 15px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--normal-500) 45%, transparent);
`

export const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 21px;
`

export const SheetTitle = styled.h2`
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-serif);
  font-size: 21px;
  line-height: 1.3;
`

export const SheetCurrent = styled.p`
  margin: 3px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
`

export const SheetClose = styled.button`
  appearance: none;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border: 1px solid color-mix(in oklab, var(--normal-300) 60%, transparent);
  border-radius: 50%;
  background: color-mix(in oklab, var(--background-200) 80%, transparent);
  color: var(--text-primary);
  font: 300 25px/1 var(--font-sans);
  cursor: pointer;

  &:focus-visible { outline: 2px solid color-mix(in oklab, var(--primary-color) 72%, white); outline-offset: 2px; }
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
