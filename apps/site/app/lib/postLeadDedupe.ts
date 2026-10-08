/**
 * 渲染层导语区去重：对 SSR 正文 HTML 做纯字符串运算，不依赖 DOM，
 * 输入相同则输出确定相同——与 articleTypography 排印变换同一确定性纪律。
 *
 * 背景：新版文档结构的正文 markdown 自带大标题与内嵌封面图（与
 * metadata.cover 同 URL），而详情页 chrome 已渲染 PostHeader h1 与
 * PostCover 杂志卡，叠加后首屏同一图 ×2、同一标题 ×3。本模块只在
 * 「导语区」（文档首个实质内容块之前）收编这两类重复；数据层
 * （GitHub body / MongoDB / RSS / 导出全文）保持原文不动。
 *
 * - 图片规则：导语区内归一化 URL 等于 metadata.cover 的 <img> 移除；
 *   移除后只剩空壳的段落整块移除，混排段落仅删 img 标签保留文本。
 * - 标题规则：导语区首个 heading 剥离手写编号前缀后与文章标题等强则移除。
 * - 导语区之后的内容永不触碰（正文中途合理复用的同 URL 配图不受影响）。
 */

export type LeadDedupeContext = {
  title?: string | null
  cover?: string | null
}

export type LeadDedupeResult = {
  html: string
  removedImages: number
  removedHeadings: number
}

type LeadBlock = {
  /** 块在原文中的完整匹配（含标签与首尾空白外沿） */
  raw: string
  start: number
  end: number
  tag: string
  inner: string
}

// 与 articleTypography 的手写编号剥离规则对齐（一、 / 1. / 2．）；比对场景双侧都剥，故锚定行首即可
const NUMERAL_PREFIX = /^(?:[一二三四五六七八九十百]+|\d+)[、.．]\s*/
const ANCHOR_RE = /<a[^>]*class="anchor"[^>]*>[\s\S]*?<\/a>/g
const IMG_RE = /<img\b[^>]*>/gi
const IMG_SRC_RE = /\bsrc\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i
// 顶层块级标记；p/h 不可能自嵌套，非贪婪闭合安全；嵌套列表仅出现在终止块内，不影响导语扫描
const BLOCK_RE = /<(h[1-6]|p|ul|ol|pre|blockquote|table|div)\b((?:\s[^>]*)?)>([\s\S]*?)<\/\1>|<hr\b(?:\s[^>]*)?>/gi

// 硬上限：新文档结构导语区固定为「标题 + 封面图」数块；病态长导语不做全文扫描
const LEAD_SCAN_LIMIT = 12

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

/** 比对用图片 URL 归一化：去首尾空白、去协议、host 小写、截断查询串与 hash；path 大小写敏感 */
export function normalizeImageUrl(src: string): string {
  const trimmed = src.trim().replace(/^https?:\/\//i, '')
  const withoutSuffix = trimmed.replace(/[?#].*$/, '')
  const slash = withoutSuffix.indexOf('/')
  if (slash === -1) return withoutSuffix.toLowerCase()
  return withoutSuffix.slice(0, slash).toLowerCase() + withoutSuffix.slice(slash)
}

/** 比对用标题文本归一化：剥离锚点与内联标签、解码实体、折叠空白 */
export function normalizeHeadingText(fragment: string): string {
  const withoutAnchor = fragment.replace(ANCHOR_RE, '')
  return collapseWhitespace(decodeEntities(withoutAnchor.replace(/<[^>]*>/g, '')))
}

function stripNumeralPrefix(text: string): string {
  return text.replace(NUMERAL_PREFIX, '')
}

function extractSrc(imgTag: string): string | null {
  const match = IMG_SRC_RE.exec(imgTag)
  if (!match) return null
  return match[2] ?? match[3] ?? match[4] ?? null
}

const HEADING_TAG_RE = /^h[1-6]$/
// 与 IMG_RE 同源但无 /g——global 正则的 .test() 有 lastIndex 状态残留，不可用于探测
const HAS_IMG_RE = /<img\b/i

/** 终止块：含文字但不含图片的段落，或列表/引用/代码/表格/div——正文内容自此开始 */
function isTerminator(block: LeadBlock): boolean {
  if (block.tag === 'p') {
    return !HAS_IMG_RE.test(block.inner) && normalizeHeadingText(block.inner).length > 0
  }
  return block.tag !== 'hr' && !HEADING_TAG_RE.test(block.tag)
}

/** 以原开/闭标签包裹新的 inner，保持块级改写不损伤标签本身 */
function rebuildBlock(block: LeadBlock, newInner: string): string {
  const openEnd = block.raw.indexOf('>') + 1
  const closeStart = block.raw.lastIndexOf('<')
  return block.raw.slice(0, openEnd) + newInner + block.raw.slice(closeStart)
}

function scanBlocks(html: string): LeadBlock[] {
  const blocks: LeadBlock[] = []
  BLOCK_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = BLOCK_RE.exec(html)) !== null) {
    const [raw, blockTag, , inner] = match
    if (blocks.length === 0 && match.index > 0 && !/^\s*$/.test(html.slice(0, match.index))) {
      // 首块之前存在游离文本：结构不可信，放弃扫描
      break
    }
    if (!blockTag) {
      // <hr> 分支（无捕获的内容组）
      blocks.push({ raw, start: match.index, end: match.index + raw.length, tag: 'hr', inner: '' })
      continue
    }
    blocks.push({
      raw,
      start: match.index,
      end: match.index + raw.length,
      tag: blockTag.toLowerCase(),
      inner: inner ?? '',
    })
  }
  return blocks
}

export function dedupeLeadArtifacts(html: string, ctx: LeadDedupeContext): LeadDedupeResult {
  if (!html) return { html: '', removedImages: 0, removedHeadings: 0 }

  const cover = ctx.cover ? normalizeImageUrl(ctx.cover) : null
  const title = ctx.title ? stripNumeralPrefix(normalizeHeadingText(ctx.title)) : null

  const blocks = scanBlocks(html)
  // 从后往前应用区间删改，避免位移失效
  const edits: Array<{ start: number; end: number; replacement: string }> = []
  let removedImages = 0
  let removedHeadings = 0
  let firstHeadingSeen = false

  for (let i = 0; i < Math.min(blocks.length, LEAD_SCAN_LIMIT); i++) {
    const block = blocks[i]
    if (isTerminator(block)) break

    if (block.tag === 'hr') continue

    if (block.tag[0] === 'h') {
      if (!firstHeadingSeen) {
        firstHeadingSeen = true
        if (title && stripNumeralPrefix(normalizeHeadingText(block.inner)) === title) {
          removedHeadings += 1
          edits.push({ start: block.start, end: block.end, replacement: '' })
        }
      }
      continue
    }

    if (block.tag === 'p' && cover) {
      const kept = block.inner.replace(IMG_RE, (imgTag) => {
        const src = extractSrc(imgTag)
        if (src !== null && normalizeImageUrl(src) === cover) {
          removedImages += 1
          return ''
        }
        return imgTag
      })
      if (kept === block.inner) continue
      // 删图后只剩空壳的段落整块移除；混排段落仅删 img、保留原文本与原标签
      edits.push({
        start: block.start,
        end: block.end,
        replacement: normalizeHeadingText(kept).length === 0 ? '' : rebuildBlock(block, kept),
      })
    }
  }

  if (edits.length === 0) return { html, removedImages, removedHeadings }

  let output = ''
  let cursor = 0
  for (const edit of edits.sort((a, b) => a.start - b.start)) {
    output += html.slice(cursor, edit.start) + edit.replacement
    cursor = edit.end
  }
  output += html.slice(cursor)
  return { html: output, removedImages, removedHeadings }
}
