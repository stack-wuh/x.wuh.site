export type ArticleExporterData = {
  title: string
  summary?: string | null
  cover?: string | null
  coverAlt?: string | null
  authorName: string
  authorAvatar?: string | null
  createdAt: string
  bodyHtml: string
  url: string
}

export type ArticleExporterProps = {
  open: boolean
  onClose: () => void
  data: ArticleExporterData
}
