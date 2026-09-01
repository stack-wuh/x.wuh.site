'use client'

import Link from 'next/link'
import type { AdjacentIssue } from '../../PostView.types'
import { IconBars } from '@wuh.site/components/icons'
import { buildPostUrl } from '../../../lib/slug'
import { Toolbar, ToolbarMeta, Spread, SpreadDivider, SpreadSide, SpreadLabel, SpreadTitle, SpreadArrow } from '../../styles'
import type { PostToolbarProps } from './specs'

const EMPTY_TEXT = '空空如也'

function SpreadSideLink({ direction, targetIssue }: { direction: 'prev' | 'next'; targetIssue: AdjacentIssue | null }) {
  const label = direction === 'prev' ? '上一篇' : '下一篇'
  const title = targetIssue?.title?.trim() || EMPTY_TEXT

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
  const showPosition = position != null && total != null && total > 0

  return (
    <Toolbar aria-label='文章导航'>
      <ToolbarMeta>
        {showPosition && <span>第 {position} / {total} 篇</span>}
        <Link href='/blog' title='所有博客'>
          <IconBars />
          <span>所有博客</span>
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
