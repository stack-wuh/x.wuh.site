'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ThemeFamily, ColorScheme } from '@wuh.site/components/themes/tokens'

export type Theme = ThemeFamily
export type ColorSchemeMode = 'system' | ColorScheme

type ThemeContextValue = {
  themeFamily: ThemeFamily
  colorSchemeMode: ColorSchemeMode
  resolvedColorScheme: ColorScheme
  setThemeFamily: (family: ThemeFamily) => void
  setColorSchemeMode: (mode: ColorSchemeMode) => void
}

const THEME_STORAGE_KEY = 'wuh.site.theme'
const COLOR_SCHEME_STORAGE_KEY = 'wuh.site.color-scheme-mode'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function isValidTheme(value: unknown): value is ThemeFamily {
  return value === 'wine' || value === 'plain'
}

function parseTheme(value: unknown): ThemeFamily {
  return isValidTheme(value) ? value : 'wine'
}

function isValidColorSchemeMode(value: unknown): value is ColorSchemeMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

function parseColorSchemeMode(value: unknown): ColorSchemeMode {
  return isValidColorSchemeMode(value) ? value : 'system'
}

function getSystemColorScheme(): ColorScheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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
  const [themeFamily, setThemeFamilyState] = useState<ThemeFamily>('wine')
  const [colorSchemeMode, setColorSchemeModeState] = useState<ColorSchemeMode>('system')
  const [resolvedColorScheme, setResolvedColorScheme] = useState<ColorScheme>('light')

  useEffect(() => {
    let storedTheme: unknown = null
    let storedMode: unknown = null
    try {
      storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
      storedMode = window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)
    } catch {}

    const nextTheme = parseTheme(storedTheme)
    const nextMode = parseColorSchemeMode(storedMode)
    const nextScheme = nextMode === 'system' ? getSystemColorScheme() : nextMode

    setThemeFamilyState(nextTheme)
    setColorSchemeModeState(nextMode)
    setResolvedColorScheme(nextScheme)
    applyThemeFamily(nextTheme)
    applyColorScheme(nextScheme)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemSchemeChange = (event: MediaQueryListEvent | MediaQueryList) => {
      if (colorSchemeMode === 'system') {
        const nextScheme: ColorScheme = event.matches ? 'dark' : 'light'
        setResolvedColorScheme(nextScheme)
        applyColorScheme(nextScheme)
      }
    }

    mediaQuery.addEventListener('change', onSystemSchemeChange)
    return () => mediaQuery.removeEventListener('change', onSystemSchemeChange)
  }, [colorSchemeMode])

  const setThemeFamily = useCallback((family: ThemeFamily) => {
    setThemeFamilyState(family)
    applyThemeFamily(family)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, family)
    } catch {}
  }, [])

  const setColorSchemeMode = useCallback((mode: ColorSchemeMode) => {
    const nextScheme = mode === 'system' ? getSystemColorScheme() : mode
    setColorSchemeModeState(mode)
    setResolvedColorScheme(nextScheme)
    applyColorScheme(nextScheme)
    try {
      window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, mode)
    } catch {}
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({
    themeFamily,
    colorSchemeMode,
    resolvedColorScheme,
    setThemeFamily,
    setColorSchemeMode,
  }), [themeFamily, colorSchemeMode, resolvedColorScheme, setThemeFamily, setColorSchemeMode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider')
  }
  return context
}
