'use client'

import { IconLogo } from '@wuh.site/components/icons'
import { useLocale } from '@wuh.site/components/locales'
import * as S from '../styles'

/**
 * Hero 区块：纯展示（logo + 站点标题 + 标语），无交互。
 * 文案随当前 locale（home.hero*）。
 */
export default function HeroSection() {
  const { t } = useLocale()
  return (
    <S.Hero>
      <IconLogo width={64} height={38.4} />
      <S.SiteTitle>wuh.site&nbsp;&middot;&nbsp;{t('home.heroTitle')}</S.SiteTitle>
      <S.SiteTagline>{t('home.heroTagline')}</S.SiteTagline>
    </S.Hero>
  )
}
