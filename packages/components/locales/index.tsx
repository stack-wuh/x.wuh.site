'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { translate, type TranslateDicts } from './translate'
import zh from './dictionaries/zh'
import type { DeepPartial, Dict } from './dictionaries/zh'

export type Locale = 'zh' | 'en' | 'ja'

export type { Dict, DeepPartial }

export type TranslateParams = Record<string, string | number>

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: TranslateParams) => string
}

/**
 * locale 持久化循主题先例（localStorage + 客户端读取）；
 * SSR html lang 恒为 zh-CN，客户端挂载后按已选语言同步。
 */
const LOCALE_STORAGE_KEY = 'wuh.site.locale'

const LANG_BY_LOCALE: Record<Locale, string> = {
  zh: 'zh-CN',
  en: 'en',
  ja: 'ja',
}

/**
 * en/ja 词典首次切换到该语言时才拉取（首屏纪律：默认中文用户零增量）。
 * 各语言独立缓存入库，晚到的加载只影响自己的槽位，无竞态。
 */
const DICT_LOADERS: Record<Exclude<Locale, 'zh'>, () => Promise<{ default: DeepPartial<Dict> }>> = {
  en: () => import('./dictionaries/en'),
  ja: () => import('./dictionaries/ja'),
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'zh'
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === 'en' || stored === 'ja') return stored
  } catch {}
  return 'zh'
}

/**
 * 空闲预取 en+ja 词典 chunk：首屏零增量（预取只发生在挂载后的空闲档），
 * chunk 有模块缓存，之后 loadDict 的 dynamic import 近乎同步，切语言即时生效。
 * 失败静默：切换时按既有回落路径（zh）再拉。
 */
export function preloadDictionaries(): void {
  for (const loader of Object.values(DICT_LOADERS)) {
    loader().catch(() => {})
  }
}

function applyDocumentLang(locale: Locale) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = LANG_BY_LOCALE[locale]
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh')
  const dictsRef = useRef<Record<Locale, unknown>>({ zh })
  const loadingRef = useRef(new Set<Exclude<Locale, 'zh'>>())
  // 词典晚到入库后强制重渲染，让 t() 读到新槽位
  const [, setDictVersion] = useState(0)
  const bumpDictVersion = useCallback(() => setDictVersion((version) => version + 1), [])

  const loadDict = useCallback((target: Locale) => {
    if (target === 'zh') return
    if (dictsRef.current[target] || loadingRef.current.has(target)) return
    loadingRef.current.add(target)
    DICT_LOADERS[target]().then((mod) => {
      dictsRef.current[target] = mod.default
      loadingRef.current.delete(target)
      bumpDictVersion()
    }).catch(() => {
      loadingRef.current.delete(target)
    })
  }, [])

  useEffect(() => {
    const stored = readStoredLocale()
    applyDocumentLang(stored)
    if (stored !== 'zh') {
      setLocaleState(stored)
      loadDict(stored)
    }
    // 空闲预取：requestIdleCallback 不可用（旧 Safari）退 setTimeout
    let cancelled = false
    const scheduleIdle = (cb: () => void): number =>
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(() => cb(), { timeout: 3000 })
        : window.setTimeout(cb, 1500)
    const handle = scheduleIdle(() => {
      if (!cancelled) preloadDictionaries()
    })
    return () => {
      cancelled = true
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [loadDict])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    applyDocumentLang(next)
    loadDict(next)
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {}
  }, [loadDict])

  const t = useCallback(
    (key: string, params?: TranslateParams) => translate(dictsRef.current as TranslateDicts, locale, key, params),
    [locale]
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}
