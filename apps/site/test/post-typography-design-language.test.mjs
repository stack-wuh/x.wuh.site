import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const markdown = await readFile(resolve(appRoot, 'app/post/styles/post-markdown.ts'), 'utf8')
const postView = await readFile(resolve(appRoot, 'app/post/PostView/index.tsx'), 'utf8')

const body = markdown.match(/export const MarkdownBody = styled\.article`([\s\S]*?)`/)?.[1] || ''

test('正文使用衬线极紧凑排版', () => {
  assert.match(body, /p \{\s*margin: 14px 0;\s*font-family: var\(--font-serif\);\s*font-size: 14px;\s*line-height: 1\.55/)
})

test('标题层级统一衬线并去下划线', () => {
  assert.match(body, /h1, h2, h3, h4, h5, h6 \{\s*font-family: var\(--font-serif\)/)
  assert.doesNotMatch(body, /h1, h2 \{[\s\S]*?border-bottom/)
})

test('h2 使用左侧短竖线而非下划线', () => {
  assert.match(body, /h2::before\s*\{/)
  assert.match(body, /border-radius: 999px/)
})

test('引用块去掉斜体与背景盒，只留左侧竖线', () => {
  const bq = body.match(/blockquote \{([\s\S]*?)\}/)?.[1] || ''
  assert.doesNotMatch(bq, /font-style: italic/)
  assert.doesNotMatch(bq, /background:/)
  assert.match(bq, /border-left:/)
})

test('无序列表使用 accent 圆点 marker', () => {
  assert.match(body, /ul > li::before\s*\{[\s\S]*?border-radius: 50%/)
  assert.match(body, /background: var\(--accent-color\)/)
})

test('分割线使用空心圆环', () => {
  assert.match(body, /hr::after\s*\{[\s\S]*?border-radius: 50%/)
  assert.match(body, /border: 2px solid var\(--primary-color\)/)
})

test('正文图片限高且保留既有内容视觉规范', () => {
  const img = body.match(/img \{([\s\S]*?)\}/)?.[1] || ''
  assert.match(img, /max-width:\s*100%/)
  assert.match(img, /height:\s*auto/)
  assert.match(img, /border-radius:\s*8px/)
  assert.match(img, /max-height: 340px/)
})

test('更新提示线仅在文章真正编辑过时显示', () => {
  assert.match(postView, /issue\.updated_at !== issue\.created_at/)
  assert.match(postView, /更新于/)
})
