export type PostCoverProps = {
  src?: string | null
  alt: string
  /** 无封面图时，生成式封面使用 */
  title?: string
  authorName?: string
  createdAt?: string
  viewCount?: number
  summary?: string | null
}
