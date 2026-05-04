export type IssueLabel = {
  name: string
  color?: string | null
  url?: string
}

export type IssueUser = {
  login?: string | null
  userName?: string | null
  avatarUrl?: string | null
}

export type IssueMetadata = {
  cover?: string | null
  summary?: string | null
  slug?: string | null
  keywords?: string[] | null
}

export type Issue = {
  id: number
  number: number
  title: string
  html_url: string
  repository_url?: string | null
  comments: number
  created_at: string
  updated_at?: string
  user?: IssueUser | null
  labels: IssueLabel[]
  body?: string
  body_html?: string
  metadata?: IssueMetadata | null
}

export type AdjacentIssue = Pick<Issue, 'number' | 'title'>

export type PostViewProps = {
  issue: Issue | null
  prevIssue: AdjacentIssue | null
  nextIssue: AdjacentIssue | null
}
