'use client'

import Link from 'next/link'
import type { AdjacentIssue } from '../PostView.types'
import { Toolbar } from '../styles'

const EMPTY_TEXT = '空空如也'

const ToolbarIcon = ({ direction }: { direction: 'prev' | 'next' }) => (
  <span className='toolbar-icon' aria-hidden='true'>
    <svg viewBox='0 0 16 16' focusable='false'>
      {direction === 'prev' ? <path d='M10.5 3.5L5.5 8l5 4.5' /> : <path d='M5.5 3.5L10.5 8l-5 4.5' />}
    </svg>
  </span>
)

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
        <ToolbarIcon direction={direction} />
        <span className='toolbar-label'>{label}</span>
      </span>
    )
  }

  return (
    <Link className={className} href={`/post/${targetIssue.number}`} title={targetIssue.title}>
      <ToolbarIcon direction={direction} />
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
