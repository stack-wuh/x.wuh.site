'use client'

import Link from 'next/link'
import type { AdjacentIssue } from '../PostView.types'
import { IconChevronLeft, IconChevronRight } from '@wuh.site/components/icons'
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

  if (!targetIssue) {
    return (
      <span className={className} aria-disabled='true'>
        <span className='toolbar-icon'>
          {direction === 'prev' ? <IconChevronLeft /> : <IconChevronRight />}
        </span>
        <span className='toolbar-label'>{label}</span>
      </span>
    )
  }

  return (
    <Link className={className} href={`/post/${targetIssue.number}`} title={targetIssue.title}>
      <span className='toolbar-icon'>
        {direction === 'prev' ? <IconChevronLeft /> : <IconChevronRight />}
      </span>
      <span className='toolbar-label'>{label}</span>
    </Link>
  )
}

type Props = {
  prevIssue: AdjacentIssue | null
  nextIssue: AdjacentIssue | null
}

export default function PostToolbar({ prevIssue, nextIssue }: Props) {
  return (
    <Toolbar>
      <ToolbarLink direction='prev' targetIssue={prevIssue} />
      <ToolbarLink direction='next' targetIssue={nextIssue} />
    </Toolbar>
  )
}
