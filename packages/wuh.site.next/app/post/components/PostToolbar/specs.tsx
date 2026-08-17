import type { AdjacentIssue } from '../../PostView.types'

export type PostToolbarProps = {
  prevIssue: AdjacentIssue | null
  nextIssue: AdjacentIssue | null
  currentNumber?: number
  total?: number
  position?: number
}
