'use client'

import type { ThemeFamily } from '@wuh.site/components/themes/tokens'
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
 */
const THEME_OPTIONS: Array<{ value: ThemeFamily; label: string; paper: string; ink: string; line: string }> = [
  {
    value: 'wine',
    label: '酒红',
    paper: 'var(--_wl-background-900)',
    ink: 'var(--_wl-normal-900)',
    line: 'var(--_wl-primary-500)',
  },
  {
    value: 'plain',
    label: '素雅',
    paper: 'var(--_pl-background-900)',
    ink: 'var(--_pl-normal-900)',
    line: 'var(--_pl-primary-600)',
  },
]

const SCHEME_OPTIONS: Array<{ value: ColorSchemeMode; label: string }> = [
  { value: 'system', label: '跟随系统' },
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
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
  return (
    <>
      <S.AppearanceGroup aria-label='主题风格'>
        <S.AppearanceLabel>主题</S.AppearanceLabel>
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
              <S.SwatchLabel>{option.label}</S.SwatchLabel>
            </S.ThemeSwatch>
          ))}
        </S.ThemeSwatches>
      </S.AppearanceGroup>

      <S.AppearanceGroup aria-label='显示模式'>
        <S.AppearanceLabel>明暗</S.AppearanceLabel>
        <S.SchemeOptions>
          {SCHEME_OPTIONS.map((option) => (
            <S.SchemeOption
              key={option.value}
              type='button'
              aria-pressed={colorSchemeMode === option.value}
              onClick={() => onColorSchemeModeChange(option.value)}
            >
              {option.label}
            </S.SchemeOption>
          ))}
        </S.SchemeOptions>
      </S.AppearanceGroup>
    </>
  )
}
