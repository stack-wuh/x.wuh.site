export type IssueLabel = {
  name: string
  color?: string | null
}

export type Issue = {
  id: number
  number: number
  title: string
  html_url: string
  comments: number
  created_at: string
  labels: IssueLabel[]
  body?: string
  body_html?: string
}

export type PostViewProps = {
  issue: Issue | null
}
