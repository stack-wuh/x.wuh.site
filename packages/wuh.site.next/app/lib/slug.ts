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

function decodePathname(pathname: string): string {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}

export function isCanonicalPostPath(pathname: string, number: number | string, title: string): boolean {
  return decodePathname(pathname) === `${number}-${toSlug(title)}`
}
