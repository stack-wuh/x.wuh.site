import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { buildStaticSitemapRoutes } from '../app/lib/sitemap-utils.ts'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const archivePagePath = resolve(appRoot, 'app/archive/page.tsx')
const blogListViewSource = await readFile(resolve(appRoot, 'app/blog/BlogListView.tsx'), 'utf8')
const blogStylesSource = await readFile(resolve(appRoot, 'app/blog/styles/index.ts'), 'utf8')
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
  assert.match(archivePageSource, /if \(error \|\| !data\) \{\s*return posts\s*\}/)
  assert.match(archivePageSource, /buildPostUrl\(post.number, post.title\)/)
  assert.match(archivePageSource, /buildTopicUrl\(label.name\)/)
})

test('blog page places the archive link in the filter toolbar and preserves the header actions', () => {
  const headerActions = blogListViewSource.match(/<S\.HeaderActions>([\s\S]*?)<\/S\.HeaderActions>/)?.[1] || ''
  const filterToolbar = blogListViewSource.match(/<S\.FilterToolbar>([\s\S]*?)<\/S\.FilterToolbar>/)?.[1] || ''

  assert.doesNotMatch(headerActions, /href='\/archive'/)
  assert.match(filterToolbar, /<S\.ArchiveLink href='\/archive'>归档<\/S\.ArchiveLink>/)
  assert.match(blogStylesSource, /export const ArchiveLink = styled\(Link\)`[\s\S]*?margin-left: auto;/)
})

test('blog post title link fills the row so metadata remains right-aligned', () => {
  assert.match(blogStylesSource, /export const PostTitleLink = styled\(Link\)`[\s\S]*?flex: 1 1 0;/)
})

test('blog post rows do not advertise full-row click behavior', () => {
  const postRowStyles = blogStylesSource.match(/export const PostRow = styled\.div`([\s\S]*?)`/)?.[1] || ''

  assert.doesNotMatch(postRowStyles, /&:hover|padding-left:/)
})
