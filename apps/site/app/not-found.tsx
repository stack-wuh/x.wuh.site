'use client'

import Button from '@wuh.site/components/button'
import ErrorPage from './components/ErrorPage'

const links = [
  { label: 'GitHub 项目', href: 'https://github.com/stack-wuh/x.wuh.site', target: '_blank' },
  { label: '语雀文档', href: 'https://www.yuque.com/shadow.wu/gb3x29', target: '_blank' },
  { label: '微信公众号：进阶的前端工程师' }
]

export default function NotFound() {
  return (
    <ErrorPage
      code='404'
      title='空空如也~~'
      description={<>你访问的页面可能已被移动或删除，<br />建议前往以下入口继续阅读。</>}
    >
      <Button href='/' variant='filled' color='primary'>返回首页</Button>
      <Button href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer' variant='outlined'>知识库</Button>
      {links.map((link) =>
        link.href ? (
          <Button key={link.label} href={link.href} target={link.target} rel='noopener noreferrer' variant='text'>{link.label}</Button>
        ) : (
          <Button key={link.label} disabled variant='text'>{link.label}</Button>
        )
      )}
    </ErrorPage>
  )
}
