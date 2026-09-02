export type FloatingActionsProps = {
  issueNumber: number
  initialLikeCount?: number
  initialLiked?: boolean
  /** compact：连体分段紧凑组（目录侧栏工具列）；default：散点圆钮组（文末） */
  variant?: 'default' | 'compact'
}
