import * as React from 'react'
import { Flex } from '../themes/global'
import { FooterWrapper } from './styles/index'

const footerConf = {
  slogan: '驿寄梅花, 鱼传尺素',
  title: '你也想起舞吗',
  MIIT: '鄂ICP备20001814号-1',
  MoPSF: '粤公网安备44030002001803号',
  copyright: 'Copyright©2024 Shadow.'
}

const Footer = () => {
  return (
    <FooterWrapper>
      <Flex>
        <div>{footerConf.slogan}</div>
        <div>{footerConf.title}</div>
      </Flex>
      <Flex>
        <div>{footerConf.MIIT}</div>
        <div>{footerConf.MoPSF}</div>
      </Flex>
      <Flex>
        <div>由next.js、mongodb和nest.js 强力驱动</div>
      </Flex>
      <Flex>
        <div>{footerConf.copyright}</div>
      </Flex>
    </FooterWrapper>
  )
}

export default Footer
