import * as React from 'react'
import { Row, Column, SpaceBetween } from '@wuh.site/components/flex'
import { IconLogo } from '@wuh.site/components/icons'
import { SiteStats } from './site-stats'
import { StyledFooter } from './styles'
import { footerConf } from './specs'

const Footer = () => {
  return (
    <StyledFooter>
      <SpaceBetween className="footer-inner" gap={20}>
        <Row className="footer-row" gap={'3xl'}>
          <Column className="footer-col">
            <IconLogo width={100} height={60} />
          </Column>
          <Column className="footer-col">
            <div>{footerConf.slogan}</div>
            <div>{footerConf.copyright}</div>
            <SiteStats />
          </Column>
        </Row>
        <Row className="footer-row" gap={'3xl'}>
          <Column className="footer-col">
            <div>{footerConf.title}</div>
            <div>{footerConf.marked}</div>
            <div><a href="https://wuh.site/api/rss.xml" target="_blank" rel="noopener noreferrer">RSS 订阅</a></div>
          </Column>
          <Column className="footer-col">
            <div>{footerConf.MIIT}</div>
            <div>{footerConf.MoPSF}</div>
          </Column>
        </Row>
      </SpaceBetween>
    </StyledFooter>
  )
}

export default Footer
