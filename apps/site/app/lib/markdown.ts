import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'

export async function renderMarkdown(md: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      content: { type: 'text', value: '#' },
      properties: { className: 'anchor', ariaHidden: true },
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(md)

  return String(result)
}

type MarkdownNode = {
  type: string
  value?: string
  alt?: string
  children?: MarkdownNode[]
}

const SUMMARY_FALLBACK = '阅读这篇博客文章'

function getNodeText(node: MarkdownNode): string {
  if (node.type === 'text' || node.type === 'inlineCode') {
    return node.value ?? ''
  }

  if (node.type === 'image') {
    return node.alt ?? ''
  }

  if (node.type === 'break') {
    return ' '
  }

  return (node.children ?? []).map(getNodeText).join('')
}

function truncateSummary(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  if (maxLength <= 3) return value.slice(0, maxLength)
  return `${value.slice(0, maxLength - 3)}...`
}

/**
 * Extracts a readable summary from the first meaningful Markdown paragraph.
 *
 * Headings, fenced code blocks, and whitespace-only nodes are intentionally
 * excluded so metadata descriptions reflect prose rather than document
 * structure or implementation details.
 */
export function extractFirstParagraphText(md: string, maxLength = 160): string {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(md) as MarkdownNode

  const paragraph = (tree.children ?? []).find((node) => {
    if (node.type !== 'paragraph') return false
    return getNodeText(node).trim().length > 0
  })

  if (!paragraph) return SUMMARY_FALLBACK

  const text = getNodeText(paragraph).replace(/\s+/g, ' ').trim()
  return text ? truncateSummary(text, maxLength) : SUMMARY_FALLBACK
}
