/**
 * 铅字排印变换：对服务端渲染好的正文 HTML 做纯字符串运算。
 * 不依赖 DOM，输入相同则输出确定相同——SSR 与客户端 hydration 安全。
 *
 * - 章节记号：h2/h3 注入「第N节」眉线（自动编号 壹贰叁…），并从显示层
 *   剥离作者手写的「一、」「1.」编号前缀；heading id 与锚点链接保持不变。
 * - 首字下沉：正文第一个以文字开头的段落首字包 .dropcap；
 *   以标签（图片/行内元素）或 HTML 实体开头的段落跳过，保证任意文章不破版。
 */

export type ArticleSection = {
  id: string
  text: string
  depth: 1 | 2 | 3
  /** 章节记号全称（第N节），h1 不参与编号为 null */
  num: string | null
  /** 目录短序号（壹），h1 为 null */
  shortNum: string | null
}

const CN_NUMERALS = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾', '拾壹', '拾贰']
// 作者手写编号前缀：中文数字（一、十二、）或阿拉伯数字（1. 2、）
const NUMERAL_PREFIX = /(?:[一二三四五六七八九十百]+|\d+)[、.．]\s*/
const ANCHOR_RE = /<a[^>]*class="anchor"[^>]*>[\s\S]*?<\/a>/
const HEADING_RE = /<h([123])((?:\s[^>]*)?)>([\s\S]*?)<\/h\1>/g
const PARAGRAPH_RE = /<p((?:\s[^>]*)?)>([\s\S]*?)<\/p>/g
const LEADING_WHITESPACE = /^\s*/
// 正文服务端渲染时 HTML 已转义，<h2>/<p> 等标签不会出现在代码块内

function isDropCapChar(char: string): boolean {
  return /[\u4e00-\u9fffA-Za-z0-9]/.test(char)
}

function injectDropCap(html: string): string {
  let injected = false
  return html.replace(PARAGRAPH_RE, (match, attrs?: string, inner?: string) => {
    if (injected || !inner) return match
    const lead = LEADING_WHITESPACE.exec(inner)?.[0] ?? ''
    const body = inner.slice(lead.length)
    if (!body || body.startsWith('<') || body.startsWith('&')) return match
    const first = body.charAt(0)
    if (!isDropCapChar(first)) return match
    injected = true
    return `<p${attrs ?? ''}>${lead}<span class="dropcap">${first}</span>${body.slice(1)}</p>`
  })
}

export function transformArticleTypography(html: string): { html: string; sections: ArticleSection[] } {
  if (!html) return { html: '', sections: [] }

  const sections: ArticleSection[] = []
  let sectionIndex = 0

  const withSections = html.replace(
    HEADING_RE,
    (match: string, level: string, attrs?: string, inner?: string) => {
      const depth = (level === '1' ? 1 : level === '2' ? 2 : 3) as ArticleSection['depth']
      const id = /id="([^"]*)"/.exec(attrs ?? '')?.[1]
      if (!id || !inner) return match

      const anchor = ANCHOR_RE.exec(inner)?.[0] ?? ''
      const content = inner.replace(ANCHOR_RE, '')
      const plainText = content.replace(/<[^>]+>/g, '').trim()
      if (!plainText) return match

      if (depth === 1) {
        sections.push({ id, text: plainText, depth, num: null, shortNum: null })
        return match
      }

      sectionIndex += 1
      const shortNum = sectionIndex <= CN_NUMERALS.length ? CN_NUMERALS[sectionIndex - 1] : String(sectionIndex)
      const num = `第${shortNum}节`
      // 仅当标题以文字（而非行内标签）开头时才安全剥离手写编号
      const lead = LEADING_WHITESPACE.exec(content)?.[0] ?? ''
      const body = content.slice(lead.length)
      const strippedBody = body.startsWith('<') ? body : body.replace(NUMERAL_PREFIX, '')

      sections.push({ id, text: strippedBody.replace(/<[^>]+>/g, '').trim(), depth, num, shortNum })
      return `<h${level}${attrs ?? ''}><span class="sec-eyebrow">${num}<i class="stub"></i></span><span class="sec-text">${strippedBody}</span>${anchor}</h${level}>`
    },
  )

  return { html: injectDropCap(withSections), sections }
}
