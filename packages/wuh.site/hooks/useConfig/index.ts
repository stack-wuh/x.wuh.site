import { createContext, useContext, useEffect } from 'react'
import { useReactive, useCookieState } from 'ahooks'

type languages = 'zh-cn' | 'en' | null
type themes = 'light' | 'dark' | null
export interface configInterfaceProps {
  key?: string
  themeMode: themes
  language: languages
  header: {
    title: string
  }
  footer: {
    prefixTitle: string
    mainTitle: string
    suffixTitle: string
    copyright: string
    domain: string
  }
  pager: {
    nextText: string
    disableNextText: string
  }
  popupLabels: string[]
  pagesConfig: {
    prefix: string
    suffix: string
  }
  external: {
    icons: string[]
    fonts: string[]
  }
  stateLocale: {
    options: {
      expires: Date
      path: string
      domain: string
      secure: boolean
      sameSite: any
    }
  }
  toggleThemeMode?: () => void
  toggleLang?: () => void
}
const ConfigProvider = createContext<configInterfaceProps | any>(null)

export { ConfigProvider }

const getTarget = () => document.querySelector('html')

export default function useConfig() {
  const config = useContext(ConfigProvider)
  const state = useReactive<configInterfaceProps | any>(config)
  const [_, setThemeMode] = useCookieState(
    'data-theme-mode',
    config.stateLocale.options
  )
  const [__, setLang] = useCookieState('lang', config.stateLocale.options)

  useEffect(() => {
    state.themeMode = getTarget()?.getAttribute('data-theme-mode')
    state.language = getTarget()?.getAttribute('lang')
  }, [])

  /** 切换文档主题 */
  const toggleThemeMode = () => {
    state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
    getTarget()?.setAttribute('data-theme-mode', state.themeMode)
    setThemeMode(state.themeMode)
  }
  /** 切换文档语言 */
  const toggleLang = () => {
    state.language = state.language === 'zh-cn' ? 'en' : 'zh-cn'
    getTarget()?.setAttribute('lang', state.language)
    setLang(state.language)
  }

  const actions = {
    toggleThemeMode,
    toggleLang,
  }

  return {
    ...state,
    ...actions,
  }
}
