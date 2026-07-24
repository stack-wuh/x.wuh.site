import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { buildStaticSitemapRoutes } from '../app/lib/sitemap.ts'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const archivePagePath = resolve(appRoot, 'app/archive/page.tsx')
const blogListViewSource = await readFile(resolve(appRoot, 'app/blog/BlogListView.tsx'), 'utf8')
let archivePageSource = ''
try {
  archivePageSource = await readFile(archivePagePath, 'utf8')
} catch {}

test('static sitemap includes the archive page', () => {
  const urls = buildStaticSitemapRoutes().map((route) => route.url)
  assert.equal(urls.includes('https://wuh.site/archive'), true)
})

test('archive page exposes canonical metadata and canonical post/topic links', () => {
  assert.match(archivePageSource, /export const metadata/)
  assert.match(archivePageSource, /canonical:\s*`?\$\{SITE_URL\}\/archive`?/)
  assert.match(archivePageSource, /while \(true\)/)
  assert.match(archivePageSource, /contentService\.getPosts\.server/)
  assert.match(archivePageSource, /buildPostUrl\(post.number, post.title\)/)
  assert.match(archivePageSource, /buildTopicUrl\(label.name\)/)
})

test('blog page header links to archive', () => {
  assert.match(blogListViewSource, /href='\/archive'/)
  assert.match(blogListViewSource, /归档/)
})
