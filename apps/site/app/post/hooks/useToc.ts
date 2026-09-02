'use client'

import { useMemo } from 'react'
import { transformArticleTypography, type ArticleSection } from '../lib/articleTypography'

export type TocItem = ArticleSection

/**
 * 从正文 HTML 生成目录，并注入铅字排印变换（章节记号 + 首字下沉）。
 * 变换为纯字符串运算且在渲染路径同步执行，SSR 与客户端输出确定一致。
 */
export function useToc(html: string | null | undefined): { html: string; toc: TocItem[] } {
  const source = html ?? ''

  return useMemo(() => {
    if (!source) return { html: '', toc: [] as TocItem[] }
    const result = transformArticleTypography(source)
    return { html: result.html, toc: result.sections }
  }, [source])
}
