export function toSlug(title: string): string {
  return title
    .replace(/[#?&/\\]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function buildPostUrl(number: number | string, title: string): string {
  return `/post/${number}-${toSlug(title)}`
}
