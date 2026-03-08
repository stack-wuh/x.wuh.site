export type IssueLabel = {
  name: string
  color?: string | null
  url?: string
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
  labels: IssueLabel[]
  body?: string
  body_html?: string
}

export type PostViewProps = {
  issue: Issue | null
}
