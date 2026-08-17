import type { RepoDto, PostListItem, WereadBook } from '@wuh.site/shared-contracts'

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
