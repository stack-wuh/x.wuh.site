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

const THEME_OPTIONS: Array<{ value: ThemeFamily; label: string; preview: string }> = [
  {
    value: 'wine',
    label: '酒红',
    preview: 'linear-gradient(135deg, #C94A44 0 48%, #FFFBF8 48% 100%)',
  },
  {
    value: 'plain',
    label: '素雅',
    preview: 'linear-gradient(135deg, #C89060 0 48%, #FFFDF9 48% 100%)',
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
        <S.AppearanceLabel>主题风格</S.AppearanceLabel>
        <S.ThemeSwatches>
          {THEME_OPTIONS.map((option) => (
            <S.ThemeSwatch
              key={option.value}
              type='button'
              $family={option.value}
              aria-pressed={themeFamily === option.value}
              onClick={() => onThemeFamilyChange(option.value)}
            >
              <S.SwatchPreview $background={option.preview} aria-hidden='true' />
              <span>{option.label}</span>
              <S.SelectionMark aria-hidden='true'>✓</S.SelectionMark>
            </S.ThemeSwatch>
          ))}
        </S.ThemeSwatches>
      </S.AppearanceGroup>

      <S.AppearanceGroup aria-label='显示模式'>
        <S.AppearanceLabel>显示模式</S.AppearanceLabel>
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
