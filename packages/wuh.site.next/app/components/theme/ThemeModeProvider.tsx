'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ThemeFamily, ColorScheme } from '@wuh.site/components/themes/tokens'

export type Theme = `${ThemeFamily}-${ColorScheme}`

type ThemeContextValue = {
  theme: Theme
  toggle: () => void
}

const STORAGE_KEY = 'wuh.site.theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_CYCLE: Theme[] = ['wine-light', 'wine-dark', 'plain-light', 'plain-dark']

function isValidTheme(value: unknown): value is Theme {
  return THEME_CYCLE.includes(value as Theme)
}

function parseTheme(raw: unknown): Theme {
  return isValidTheme(raw) ? raw : 'wine-light'
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const [family, scheme] = theme.split('-') as [ThemeFamily, ColorScheme]
  document.documentElement.dataset.themeFamily = family
  document.documentElement.dataset.colorScheme = scheme
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('wine-light')

  useEffect(() => {
    let stored: Theme | null = null
    try {
      stored = parseTheme(window.localStorage.getItem(STORAGE_KEY))
    } catch {}
    const resolved = stored ?? 'wine-light'
    setThemeState(resolved)
    applyTheme(resolved)
  }, [])

  useEffect(() => {
    applyTheme(theme)
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
