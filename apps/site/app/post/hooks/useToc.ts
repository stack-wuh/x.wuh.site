'use client'

import { useMemo } from 'react'
import { useLocale } from '@wuh.site/components/locales'
import { transformArticleTypography, SECTION_NUMERALS, type ArticleSection } from '../lib/articleTypography'

export type TocItem = ArticleSection

/**
 * 从正文 HTML 生成目录，并注入铅字排印变换（章节记号 + 首字下沉）。
 * 变换为纯字符串运算且在渲染路径同步执行；章节记号随 locale 翻译
 * （SSR 恒 zh，客户端挂载后与 LocaleProvider 同步切换），锚点与 id 不受影响。
 */
export function useToc(html: string | null | undefined): { html: string; toc: TocItem[] } {
  const source = html ?? ''
  const { locale, t } = useLocale()

  return useMemo(() => {
    if (!source) return { html: '', toc: [] as TocItem[] }
    const result = transformArticleTypography(source, {
      numerals: SECTION_NUMERALS[locale],
      formatSection: (numeral) => t('post.section', { n: numeral }),
    })
    return { html: result.html, toc: result.sections }
  }, [source, locale, t])
}
