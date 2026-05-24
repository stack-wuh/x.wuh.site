'use client'

import Link from 'next/link'
import type { AdjacentIssue } from '../PostView.types'
import { IconChevronLeft, IconChevronRight, IconBars } from '@wuh.site/components/icons'
import { Toolbar } from '../styles'

const EMPTY_TEXT = '空空如也'

const ToolbarLink = ({
  direction,
  targetIssue,
}: {
  direction: 'prev' | 'next'
  targetIssue: AdjacentIssue | null
}) => {
  const className = `toolbar-link ${direction}`
  const label = targetIssue?.title?.trim() || EMPTY_TEXT
  const icon = direction === 'prev' ? <IconChevronLeft /> : <IconChevronRight />

  if (!targetIssue) {
    return (
      <span className={className} aria-disabled='true'>
        <span className='toolbar-icon'>{icon}</span>
        <span className='toolbar-label'>{label}</span>
      </span>
    )
  }

  return (
    <Link className={className} href={`/post/${targetIssue.number}`} title={targetIssue.title}>
      <span className='toolbar-icon'>{icon}</span>
      <span className='toolbar-label'>{label}</span>
    </Link>
  )
}

type Props = {
  prevIssue: AdjacentIssue | null
  nextIssue: AdjacentIssue | null
  currentNumber?: number
  total?: number
  position?: number
}

export default function PostToolbar({ prevIssue, nextIssue, currentNumber, total, position }: Props) {
  const hasBoth = prevIssue && nextIssue
  const showPosition = position != null && total != null && total > 0

  return (
    <Toolbar>
      <ToolbarLink direction='prev' targetIssue={prevIssue} />
      <Link className='toolbar-back' href='/blog' title='所有博客'>
        <IconBars />
        <span>所有博客</span>
      </Link>
      <span className='toolbar-flow'>
        {hasBoth && <span className='toolbar-flow-line' />}
        {showPosition && (
          <span className='toolbar-position'>第 {position} / {total} 篇</span>
        )}
      </span>
      <ToolbarLink direction='next' targetIssue={nextIssue} />
    </Toolbar>
  )
}
