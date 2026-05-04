'use client'

import { useMemo } from 'react'

export type TocItem = {
  id: string
  text: string
  depth: 1 | 2 | 3
}

const slugify = (input: string) =>
  input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * 从 HTML 字符串解析标题生成目录，同时将标题元素注入 id 和锚点
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
      const seen = new Map<string, number>()

      const toc: TocItem[] = headings
        .map((node) => {
          const tag = node.tagName.toLowerCase()
          const depth = (tag === 'h1' ? 1 : tag === 'h2' ? 2 : 3) as TocItem['depth']
          const text = (node.textContent ?? '').trim()
          if (!text) return null

          const base = slugify(text) || 'section'
          const count = seen.get(base) ?? 0
          const id = count === 0 ? base : `${base}-${count + 1}`
          seen.set(base, count + 1)

          node.id = id
          const anchor = doc.createElement('a')
          anchor.className = 'anchor'
          anchor.href = `#${id}`
          anchor.setAttribute('aria-label', `跳转到：${text}`)
          anchor.textContent = '#'
          node.appendChild(anchor)

          return { id, text, depth }
        })
        .filter(Boolean) as TocItem[]

      return { html: doc.body.innerHTML, toc }
    } catch {
      return { html: source, toc: [] }
    }
  }, [html])
}
