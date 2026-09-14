import * as React from 'react'
import Divider from '@wuh.site/components/divider'
import { IconLogo } from '@wuh.site/components/icons'
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
  return (
    <StyledFooter>
      <div className="footer-inner">
        <Divider variant="ornament" className="footer-ornament">
          <span className="footer-logo">
            <IconLogo width={84} height={42} />
          </span>
        </Divider>

        <p className="footer-slogan">{footerConf.slogan}</p>

        <nav className="footer-nav" aria-label="页脚导航">
          {footerConf.navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
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
          <div>
            © {copyrightYears()} {footerConf.author}. ·{' '}
            <a className="footer-license" href={footerConf.licenseHref} target="_blank" rel="noopener noreferrer">
              {footerConf.license}
            </a>
          </div>
          <div className="footer-tech">由 {footerConf.techStack.join(' · ')} 强力驱动</div>
        </div>

        <SiteStats />
      </div>
    </StyledFooter>
  )
}

export default Footer
