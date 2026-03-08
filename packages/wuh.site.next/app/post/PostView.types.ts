export type IssueLabel = {
  name: string
  color?: string | null
  url?: string
}

export type IssueUser = {
  login?: string | null
  userName?: string | null
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
}

export type AdjacentIssue = Pick<Issue, 'number' | 'title'>

export type PostViewProps = {
  issue: Issue | null
  prevIssue: AdjacentIssue | null
  nextIssue: AdjacentIssue | null
}
