import type { RepoDto, PostListItem, WereadBook } from '@wuh.site/core'

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
}
