'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useEventListener } from '@wuh.site/hooks/useEventListener'
import { readStorage, writeStorage } from '@wuh.site/hooks/useLocalStorageState'
import type { ThemeFamily, ColorScheme } from '@wuh.site/components/themes/tokens'
import {
  COLOR_SCHEME_MODE_VALUES,
  COLOR_SCHEME_STORAGE_KEY,
  THEME_FAMILY_VALUES,
  THEME_STORAGE_KEY,
} from '@wuh.site/components/themes/themeStorage'

export type Theme = ThemeFamily
export type ColorSchemeMode = 'system' | ColorScheme

type ThemeContextValue = {
  themeFamily: ThemeFamily
  colorSchemeMode: ColorSchemeMode
  resolvedColorScheme: ColorScheme
  setThemeFamily: (family: ThemeFamily) => void
  setColorSchemeMode: (mode: ColorSchemeMode) => void
}

// 持久化 key 与取值集合定义见 @wuh.site/components/themes/themeStorage（与 SSR anti-FOUC 脚本共享，单一来源）
const ThemeContext = createContext<ThemeContextValue | null>(null)

function isValidTheme(value: unknown): value is ThemeFamily {
  return typeof value === 'string' && (THEME_FAMILY_VALUES as readonly unknown[]).includes(value)
}

function parseTheme(value: unknown): ThemeFamily {
  return isValidTheme(value) ? value : 'wine'
}

function isValidColorSchemeMode(value: unknown): value is ColorSchemeMode {
  return typeof value === 'string' && (COLOR_SCHEME_MODE_VALUES as readonly unknown[]).includes(value)
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
    // 静默读（SSR/抛异常归 undefined）→ parse 回落默认值，与原 try/catch+null 语义等价
    const nextTheme = parseTheme(readStorage(THEME_STORAGE_KEY))
    const nextMode = parseColorSchemeMode(readStorage(COLOR_SCHEME_STORAGE_KEY))
    const nextScheme = nextMode === 'system' ? getSystemColorScheme() : nextMode

    setThemeFamilyState(nextTheme)
    setColorSchemeModeState(nextMode)
    setResolvedColorScheme(nextScheme)
    applyThemeFamily(nextTheme)
    applyColorScheme(nextScheme)
  }, [])

  // 系统深浅色跟随：只在 change 事件上应用（挂载时不触发，初始值由上方存储恢复决定）。
  // handler 经 hook 取最新闭包，colorSchemeMode 切换无需重绑监听
  const darkSchemeQuery = useMemo(
    () => (typeof window === 'undefined' || typeof window.matchMedia !== 'function' ? null : window.matchMedia('(prefers-color-scheme: dark)')),
    []
  )

  useEventListener(
    'change',
    (event: MediaQueryListEvent) => {
      if (colorSchemeMode === 'system') {
        const nextScheme: ColorScheme = event.matches ? 'dark' : 'light'
        setResolvedColorScheme(nextScheme)
        applyColorScheme(nextScheme)
      }
    },
    darkSchemeQuery,
    { enabled: darkSchemeQuery !== null }
  )

  const setThemeFamily = useCallback((family: ThemeFamily) => {
    setThemeFamilyState(family)
    applyThemeFamily(family)
    writeStorage(THEME_STORAGE_KEY, family)
  }, [])

  const setColorSchemeMode = useCallback((mode: ColorSchemeMode) => {
    const nextScheme = mode === 'system' ? getSystemColorScheme() : mode
    setColorSchemeModeState(mode)
    setResolvedColorScheme(nextScheme)
    applyColorScheme(nextScheme)
    writeStorage(COLOR_SCHEME_STORAGE_KEY, mode)
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
