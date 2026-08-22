import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const [stylesIndex, postHeader, pageSource, postView] = await Promise.all([
  readFile(resolve(appRoot, 'app/post/styles/index.ts'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/components/PostHeader.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/[number]/page.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/PostView.tsx'), 'utf8'),
])

test('文章样式桶导出 PostHeader 实际使用的 AuthorAvatarFrame', () => {
  assert.match(postHeader, /AuthorAvatarFrame/)
  assert.match(stylesIndex, /AuthorAvatarFrame/)
  assert.doesNotMatch(stylesIndex, /\bAuthorAvatar\b/)
})

test('文章详情使用统一函数保证 Markdown 正文存在', () => {
  assert.match(pageSource, /ensureRenderedBody/)
  assert.match(pageSource, /issue\.body_html = await ensureRenderedBody\(issue\)/)
})

test('文章详情优先从 Markdown body 生成带锚点的正文', () => {
  assert.match(pageSource, /if \(issue\.body\?\.trim\(\)\) return renderMarkdown\(issue\.body\)/)
  assert.match(pageSource, /if \(issue\.body_html\?\.trim\(\)\) return issue\.body_html/)
  assert.ok(pageSource.indexOf('renderMarkdown(issue.body)') < pageSource.indexOf('issue.body_html'))
})

test('PostView 不静默将缺失正文归一化为空字符串', () => {
  assert.doesNotMatch(postView, /issue\?\.body_html \|\| ''/)
  assert.match(postView, /issue\?\.body_html/)
})
