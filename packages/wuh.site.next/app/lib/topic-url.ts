export function normalizeTopicLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ')
}

export function buildTopicUrl(label: string): string {
  return `/topics/${encodeURIComponent(normalizeTopicLabel(label))}`
}

export function decodeTopicParam(param: string): string {
  return normalizeTopicLabel(decodeURIComponent(param))
}
