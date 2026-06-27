import * as React from 'react'
import styled from 'styled-components'
import { Row, Column, SpaceBetween } from '@wuh.site/components/flex'

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
            <svg viewBox="0 0 120 60" width={100} height={60} xmlns="http://www.w3.org/2000/svg" fill="none" role="img" style={{ display: 'block' }}>
              <title>wuh.site</title>
              <path d="M14 16 L24 44 L34 16 L44 44 L54 16" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="66" y="18" width="34" height="8" rx="4" fill="var(--primary-color)" />
              <rect x="66" y="34" width="20" height="8" rx="4" fill="currentColor" opacity=".55" />
            </svg>
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
