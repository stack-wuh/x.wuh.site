export function buildPostUrl(number: number | string): string {
  return `/post/${number}`
}

function decodePathname(pathname: string): string {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}

/** 路径是否为纯数字文章 id（canonical 形式） */
export function isCanonicalPostPath(pathname: string, number: number | string): boolean {
  return decodePathname(pathname) === String(number)
}

/** 从路径中提取文章 id；兼容旧 slug 格式（165-xxx） */
export function extractPostNumber(pathname: string): string | null {
  const match = decodePathname(pathname).match(/^(\d+)/)
  return match ? match[1] : null
}
