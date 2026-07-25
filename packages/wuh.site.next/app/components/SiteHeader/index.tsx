'use client'

import { useCallback, useEffect, useId, useRef, useState, type TouchEvent } from 'react'
import { IconBars, IconChevronDown, IconLogo, IconPalette } from '@wuh.site/components/icons'
import { useThemeMode, type ColorSchemeMode } from '../theme/ThemeModeProvider'
import type { ThemeFamily } from '@wuh.site/components/themes/tokens'
import * as S from './styles'

const THEME_OPTIONS: Array<{ value: ThemeFamily; label: string }> = [
  { value: 'wine', label: '酒红' },
  { value: 'plain', label: '素雅' },
]

const SCHEME_OPTIONS: Array<{ value: ColorSchemeMode; label: string }> = [
  { value: 'system', label: '跟随系统' },
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
]

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
  const appearanceRef = useRef<HTMLDivElement>(null)
  const appearanceTriggerRef = useRef<HTMLButtonElement>(null)
  const mobileAppearanceTriggerRef = useRef<HTMLButtonElement>(null)
  const touchStartYRef = useRef<number | null>(null)
  const [open, setOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [mobileAppearanceOpen, setMobileAppearanceOpen] = useState(false)
  const {
    themeFamily,
    colorSchemeMode,
    setThemeFamily,
    setColorSchemeMode,
  } = useThemeMode()

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((value) => !value), [])
  const closeAppearance = useCallback((restoreFocus = false) => {
    setAppearanceOpen(false)
    if (restoreFocus) appearanceTriggerRef.current?.focus()
  }, [])
  const closeMobileAppearance = useCallback((restoreFocus = true) => {
    setMobileAppearanceOpen(false)
    if (restoreFocus) window.requestAnimationFrame(() => mobileAppearanceTriggerRef.current?.focus())
  }, [])
  const openMobileAppearance = useCallback(() => {
    close()
    setMobileAppearanceOpen(true)
  }, [close])

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

  useEffect(() => {
    if (!mobileAppearanceOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMobileAppearance()
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) closeMobileAppearance(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [mobileAppearanceOpen, closeMobileAppearance])

  const onSheetTouchStart = useCallback((event: TouchEvent) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }, [])

  const onSheetTouchEnd = useCallback((event: TouchEvent) => {
    const startY = touchStartYRef.current
    const endY = event.changedTouches[0]?.clientY
    touchStartYRef.current = null
    if (startY !== null && endY !== undefined && endY - startY > 72) closeMobileAppearance()
  }, [closeMobileAppearance])

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

                <S.AppearanceGroup aria-label='主题风格'>
                  <S.AppearanceLabel>主题风格</S.AppearanceLabel>
                  <S.ThemeSwatches>
                    {THEME_OPTIONS.map((option) => (
                      <S.ThemeSwatch
                        key={option.value}
                        type='button'
                        $family={option.value}
                        aria-pressed={themeFamily === option.value}
                        onClick={() => setThemeFamily(option.value)}
                      >
                        <S.SwatchPreview aria-hidden='true' />
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
                        onClick={() => setColorSchemeMode(option.value)}
                      >
                        {option.label}
                      </S.SchemeOption>
                    ))}
                  </S.SchemeOptions>
                </S.AppearanceGroup>
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
              ref={mobileAppearanceTriggerRef}
              type='button'
              onClick={openMobileAppearance}
              aria-haspopup='dialog'
              aria-expanded={mobileAppearanceOpen}
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
              <S.ThemeChevron aria-hidden='true'>
                <IconChevronDown size={16} strokeWidth={2} />
              </S.ThemeChevron>
            </S.MobileAppearanceAction>
          </S.MobileActions>
        </S.MobileNav>
      </S.MobilePanel>

      {mobileAppearanceOpen && (
        <S.MobileAppearanceOverlay onClick={closeMobileAppearance}>
          <S.MobileAppearanceSheet
            role='dialog'
            aria-modal='true'
            aria-label='外观设置'
            onClick={(event) => event.stopPropagation()}
            onTouchStart={onSheetTouchStart}
            onTouchEnd={onSheetTouchEnd}
          >
            <S.SheetHandle aria-hidden='true' />
            <S.SheetHeader>
              <div>
                <S.SheetTitle>外观设置</S.SheetTitle>
                <S.SheetCurrent>{THEME_LABELS[themeFamily]} · {SCHEME_LABELS[colorSchemeMode]}</S.SheetCurrent>
              </div>
              <S.SheetClose type='button' onClick={closeMobileAppearance} aria-label='关闭外观设置'>×</S.SheetClose>
            </S.SheetHeader>

            <S.AppearanceGroup aria-label='主题风格'>
              <S.AppearanceLabel>主题风格</S.AppearanceLabel>
              <S.ThemeSwatches>
                {THEME_OPTIONS.map((option) => (
                  <S.ThemeSwatch
                    key={option.value}
                    type='button'
                    $family={option.value}
                    aria-pressed={themeFamily === option.value}
                    onClick={() => setThemeFamily(option.value)}
                  >
                    <S.SwatchPreview aria-hidden='true' />
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
                    onClick={() => setColorSchemeMode(option.value)}
                  >
                    {option.label}
                  </S.SchemeOption>
                ))}
              </S.SchemeOptions>
            </S.AppearanceGroup>
          </S.MobileAppearanceSheet>
        </S.MobileAppearanceOverlay>
      )}
    </S.HeaderRoot>
  )
}
