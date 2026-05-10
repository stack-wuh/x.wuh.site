'use client'

import Button from '@wuh.site/components/button'
import ErrorPage from '../../components/ErrorPage'

export default function PostError() {
  return (
    <ErrorPage
      code='500'
      title='文章加载失败'
      description={<>当前文章暂时无法加载，<br />你可以前往 GitHub 或知识库继续阅读。</>}
    >
      <Button href='/' variant='outlined'>返回首页</Button>
      <Button href='https://github.com/stack-wuh/blog/issues' target='_blank' rel='noopener noreferrer' variant='text'>GitHub 博客</Button>
      <Button href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer' variant='text'>知识库</Button>
    </ErrorPage>
  )
}
