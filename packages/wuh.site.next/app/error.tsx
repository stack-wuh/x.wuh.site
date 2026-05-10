'use client'

import Button from '@wuh.site/components/button'
import ErrorPage from './components/ErrorPage'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorPage
      code='500'
      title='页面出现异常'
      description={<>我们正在修复这个问题，<br />你可以稍后再试或先前往其他平台查看内容。</>}
    >
      <Button onClick={() => reset()} variant='filled' color='primary'>重试</Button>
      <Button href='/' variant='outlined'>返回首页</Button>
      <Button href='https://github.com/stack-wuh/x.wuh.site' target='_blank' rel='noopener noreferrer' variant='text'>GitHub 项目</Button>
      <Button href='https://www.yuque.com/shadow.wu/gb3x29' target='_blank' rel='noopener noreferrer' variant='text'>语雀文档</Button>
    </ErrorPage>
  )
}
