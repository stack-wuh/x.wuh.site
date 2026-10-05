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
 * en/ja 词典首次需要时才拉取（首屏纪律：默认中文用户零增量）。
 * 各语言独立槽位，晚到的加载只填自己的槽，互不覆盖。
 * 缓存放模块级而非组件级：预取与多个 LocaleProvider 实例（脱离主树的 message portal
 * 须自包一层）因此共用一次加载。
 */
const DICT_LOADERS: Record<Exclude<Locale, 'zh'>, () => Promise<{ default: DeepPartial<Dict> }>> = {
  en: () => import('./dictionaries/en'),
  ja: () => import('./dictionaries/ja'),
}

const dictCache: TranslateDicts = { zh }
const dictPending = new Map<Exclude<Locale, 'zh'>, Promise<void>>()

/**
 * 词典加载的单一入口：resolve 即「该语言词典已在缓存内、可作渲染输入」。
 * zh 静态导入恒在手，同步 resolve。失败让 Promise 拒绝（回落语义由调用方决定），
 * 并清掉 in-flight 记录，使下一次调用可以重试。
 */
function ensureDict(target: Locale): Promise<void> {
  const slot = target as Exclude<Locale, 'zh'>
  const loader = DICT_LOADERS[slot]
  if (!loader || dictCache[slot]) return Promise.resolve()
  const pending = dictPending.get(slot)
  if (pending) return pending
  const task = loader().then(
    (mod) => {
      dictPending.delete(slot)
      if (mod?.default) dictCache[slot] = mod.default
    },
    (error) => {
      dictPending.delete(slot)
      throw error
    },
  )
  dictPending.set(slot, task)
  return task
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
 * 空闲预取 en+ja 词典 chunk：首屏零增量（预取只发生在挂载后的空闲档）。
 * 经 ensureDict 走单一入口——预取因此真正把词典填进缓存槽（而非只热模块缓存），
 * 之后切语言在微任务内即就绪，无需再等一次网络往返。失败静默：切换时按既有回落路径（zh）再拉。
 */
export function preloadDictionaries(): void {
  for (const target of Object.keys(DICT_LOADERS) as Array<Exclude<Locale, 'zh'>>) {
    ensureDict(target).catch(() => {})
  }
}

function applyDocumentLang(locale: Locale) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = LANG_BY_LOCALE[locale]
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh')
  // 词典必须是渲染输入：入库时换掉 state 快照，t 与 context identity 随之改变，消费者必然重渲染。
  // （存 ref 再靠一个不进 context value 的版本号自增来「强制重渲染」是空转：identity 未变、
  //   children 元素引用未变，React 把整棵子树 bail out，一个消费者都不会更新。）
  const [dicts, setDicts] = useState<TranslateDicts>({ zh })
  // 连点不同语言时，只让最后一次请求落地
  const requestIdRef = useRef(0)

  /**
   * 成套提交：词典快照 / locale / <html lang> / 持久化同一批落地，
   * 不允许出现「语言钮已切、界面文案未切」的半更新帧。
   */
  const commitLocale = useCallback((next: Locale) => {
    setDicts({ ...dictCache })
    setLocaleState(next)
    applyDocumentLang(next)
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {}
  }, [])

  /**
   * 就绪门控：词典到手才提交。点击是 discrete event，React 在事件尾部同步 flush，
   * 跑在 `import().then()` 的微任务之前——不门控则点击那一帧必然读到空槽、回落中文，
   * 且此后不再有任何一次重渲染来纠正它。
   * ensureDict 失败（离线、chunk 404）时照样提交，按既有回落链显示中文，不吞用户意图。
   */
  const setLocale = useCallback((next: Locale) => {
    const requestId = ++requestIdRef.current
    ensureDict(next)
      .catch(() => {})
      .then(() => {
        if (requestId !== requestIdRef.current) return
        commitLocale(next)
      })
  }, [commitLocale])

  const t = useCallback(
    (key: string, params?: TranslateParams) => translate(dicts, locale, key, params),
    [dicts, locale]
  )

  useEffect(() => {
    const stored = readStoredLocale()
    if (stored !== 'zh') {
      const requestId = ++requestIdRef.current
      ensureDict(stored)
        .catch(() => {})
        .then(() => {
          if (requestId === requestIdRef.current) commitLocale(stored)
        })
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
  }, [commitLocale])

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
