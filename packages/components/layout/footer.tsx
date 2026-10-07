'use client'

import * as React from 'react'
import Link from 'next/link'
import Divider from '@wuh.site/components/divider'
import { IconLogo } from '@wuh.site/components/icons'
import { useLocale } from '@wuh.site/components/locales'
import { SiteStats } from './site-stats'
import { StyledFooter } from './styles'
import { footerConf } from './specs'

/** 版权区间：建站年 → 当前年（同值显示单年），从 siteBorn 推导，无第二日期源 */
function copyrightYears(): string {
  const start = footerConf.siteBorn.getFullYear()
  const end = new Date().getFullYear()
  return start === end ? `${start}` : `${start}–${end}`
}

const Footer = () => {
  const { t } = useLocale()
  return (
    <StyledFooter>
      <div className="footer-inner">
        <Divider variant="ornament" className="footer-ornament">
          <span className="footer-logo">
            <IconLogo width={64} height={32} />
          </span>
        </Divider>

        <p className="footer-slogan">{footerConf.slogan}</p>

        <nav className="footer-nav" aria-label={t('site.footer.navAria')}>
          {footerConf.navItems.map((item) =>
            item.native ? (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="footer-beian">
          <a href={footerConf.icp.href} target="_blank" rel="noopener noreferrer">
            {footerConf.icp.label}
          </a>
          <a href={footerConf.police.href} target="_blank" rel="noopener noreferrer">
            {footerConf.police.label}
          </a>
        </div>

        <div className="footer-note">
          <span>© {copyrightYears()} {footerConf.author}.</span>
          <a className="footer-license" href={footerConf.licenseHref} target="_blank" rel="noopener noreferrer">
            {footerConf.license}
          </a>
          <span className="footer-note-tech">{t('site.footer.poweredBy', { stack: footerConf.techStack.join(' · ') })}</span>
        </div>

        <SiteStats />
      </div>
    </StyledFooter>
  )
}

export default Footer
