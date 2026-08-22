import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { buildTopicSitemapEntry } from '../app/lib/sitemap-utils.ts'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const sitemapSource = await readFile(resolve(appRoot, 'app/sitemap.ts'), 'utf8')
const blogPageSource = await readFile(resolve(appRoot, 'app/blog/page.tsx'), 'utf8')

test('builds topic sitemap entries using canonical topic URLs', () => {
  const entry = buildTopicSitemapEntry({ name: 'Next.js SEO' })
  assert.equal(entry.url, 'https://wuh.site/topics/Next.js%20SEO')
  assert.equal(entry.changeFrequency, 'weekly')
})

test('sitemap appends topic entries from open labels without query URLs', () => {
  assert.match(sitemapSource, /getLabels\.server/)
  assert.match(sitemapSource, /buildTopicSitemapEntry/)
  assert.doesNotMatch(sitemapSource, /labels=/)
})

test('blog metadata noindexes label query pages but leaves base blog indexable', () => {
  assert.match(blogPageSource, /generateMetadata/)
  assert.match(blogPageSource, /activeLabels\.length > 0/)
  assert.match(blogPageSource, /index:\s*false/)
  assert.match(blogPageSource, /follow:\s*true/)
  assert.match(blogPageSource, /canonical:\s*hasActiveLabels \? `\$\{SITE_URL\}\/blog`/)
})
