import * as React from 'react'
import { Row, Column, SpaceBetween } from '@wuh.site/components/flex/index'
import Image from 'next/image'

const footerConf = {
  slogan: '驿寄梅花, 鱼传尺素',
  title: '你也想起舞吗',
  MIIT: '鄂ICP备20001814号-1',
  MoPSF: '粤公网安备44030002001803号',
  copyright: 'Copyright©2024 Shadow.',
  marked: '由next.js、mongodb和nest.js强力驱动'
}
const Footer = () => {
  return (
    <SpaceBetween
      gap={20}
      style={{
        padding: 'var(--space-xl) var(--space-2xl)',
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)',
        fontSize: 'var(--font-size-base)'
      }}
    >
      <Row gap={'3xl'}>
        <Column>
          <Image src={'/logo.svg'} alt={'logo'} width={100} height={60} />
        </Column>
        <Column>
          <div>{footerConf.slogan}</div>
          <div>{footerConf.copyright}</div>
        </Column>
      </Row>
      <Row gap={'3xl'}>
        <Column>
          <div>{footerConf.title}</div>
          <div>{footerConf.marked}</div>
        </Column>
        <Column>
          <div>{footerConf.MIIT}</div>
          <div>{footerConf.MoPSF}</div>
        </Column>
      </Row>
    </SpaceBetween>
  )
}

export default Footer
