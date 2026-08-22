import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const markdownSource = await readFile(resolve(appRoot, 'app/lib/markdown.ts'), 'utf8')

test('Markdown 摘要实现使用 AST 并跳过结构节点', () => {
  assert.match(markdownSource, /export function extractFirstParagraphText\(/)
  assert.match(markdownSource, /\.use\(remarkParse\)/)
  assert.match(markdownSource, /\.use\(remarkGfm\)/)
  assert.match(markdownSource, /node\.type !== 'paragraph'/)
  assert.match(markdownSource, /node\.type === 'text' \|\| node\.type === 'inlineCode'/)
  assert.match(markdownSource, /SUMMARY_FALLBACK/)
  assert.match(markdownSource, /maxLength - 3/)
})
