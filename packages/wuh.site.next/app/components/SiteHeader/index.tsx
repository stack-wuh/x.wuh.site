'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import Image from '@wuh.site/components/image'
import { IconBars } from '@wuh.site/components/icons'
import { useThemeMode, type Theme } from '../theme/ThemeModeProvider'

const THEME_LABELS: Record<Theme, string> = {
  'wine-light': '酒红明亮',
  'wine-dark': '酒红暗黑',
  'plain-light': '素雅明亮',
  'plain-dark': '素雅暗黑',
}
import * as S from './styles'

/**
 * 站点顶部导航栏，支持桌面端和移动端布局，具有主题切换功能。
 * 移动端通过汉堡菜单展开/收起面板，按 Escape 关闭。
 */
export default function SiteHeader() {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const { theme, toggle: toggleTheme } = useThemeMode()

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((v) => !v), [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  return (
    <S.HeaderRoot>
      <S.HeaderInner>
        <S.Brand aria-label='站点标识'>
          <Image src='/logo.svg' alt='wuh.site' width={42} height={26} priority inline showSkeleton={false} appearance='plain' />
        </S.Brand>

        <S.Right>
          <S.Nav aria-label='主导航'>
            <S.NavLink href='/blog'>博客</S.NavLink>
            <S.NavLink href='/about'>关于</S.NavLink>
            <S.NavLink href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer'>
              知识库
            </S.NavLink>
          </S.Nav>

          <S.ThemeToggle type='button' onClick={toggleTheme} aria-label={`切换主题（当前：${THEME_LABELS[theme]}）`}>
            <S.ThemeDot aria-hidden='true' />
            <span>{THEME_LABELS[theme]}</span>
          </S.ThemeToggle>

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
            <S.MobileActionButton
              type='button'
              onClick={() => {
                toggleTheme()
                close()
              }}
            >
              <S.MobileThemeLabel>
                <S.ThemeDot aria-hidden='true' />
                <span>主题：{THEME_LABELS[theme]}</span>
              </S.MobileThemeLabel>
            </S.MobileActionButton>
          </S.MobileActions>
        </S.MobileNav>
      </S.MobilePanel>
    </S.HeaderRoot>
  )
}
