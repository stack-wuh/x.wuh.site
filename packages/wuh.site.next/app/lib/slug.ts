export function toSlug(title: string): string {
  return title
    .trim()
    .replace(/[\s#?&/\\]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function buildPostUrl(number: number | string, title: string): string {
  return `/post/${number}-${toSlug(title)}`
}

export function isCanonicalPostPath(pathname: string, number: number | string, title: string): boolean {
  return pathname === `${number}-${toSlug(title)}`
}
