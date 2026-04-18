'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeMode = 'money' | 'plain'

type ThemeModeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const STORAGE_KEY = 'wuh.site.themeMode'

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

const normalizeMode = (value: unknown): ThemeMode | null => {
  if (value === 'money' || value === 'plain') return value
  return null
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('money')

  useEffect(() => {
    try {
      const stored = normalizeMode(window.localStorage.getItem(STORAGE_KEY))
      if (stored) {
        setModeState(stored)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = mode
    try {
      window.localStorage.setItem(STORAGE_KEY, mode)
    } catch {}
  }, [mode])

  const setMode = useCallback((next: ThemeMode) => setModeState(next), [])
  const toggleMode = useCallback(() => {
    setModeState((current) => (current === 'money' ? 'plain' : 'money'))
  }, [])

  const value = useMemo<ThemeModeContextValue>(() => ({ mode, setMode, toggleMode }), [mode, setMode, toggleMode])

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeModeProvider')
  }
  return ctx
}

