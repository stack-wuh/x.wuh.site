'use client'

import Result from '@wuh.site/components/result'
import Button from '@wuh.site/components/button'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Result
      status='500'
      title='页面出现异常'
      description='我们正在修复这个问题，你可以稍后再试或先前往其他平台查看内容。'
      links={[
        { label: 'GitHub 项目', href: 'https://github.com/stack-wuh/x.wuh.site', target: '_blank' },
        { label: '语雀文档', href: 'https://www.yuque.com/shadow.wu/gb3x29', target: '_blank' }
      ]}
      extra={(
        <>
          <Button onClick={() => reset()} variant='filled' color='primary'>重试</Button>
          <Button href='/' variant='outlined'>返回首页</Button>
        </>
      )}
    />
  )
}
