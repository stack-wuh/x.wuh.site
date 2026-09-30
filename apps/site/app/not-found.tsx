'use client'

import Button from '@wuh.site/components/button'
import { useLocale } from '@wuh.site/components/locales'
import ErrorPage from './components/ErrorPage'

const links = [
  { labelKey: 'site.error.githubProject', href: 'https://github.com/stack-wuh/x.wuh.site', target: '_blank' },
  { labelKey: 'site.error.yuqueDocs', href: 'https://www.yuque.com/shadow.wu/gb3x29', target: '_blank' },
  { labelKey: 'site.notFound.wechatAccount' }
]

export default function NotFound() {
  const { t } = useLocale()
  return (
    <ErrorPage
      code='404'
      title={t('site.notFound.title')}
      description={<>{t('site.notFound.desc1')}<br />{t('site.notFound.desc2')}</>}
    >
      <Button href='/' variant='filled' color='primary'>{t('site.backHome')}</Button>
      <Button href='https://stack-wuh.github.io/blog/' target='_blank' rel='noopener noreferrer' variant='outlined'>{t('site.nav.knowledge')}</Button>
      {links.map((link) =>
        link.href ? (
          <Button key={link.labelKey} href={link.href} target={link.target} rel='noopener noreferrer' variant='text'>{t(link.labelKey)}</Button>
        ) : (
          <Button key={link.labelKey} disabled variant='text'>{t(link.labelKey)}</Button>
        )
      )}
    </ErrorPage>
  )
}
