export type RelatedPostCandidate = {
  number: number
  title: string
  labels: string[]
  updatedAt: string
  viewCount?: number
  summary?: string | null
}

export type RelatedPost = RelatedPostCandidate & {
  sharedLabels: string[]
}

type CurrentPost = {
  number: number
  labels: string[]
}

function normalizeLabels(labels: string[]): string[] {
  return Array.from(new Set(labels.map((label) => label.trim()).filter(Boolean)))
}

function toTimestamp(value: string): number {
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function selectRelatedPosts(currentPost: CurrentPost, candidates: RelatedPostCandidate[]): RelatedPost[] {
  const currentLabels = new Set(normalizeLabels(currentPost.labels))
  const ranked = candidates
    .filter((candidate) => candidate.number !== currentPost.number)
    .map((candidate) => ({
      ...candidate,
      sharedLabels: normalizeLabels(candidate.labels).filter((label) => currentLabels.has(label)),
    }))
    .filter((candidate) => candidate.sharedLabels.length > 0)
    .sort((left, right) => {
      const sharedLabelsDifference = right.sharedLabels.length - left.sharedLabels.length
      if (sharedLabelsDifference !== 0) return sharedLabelsDifference

      const viewCountDifference = (right.viewCount ?? 0) - (left.viewCount ?? 0)
      if (viewCountDifference !== 0) return viewCountDifference

      const updatedAtDifference = toTimestamp(right.updatedAt) - toTimestamp(left.updatedAt)
      if (updatedAtDifference !== 0) return updatedAtDifference

      return left.number - right.number
    })

  const seenNumbers = new Set<number>()
  const uniquePosts = ranked.filter((candidate) => {
    if (seenNumbers.has(candidate.number)) return false
    seenNumbers.add(candidate.number)
    return true
  })

  return uniquePosts.slice(0, 3)
}
