'use client'

import Button from '@wuh.site/components/button'
import { useLocale } from '@wuh.site/components/locales'
import ErrorPage from '../../components/ErrorPage'

export default function PostError() {
  const { t } = useLocale()

  return (
    <ErrorPage
      code='500'
      title={t('post.error.title')}
      description={
        <>
          {t('post.error.descriptionLine1')}
          <br />
          {t('post.error.descriptionLine2')}
        </>
      }
    >
      <Button href='/' variant='outlined'>{t('post.error.backHome')}</Button>
      <Button href='https://github.com/stack-wuh/blog/issues' target='_blank' rel='noopener noreferrer' variant='text'>{t('post.error.githubBlog')}</Button>
      <Button href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer' variant='text'>{t('post.error.knowledgeBase')}</Button>
    </ErrorPage>
  )
}
