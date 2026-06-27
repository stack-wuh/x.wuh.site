'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ThemeFamily, ColorScheme } from '@wuh.site/components/themes/tokens'

export type Theme = ThemeFamily

type ThemeContextValue = {
  theme: Theme
  toggle: () => void
}

const STORAGE_KEY = 'wuh.site.theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_CYCLE: Theme[] = ['wine', 'plain']

function isValidTheme(value: unknown): value is Theme {
  return value === 'wine' || value === 'plain'
}

function parseTheme(raw: unknown): Theme {
  return isValidTheme(raw) ? raw : 'wine'
}

function applyColorScheme(scheme: ColorScheme) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.colorScheme = scheme
}

function applyThemeFamily(family: ThemeFamily) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.themeFamily = family
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('wine')

  useEffect(() => {
    let stored: Theme | null = null
    try {
      stored = parseTheme(window.localStorage.getItem(STORAGE_KEY))
    } catch {}
    const resolved = stored ?? 'wine'
    setThemeState(resolved)
    applyThemeFamily(resolved)

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemSchemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      applyColorScheme(e.matches ? 'dark' : 'light')
    }
    onSystemSchemeChange(mql)
    mql.addEventListener('change', onSystemSchemeChange)
    document.documentElement.removeAttribute('data-no-transition')
    return () => mql.removeEventListener('change', onSystemSchemeChange)
  }, [])

  useEffect(() => {
    applyThemeFamily(theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  const toggle = useCallback(() => {
    setThemeState((current) => {
      const idx = THEME_CYCLE.indexOf(current)
      return THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]
    })
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({ theme, toggle }), [theme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeModeProvider')
  }
  return ctx
}
