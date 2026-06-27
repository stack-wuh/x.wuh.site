import * as React from 'react'
import styled from 'styled-components'
import { Row, Column, SpaceBetween } from '@wuh.site/components/flex'
import { IconLogo } from '@wuh.site/components/icons'

const footerConf = {
  slogan: '驿寄梅花, 鱼传尺素',
  title: '你也想起舞吗',
  MIIT: '鄂ICP备20001814号-1',
  MoPSF: '粤公网安备44030002001803号',
  copyright: 'Copyright©2024 Shadow.',
  marked: '由next.js、mongodb和nest.js强力驱动',
}

const BREAKPOINT_MOBILE = '768px'

const StyledFooter = styled.div`
  padding: var(--space-xl) var(--space-2xl);
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  border-top: 1px solid color-mix(in oklab, var(--text-muted) 18%, transparent);

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    padding: var(--space-md) var(--space-md);

    .footer-inner {
      flex-direction: column;
      align-items: center;
      gap: var(--space-xl);
    }

    .footer-row {
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);
    }

    .footer-col {
      align-items: center;
    }
  }
`

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
          </Column>
        </Row>
        <Row className="footer-row" gap={'3xl'}>
          <Column className="footer-col">
            <div>{footerConf.title}</div>
            <div>{footerConf.marked}</div>
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
