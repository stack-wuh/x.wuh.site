'use client'

import { useMemo } from 'react'

export type TocItem = {
  id: string
  text: string
  depth: 1 | 2 | 3
}

/**
 * 从 HTML 字符串解析标题生成目录（标题 id 和锚点由服务端 rehype-slug + rehype-autolink-headings 生成）
 */
export function useToc(html: string | null | undefined): { html: string; toc: TocItem[] } {
  return useMemo(() => {
    const source = html ?? ''
    if (!source) return { html: '', toc: [] }
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return { html: source, toc: [] }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(source, 'text/html')
      const headings = Array.from(doc.querySelectorAll('h1, h2, h3'))

      const toc: TocItem[] = headings
        .map((node) => {
          const tag = node.tagName.toLowerCase()
          const depth = (tag === 'h1' ? 1 : tag === 'h2' ? 2 : 3) as TocItem['depth']
          const text = (node.textContent ?? '').trim()
          const id = node.id
          if (!text || !id) return null

          return { id, text, depth }
        })
        .filter(Boolean) as TocItem[]

      return { html: source, toc }
    } catch {
      return { html: source, toc: [] }
    }
  }, [html])
}
