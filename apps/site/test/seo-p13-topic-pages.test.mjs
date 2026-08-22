import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const topicPagePath = resolve(appRoot, 'app/topics/[label]/page.tsx')
const blogListViewSource = await readFile(resolve(appRoot, 'app/blog/BlogListView/index.tsx'), 'utf8')
const blogStylesSource = await readFile(resolve(appRoot, 'app/blog/styles/index.ts'), 'utf8')
let topicPageSource = ''
try {
  topicPageSource = await readFile(topicPagePath, 'utf8')
} catch {}

test('topic page exposes canonical metadata and fetches posts by decoded label', () => {
  assert.match(topicPageSource, /generateMetadata/)
  assert.match(topicPageSource, /alternates:\s*\{\s*canonical:/)
  assert.match(topicPageSource, /contentService\.getPosts\.server/)
  assert.match(topicPageSource, /decodeTopicParam/)
  assert.match(topicPageSource, /buildPostUrl/)
})

test('blog post tags link to stable topic pages', () => {
  assert.match(blogListViewSource, /buildTopicUrl\(label\.name\)/)
  assert.match(blogListViewSource, /PostTagLink/)
})


test('blog rows avoid nested anchors by using separate title and topic links', () => {
  assert.match(blogStylesSource, /export const PostRow = styled\.div/)
  assert.match(blogListViewSource, /PostTitleLink href=\{buildPostUrl\(post\.number\)\}/)
  assert.match(blogListViewSource, /PostTagLink key=\{`\$\{post.id\}-\$\{label.name\}`\} href=\{buildTopicUrl\(label.name\)\}/)
})
