'use client'

import styled, { createGlobalStyle } from 'styled-components'
import Result from '@wuh.site/components/result'
import Button from '@wuh.site/components/button'
import Image from '@wuh.site/components/image'

const GlobalLayout = createGlobalStyle`
  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
  }
`

const Root = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-geist-sans);
  padding: 32px 24px;
`

const ResultWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const ResultBlock = styled(Result)`
  min-height: auto;
  padding: 0;
`

const links = [
  { label: 'GitHub 项目', href: 'https://github.com/stack-wuh/x.wuh.site', target: '_blank' },
  { label: '语雀文档', href: 'https://www.yuque.com/shadow.wu/gb3x29', target: '_blank' },
  { label: '微信公众号：进阶的前端工程师' }
]

const LogoIcon = () => (
  <Image
    src='/logo.svg'
    alt='wuh.site.logo'
    width={32}
    height={20}
    inline
    showSkeleton={false}
    appearance='plain'
  />
)

export default function NotFound() {
  return (
    <>
      <GlobalLayout />
      <Root>
        <ResultWrap>
          <ResultBlock
            status='404'
            icon={<LogoIcon />}
            title='空空如也~~'
            description='你访问的页面可能已被移动或删除，建议前往以下入口继续阅读。'
            links={links}
            extra={(
              <>
                <Button href='/' variant='filled' color='primary'>返回首页</Button>
                <Button href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer' variant='outlined'>知识库</Button>
              </>
            )}
          />
        </ResultWrap>
      </Root>
    </>
  )
}
