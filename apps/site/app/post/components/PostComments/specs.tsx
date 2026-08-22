export const NICKNAME_STORAGE_KEY = 'wuh.site.comment.nickname'

export type PostComment = {
  _id?: string
  externalId?: string | number
  issueNumber: number
  body: string
  bodyHtml?: string
  user?: {
    login: string
    avatarUrl: string
    url: string
  } | null
  nickname?: string
  avatarUrl?: string
  status?: 'pending' | 'approved' | 'rejected'
  createdAtGitHub?: string
  createdAt?: string
}

export type PostCommentsProps = {
  issueNumber: number
}
