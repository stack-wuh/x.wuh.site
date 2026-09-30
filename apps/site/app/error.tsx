'use client'

import Button from '@wuh.site/components/button'
import { useLocale } from '@wuh.site/components/locales'
import ErrorPage from './components/ErrorPage'

export default function Error({ reset }: { reset: () => void }) {
  const { t } = useLocale()
  return (
    <ErrorPage
      code='500'
      title={t('site.error.title')}
      description={<>{t('site.error.desc1')}<br />{t('site.error.desc2')}</>}
    >
      <Button onClick={() => reset()} variant='filled' color='primary'>{t('site.error.retry')}</Button>
      <Button href='/' variant='outlined'>{t('site.backHome')}</Button>
      <Button href='https://github.com/stack-wuh/x.wuh.site' target='_blank' rel='noopener noreferrer' variant='text'>{t('site.error.githubProject')}</Button>
      <Button href='https://www.yuque.com/shadow.wu/gb3x29' target='_blank' rel='noopener noreferrer' variant='text'>{t('site.error.yuqueDocs')}</Button>
    </ErrorPage>
  )
}
