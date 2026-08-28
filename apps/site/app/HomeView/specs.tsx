import type { RepoDto, PostListItem, WereadBook } from '@wuh.site/core'
import type { ReactNode } from 'react'

export type HomeViewProps = {
  repos: RepoDto[]
  posts: PostListItem[]
  yearlySummaries: {
    id: number
    number: number
    title: string
    created_at: string
  }[]
  wereadBooks: WereadBook[]
  /** Server Component 渲染的纯展示区块（不参与水合） */
  hero?: ReactNode
}
