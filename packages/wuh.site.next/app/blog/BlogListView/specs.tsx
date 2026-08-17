import type { ContentLabelSummary, PostListItem } from '@wuh.site/shared-contracts'

export const TAG_DISPLAY_LIMIT = 3

export type BlogListViewProps = {
  posts: PostListItem[]
  pagination: { currentPage: number; lastPage: number; total?: number }
  activeLabels: string[]
  availableLabels: ContentLabelSummary[]
}
