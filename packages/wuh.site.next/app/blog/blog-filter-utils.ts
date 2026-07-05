import type { ContentLabelSummary } from '@wuh.site/shared-contracts'

export const toLabelParams = (value: string | string[] | undefined): string[] => {
  const values = Array.isArray(value) ? value : value ? [value] : []
  const labels = values.flatMap((item) => item.split(',')).map((item) => item.trim()).filter(Boolean)
  return Array.from(new Set(labels))
}

export const buildBlogUrl = (page: number, labels: string[] = []): string => {
  const params = new URLSearchParams()
  labels.forEach((label) => params.append('labels', label))
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/blog?${query}` : '/blog'
}

export const toggleLabel = (activeLabels: string[], label: string): string[] => {
  return activeLabels.includes(label)
    ? activeLabels.filter((item) => item !== label)
    : [...activeLabels, label]
}

export const formatFilterOptionLabel = (label: ContentLabelSummary): string => {
  return `${label.name}(+${label.count})`
}

export const getFilterSummaryLabel = (
  availableLabels: ContentLabelSummary[],
  activeLabels: string[],
  filteredTotal?: number,
): string => {
  if (activeLabels.length === 0) return 'Labels'

  if (Number.isFinite(filteredTotal)) {
    return `Labels(+${filteredTotal})`
  }

  const activeCount = availableLabels.find((label) => label.name === activeLabels[0])?.count ?? 0

  return activeCount > 0 ? `Labels(+${activeCount})` : 'Labels'
}
