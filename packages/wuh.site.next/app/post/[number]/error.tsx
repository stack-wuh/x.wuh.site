'use client'

import Result from '@wuh.site/components/result'
import Button from '@wuh.site/components/button'

export default function Error() {
  return (
    <Result
      status='500'
      title='文章加载失败'
      description='当前文章暂时无法加载，你可以前往 GitHub 或知识库继续阅读。'
      links={[
        { label: 'GitHub 博客', href: 'https://github.com/stack-wuh/blog/issues', target: '_blank' },
        { label: '知识库', href: 'https://stack-wuh.github.io/blog/', target: '_blank' }
      ]}
      extra={(
        <Button href='/' variant='outlined'>返回首页</Button>
      )}
    />
  )
}
