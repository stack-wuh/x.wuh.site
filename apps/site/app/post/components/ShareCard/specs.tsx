export type ShareCardLabel = {
  name: string
  color?: string | null
}

export type ShareCardData = {
  title: string
  summary?: string | null
  cover?: string | null
  coverAlt?: string | null
  authorName: string
  authorAvatar?: string | null
  createdAt: string
  labels: ShareCardLabel[]
  url: string
  viewCount?: number
  likeCount?: number
}

export type ShareCardProps = {
  open: boolean
  onClose: () => void
  data: ShareCardData
}
