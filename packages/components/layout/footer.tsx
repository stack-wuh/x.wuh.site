import * as React from 'react'
import styled from 'styled-components'
import { Flex } from '../themes/global'

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: ${(props) => props.theme.fontSizes.base};
  line-height: 1.5;
  text-align: center;
`

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
