import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { buildPostUrl, isCanonicalPostPath } from '../app/lib/slug.ts'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const postPageSource = await readFile(resolve(appRoot, 'app/post/[number]/page.tsx'), 'utf8')
const homePageSource = await readFile(resolve(appRoot, 'app/page.tsx'), 'utf8')
const rootLayoutSource = await readFile(resolve(appRoot, 'app/layout.tsx'), 'utf8')
const designLayoutPath = resolve(appRoot, 'app/design/system-color/layout.tsx')
let designLayoutSource = ''
try {
  designLayoutSource = await readFile(designLayoutPath, 'utf8')
} catch {}

test('builds a canonical post URL from number and title', () => {
  assert.equal(buildPostUrl(123, 'Next.js #15 / SEO'), '/post/123-Next.js-15-SEO')
})

test('accepts only the current canonical post path', () => {
  assert.equal(isCanonicalPostPath('123-Next.js-15-SEO', 123, 'Next.js #15 / SEO'), true)
  assert.equal(isCanonicalPostPath('123', 123, 'Next.js #15 / SEO'), false)
  assert.equal(isCanonicalPostPath('123-old-title', 123, 'Next.js #15 / SEO'), false)
})

test('post SEO rendering does not depend on request cookies and uses ISR', () => {
  assert.doesNotMatch(postPageSource, /from ['"]next\/headers['"]|cookies\(/)
  assert.match(postPageSource, /revalidate:\s*3600/)
})

test('post page redirects non-canonical paths permanently', () => {
  assert.match(postPageSource, /permanentRedirect/)
  assert.match(postPageSource, /isCanonicalPostPath/)
})

test('home page fetches data at runtime to avoid build-time empty cache', () => {
  assert.match(homePageSource, /export const dynamic = 'force-dynamic'/)
  assert.match(homePageSource, /revalidate:\s*1800/)
})

test('sitemap uses the canonical slug URL', async () => {
  const { buildPostSitemapEntry } = await import('../app/lib/sitemap-utils.ts')
  const entry = buildPostSitemapEntry({
    number: 123,
    title: 'Next.js SEO',
    updatedAtGitHub: '2026-07-20T00:00:00.000Z',
    createdAtGitHub: '2026-07-19T00:00:00.000Z',
  })

  assert.equal(entry.url, 'https://wuh.site/post/123-Next.js-SEO')
  assert.equal(entry.lastModified.toISOString(), '2026-07-20T00:00:00.000Z')
})

test('static sitemap excludes the design token debug page', async () => {
  const { buildStaticSitemapRoutes } = await import('../app/lib/sitemap-utils.ts')
  const urls = buildStaticSitemapRoutes().map((route) => route.url)
  assert.equal(urls.includes('https://wuh.site/design/system-color'), false)
  assert.equal(urls.includes('https://wuh.site/blog'), true)
})

test('root metadata provides a title template and default description', () => {
  assert.match(rootLayoutSource, /title:\s*\{/) 
  assert.match(rootLayoutSource, /template:\s*['"]%s · wuh\.site['"]/) 
  assert.match(rootLayoutSource, /description:/)
})

test('design token page is noindex', () => {
  assert.match(designLayoutSource, /index:\s*false/)
  assert.match(designLayoutSource, /follow:\s*false/)
})
