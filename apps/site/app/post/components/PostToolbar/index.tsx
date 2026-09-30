'use client'

import Link from 'next/link'
import type { AdjacentIssue } from '../../PostView.types'
import { IconBars } from '@wuh.site/components/icons'
import { useLocale } from '@wuh.site/components/locales'
import { buildPostUrl } from '../../../lib/slug'
import { Toolbar, ToolbarMeta, Spread, SpreadDivider, SpreadSide, SpreadLabel, SpreadTitle, SpreadArrow } from '../../styles'
import type { PostToolbarProps } from './specs'

function SpreadSideLink({ direction, targetIssue }: { direction: 'prev' | 'next'; targetIssue: AdjacentIssue | null }) {
  const { t } = useLocale()
  const label = direction === 'prev' ? t('post.toolbar.prev') : t('post.toolbar.next')
  const title = targetIssue?.title?.trim() || t('post.toolbar.empty')

  const content =
    direction === 'prev' ? (
      <>
        <SpreadArrow aria-hidden='true'>‹</SpreadArrow>
        <SpreadLabel>{label}</SpreadLabel>
        <SpreadTitle>{title}</SpreadTitle>
      </>
    ) : (
      <>
        <SpreadTitle>{title}</SpreadTitle>
        <SpreadLabel>{label}</SpreadLabel>
        <SpreadArrow aria-hidden='true'>›</SpreadArrow>
      </>
    )

  if (!targetIssue) {
    return (
      <SpreadSide as='span' $next={direction === 'next'} $disabled aria-disabled='true'>
        {content}
      </SpreadSide>
    )
  }

  return (
    <SpreadSide $next={direction === 'next'} href={buildPostUrl(targetIssue.number)} title={targetIssue.title}>
      {content}
    </SpreadSide>
  )
}

export default function PostToolbar({ prevIssue, nextIssue, total, position, currentNumber: _ }: PostToolbarProps) {
  const { t } = useLocale()
  const showPosition = position != null && total != null && total > 0

  return (
    <Toolbar aria-label={t('post.toolbar.aria')}>
      <ToolbarMeta>
        {showPosition && <span>{t('post.view.positionWithTotal', { position, total })}</span>}
        <Link href='/blog' title={t('post.toolbar.allPosts')}>
          <IconBars />
          <span>{t('post.toolbar.allPosts')}</span>
        </Link>
      </ToolbarMeta>
      <Spread>
        <SpreadSideLink direction='prev' targetIssue={prevIssue} />
        <SpreadDivider aria-hidden='true' />
        <SpreadSideLink direction='next' targetIssue={nextIssue} />
      </Spread>
    </Toolbar>
  )
}
