'use client'

import { useEffect } from 'react'
import type { ThemeFamily } from '@wuh.site/components/themes/tokens'
import { preloadDictionaries, useLocale, type Locale } from '@wuh.site/components/locales'
import type { ColorSchemeMode } from '../theme/ThemeModeProvider'
import * as S from './styles'

interface AppearanceOptionsProps {
  themeFamily: ThemeFamily
  colorSchemeMode: ColorSchemeMode
  onThemeFamilyChange: (family: ThemeFamily) => void
  onColorSchemeModeChange: (mode: ColorSchemeMode) => void
}

/**
 * 主题选择控件（试笔墨签）。
 * 样本色值引用 Layer 1 原始调色板变量（--_wl-* / --_pl-*）：它们恒定挂在 :root、
 * 不随当前主题路由——预览展示的永远是样本自己的纸墨，与"当前生效的主题"无关。
 * label 不进静态表：渲染时随 locale 从词典取（site.appearance.*）。
 */
const THEME_OPTIONS: Array<{ value: ThemeFamily; labelKey: string; paper: string; ink: string; line: string }> = [
  {
    value: 'wine',
    labelKey: 'site.appearance.wine',
    paper: 'var(--_wl-background-900)',
    ink: 'var(--_wl-normal-900)',
    line: 'var(--_wl-primary-500)',
  },
  {
    value: 'plain',
    labelKey: 'site.appearance.plain',
    paper: 'var(--_pl-background-900)',
    ink: 'var(--_pl-normal-900)',
    line: 'var(--_pl-primary-600)',
  },
]

const SCHEME_OPTIONS: Array<{ value: ColorSchemeMode; labelKey: string }> = [
  { value: 'system', labelKey: 'site.appearance.system' },
  { value: 'light', labelKey: 'site.appearance.light' },
  { value: 'dark', labelKey: 'site.appearance.dark' },
]

/** 界面语言三选平铺（中｜英｜日直选）；自称名为跨语言不变量，不进词典。 */
const LANGUAGE_OPTIONS: Array<{ value: Locale; label: string }> = [
  { value: 'zh', label: '中' },
  { value: 'en', label: '英' },
  { value: 'ja', label: '日' },
]

/**
 * 共享桌面与移动端的主题风格和显示模式选择控件。
 */
export default function AppearanceOptions({
  themeFamily,
  colorSchemeMode,
  onThemeFamilyChange,
  onColorSchemeModeChange,
}: AppearanceOptionsProps) {
  const { locale, setLocale, t } = useLocale()

  // 弹层打开 = 用户已表达语言/主题意图：兜底预取词典 chunk，切语言近乎即时
  useEffect(() => {
    preloadDictionaries()
  }, [])

  return (
    <>
      <S.AppearanceGroup aria-label={t('site.appearance.themeGroup')}>
        <S.AppearanceLabel>{t('site.appearance.themeLabel')}</S.AppearanceLabel>
        <S.ThemeSwatches>
          {THEME_OPTIONS.map((option) => (
            <S.ThemeSwatch
              key={option.value}
              type='button'
              aria-pressed={themeFamily === option.value}
              onClick={() => onThemeFamilyChange(option.value)}
            >
              <S.InkSample $paper={option.paper} $ink={option.ink} $line={option.line} aria-hidden='true'>
                <span>念</span>
                <span className='ink-rule' />
              </S.InkSample>
              <S.SwatchLabel>{t(option.labelKey)}</S.SwatchLabel>
            </S.ThemeSwatch>
          ))}
        </S.ThemeSwatches>
      </S.AppearanceGroup>

      <S.AppearanceGroup aria-label={t('site.appearance.schemeGroup')}>
        <S.AppearanceLabel>{t('site.appearance.schemeLabel')}</S.AppearanceLabel>
        <S.SchemeOptions>
          {SCHEME_OPTIONS.map((option) => (
            <S.SchemeOption
              key={option.value}
              type='button'
              aria-pressed={colorSchemeMode === option.value}
              onClick={() => onColorSchemeModeChange(option.value)}
            >
              {t(option.labelKey)}
            </S.SchemeOption>
          ))}
        </S.SchemeOptions>
      </S.AppearanceGroup>

      <S.AppearanceGroup aria-label={t('site.appearance.languageGroup')}>
        <S.AppearanceLabel>{t('site.appearance.languageLabel')}</S.AppearanceLabel>
        <S.LanguageOptions>
          {LANGUAGE_OPTIONS.map((option) => (
            <S.LanguageOption
              key={option.value}
              type='button'
              aria-pressed={locale === option.value}
              onClick={() => setLocale(option.value)}
            >
              {option.label}
            </S.LanguageOption>
          ))}
        </S.LanguageOptions>
      </S.AppearanceGroup>
    </>
  )
}
