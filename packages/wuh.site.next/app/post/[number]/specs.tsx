import type { Metadata } from 'next'
import type { AdjacentPost } from '@wuh.site/shared-contracts'
import type { Issue } from '../PostView.types'

export const SITE_URL = 'https://wuh.site'

export const FALLBACK_METADATA: Metadata = {
  title: '博客详情',
  description: '阅读这篇博客文章',
}

export type PostPageParams = {
  number: string
}

export type IssueData = {
  issue: Issue | null
  prev: AdjacentPost | null
  next: AdjacentPost | null
  total: number
  position: number
}
