'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { IconBars, IconChevronDown, IconLogo, IconPalette } from '@wuh.site/components/icons'
import { useThemeMode, type ColorSchemeMode } from '../theme/ThemeModeProvider'
import type { ThemeFamily } from '@wuh.site/components/themes/tokens'
import AppearanceOptions from './AppearanceOptions'
import * as S from './styles'

const THEME_LABELS: Record<ThemeFamily, string> = {
  wine: '酒红',
  plain: '素雅',
}

const SCHEME_LABELS: Record<ColorSchemeMode, string> = {
  system: '跟随系统',
  light: '浅色',
  dark: '深色',
}

/**
 * 站点顶部导航栏，支持桌面外观选择和移动端折叠菜单。
 */
export default function SiteHeader() {
  const panelId = useId()
  const appearanceId = useId()
  const mobileAppearanceId = useId()
  const appearanceRef = useRef<HTMLDivElement>(null)
  const appearanceTriggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [mobileAppearanceExpanded, setMobileAppearanceExpanded] = useState(false)
  const {
    themeFamily,
    colorSchemeMode,
    setThemeFamily,
    setColorSchemeMode,
  } = useThemeMode()

  const close = useCallback(() => {
    setMobileAppearanceExpanded(false)
    setOpen(false)
  }, [])
  const toggle = useCallback(() => {
    setOpen((value) => {
      if (value) setMobileAppearanceExpanded(false)
      return !value
    })
  }, [])
  const closeAppearance = useCallback((restoreFocus = false) => {
    setAppearanceOpen(false)
    if (restoreFocus) appearanceTriggerRef.current?.focus()
  }, [])
  const toggleMobileAppearance = useCallback(() => {
    setMobileAppearanceExpanded((value) => !value)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  useEffect(() => {
    if (!appearanceOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!appearanceRef.current?.contains(event.target as Node)) closeAppearance()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAppearance(true)
    }

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [appearanceOpen, closeAppearance])

  return (
    <S.HeaderRoot>
      <S.HeaderInner>
        <S.Brand aria-label='站点标识'>
          <IconLogo width={42} height={26} />
        </S.Brand>

        <S.Right>
          <S.Nav aria-label='主导航'>
            <S.NavLink href='/blog'>博客</S.NavLink>
            <S.NavLink href='/about'>关于</S.NavLink>
            <S.NavLink href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer'>
              知识库
            </S.NavLink>
          </S.Nav>

          <S.AppearanceRoot ref={appearanceRef}>
            <S.AppearanceTrigger
              ref={appearanceTriggerRef}
              type='button'
              onClick={() => setAppearanceOpen((value) => !value)}
              aria-label={`外观设置，当前${THEME_LABELS[themeFamily]}、${SCHEME_LABELS[colorSchemeMode]}`}
              aria-haspopup='dialog'
              aria-expanded={appearanceOpen}
              aria-controls={appearanceId}
            >
              <S.ThemeIcon aria-hidden='true'>
                <IconPalette size={16} strokeWidth={2} />
              </S.ThemeIcon>
              <span>外观</span>
              <S.ThemeChevron $open={appearanceOpen} aria-hidden='true'>
                <IconChevronDown size={14} strokeWidth={2} />
              </S.ThemeChevron>
            </S.AppearanceTrigger>

            {appearanceOpen && (
              <S.DesktopAppearancePopover id={appearanceId} role='dialog' aria-label='外观设置'>
                <S.AppearanceHeading>
                  <span>外观设置</span>
                  <small>{THEME_LABELS[themeFamily]} · {SCHEME_LABELS[colorSchemeMode]}</small>
                </S.AppearanceHeading>

                <AppearanceOptions
                  themeFamily={themeFamily}
                  colorSchemeMode={colorSchemeMode}
                  onThemeFamilyChange={setThemeFamily}
                  onColorSchemeModeChange={setColorSchemeMode}
                />
              </S.DesktopAppearancePopover>
            )}
          </S.AppearanceRoot>

          <S.MobileToggle
            type='button'
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
          >
            <IconBars />
          </S.MobileToggle>
        </S.Right>
      </S.HeaderInner>

      <S.MobilePanel id={panelId} $open={open}>
        <S.MobileNav aria-label='移动端导航'>
          <S.MobileItem href='/' onClick={close}>首页</S.MobileItem>
          <S.MobileItem href='/blog' onClick={close}>博客</S.MobileItem>
          <S.MobileItem href='/about' onClick={close}>关于</S.MobileItem>
          <S.MobileItem href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer' onClick={close}>
            知识库
          </S.MobileItem>
          <S.MobileActions>
            <S.MobileAppearanceAction
              type='button'
              onClick={toggleMobileAppearance}
              aria-expanded={mobileAppearanceExpanded}
              aria-controls={mobileAppearanceId}
            >
              <S.MobileThemeMain>
                <S.ThemeIcon aria-hidden='true'>
                  <IconPalette size={18} strokeWidth={2} />
                </S.ThemeIcon>
                <S.MobileThemeCopy>
                  <S.MobileThemeTitle>外观设置</S.MobileThemeTitle>
                  <S.MobileThemeCurrent>{THEME_LABELS[themeFamily]} · {SCHEME_LABELS[colorSchemeMode]}</S.MobileThemeCurrent>
                </S.MobileThemeCopy>
              </S.MobileThemeMain>
              <S.ThemeChevron $open={mobileAppearanceExpanded} aria-hidden='true'>
                <IconChevronDown size={16} strokeWidth={2} />
              </S.ThemeChevron>
            </S.MobileAppearanceAction>
          </S.MobileActions>
          <S.MobileAppearanceOptions id={mobileAppearanceId} $expanded={mobileAppearanceExpanded}>
            <S.MobileAppearanceOptionsInner>
              <AppearanceOptions
                themeFamily={themeFamily}
                colorSchemeMode={colorSchemeMode}
                onThemeFamilyChange={setThemeFamily}
                onColorSchemeModeChange={setColorSchemeMode}
              />
            </S.MobileAppearanceOptionsInner>
          </S.MobileAppearanceOptions>
        </S.MobileNav>
      </S.MobilePanel>
    </S.HeaderRoot>
  )
}
