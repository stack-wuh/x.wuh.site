import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const markdown = await readFile(resolve(appRoot, 'app/lib/markdown.ts'), 'utf8')
const styles = await readFile(resolve(appRoot, 'app/post/styles/post-markdown.ts'), 'utf8')

test('markdown 渲染管线用 Shiki 而非 highlight.js', () => {
  assert.match(markdown, /@shikijs\/rehype/)
  assert.doesNotMatch(markdown, /rehype-highlight/)
  assert.match(markdown, /themes:\s*\{/)
  assert.match(markdown, /light:\s*'github-light'/)
  assert.match(markdown, /dark:\s*'github-dark'/)
})

test('代码高亮样式用 Shiki 双主题变量替换 hljs 类', () => {
  assert.match(styles, /--shiki-light/)
  assert.match(styles, /--shiki-dark/)
  assert.doesNotMatch(styles, /\.hljs-|\.hljs\s/)
})
