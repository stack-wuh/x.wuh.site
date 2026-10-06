'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { IconBars, IconChevronDown, IconLogo, IconPalette } from '@wuh.site/components/icons'
import { useLocale } from '@wuh.site/components/locales'
import { useThemeMode, type ColorSchemeMode } from '../theme/ThemeModeProvider'
import type { ThemeFamily } from '@wuh.site/components/themes/tokens'
import AppearanceOptions from './AppearanceOptions'
import * as S from './styles'

const THEME_LABEL_KEYS: Record<ThemeFamily, string> = {
  wine: 'site.appearance.wine',
  plain: 'site.appearance.plain',
}

const SCHEME_LABEL_KEYS: Record<ColorSchemeMode, string> = {
  system: 'site.appearance.system',
  light: 'site.appearance.light',
  dark: 'site.appearance.dark',
}

/**
 * 站点顶部导航栏，支持桌面外观选择和移动端折叠菜单。
 */
export default function SiteHeader() {
  const pathname = usePathname()
  const { t } = useLocale()
  // 当前页归段：博客详情页（/post/*）属于「博客」，与列表页共享常驻笔画
  const isBlog = pathname === '/blog' || pathname.startsWith('/post/')
  const isAbout = pathname === '/about'
  const isMusic = pathname === '/music'
  const isHome = pathname === '/'
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
  const themeLabel = t(THEME_LABEL_KEYS[themeFamily])
  const schemeLabel = t(SCHEME_LABEL_KEYS[colorSchemeMode])
  const appearanceTriggerAria = t('site.appearance.triggerAria', { theme: themeLabel, scheme: schemeLabel })

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
        <S.Brand aria-label={t('common.brand')}>
          <IconLogo width={42} height={26} />
        </S.Brand>

        <S.Right>
          <S.Nav aria-label={t('common.mainNav')}>
            <S.NavLink href='/blog' aria-current={isBlog ? 'page' : undefined}>{t('site.nav.blog')}</S.NavLink>
            <S.NavLink href='/music' aria-current={isMusic ? 'page' : undefined}>{t('site.nav.music')}</S.NavLink>
            <S.NavLink href='/about' aria-current={isAbout ? 'page' : undefined}>{t('site.nav.about')}</S.NavLink>
            <S.NavLink
              href='https://stack-wuh.github.io/blog/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label={t('site.nav.knowledgeAria')}
            >
              {t('site.nav.knowledge')}<S.ExternalMark aria-hidden='true'>↗</S.ExternalMark>
            </S.NavLink>
          </S.Nav>

          <S.AppearanceRoot ref={appearanceRef}>
            <S.AppearanceTrigger
              ref={appearanceTriggerRef}
              type='button'
              onClick={() => setAppearanceOpen((value) => !value)}
              aria-label={appearanceTriggerAria}
              aria-haspopup='dialog'
              aria-expanded={appearanceOpen}
              aria-controls={appearanceId}
              title={t('site.appearance.group')}
            >
              <S.ThemeSeal aria-hidden='true' $open={appearanceOpen}>墨</S.ThemeSeal>
            </S.AppearanceTrigger>

            {appearanceOpen && (
              <S.DesktopAppearancePopover id={appearanceId} role='dialog' aria-label={t('site.appearance.group')}>
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
            aria-label={open ? t('site.menu.close') : t('site.menu.open')}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
          >
            <IconBars />
          </S.MobileToggle>
        </S.Right>
      </S.HeaderInner>

      <S.MobilePanel id={panelId} $open={open}>
        <S.MobileNav aria-label={t('common.mobileNav')}>
          <S.MobileItem href='/' aria-current={isHome ? 'page' : undefined} onClick={close}>{t('site.nav.home')}</S.MobileItem>
          <S.MobileItem href='/blog' aria-current={isBlog ? 'page' : undefined} onClick={close}>{t('site.nav.blog')}</S.MobileItem>
          <S.MobileItem href='/music' aria-current={isMusic ? 'page' : undefined} onClick={close}>{t('site.nav.music')}</S.MobileItem>
          <S.MobileItem href='/about' aria-current={isAbout ? 'page' : undefined} onClick={close}>{t('site.nav.about')}</S.MobileItem>
          <S.MobileItem
            href='https://stack-wuh.github.io/blog/'
            target='_blank'
            rel='noopener noreferrer'
            aria-label={t('site.nav.knowledgeAria')}
            onClick={close}
          >
            {t('site.nav.knowledge')}<S.ExternalMark aria-hidden='true'>↗</S.ExternalMark>
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
                  <S.MobileThemeTitle>{t('site.appearance.group')}</S.MobileThemeTitle>
                  <S.MobileThemeCurrent>{themeLabel} · {schemeLabel}</S.MobileThemeCurrent>
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
