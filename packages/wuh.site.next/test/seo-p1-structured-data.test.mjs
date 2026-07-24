import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import {
  createArticleStructuredData,
  createBreadcrumbStructuredData,
  createSiteStructuredData,
} from '../app/lib/structured-data.ts'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const rootLayoutSource = await readFile(resolve(appRoot, 'app/layout.tsx'), 'utf8')
const postPageSource = await readFile(resolve(appRoot, 'app/post/[number]/page.tsx'), 'utf8')
const postViewSource = await readFile(resolve(appRoot, 'app/post/PostView.tsx'), 'utf8')

test('creates WebSite and Person entities in a single graph', () => {
  const data = createSiteStructuredData()

  assert.equal(data['@context'], 'https://schema.org')
  assert.deepEqual(data['@graph'].map((entry) => entry['@type']), ['WebSite', 'Person'])
})

test('creates a complete BlogPosting with optional content fields', () => {
  const data = createArticleStructuredData({
    url: 'https://wuh.site/post/123-nextjs-seo',
    title: 'Next.js SEO',
    description: '文章摘要',
    publishedAt: '2026-07-20T00:00:00.000Z',
    modifiedAt: '2026-07-21T00:00:00.000Z',
    image: 'https://cdn.wuh.site/cover.png',
    imageAlt: 'SEO 封面',
    keywords: ['Next.js', 'SEO'],
    labels: ['前端'],
  })

  assert.equal(data['@type'], 'BlogPosting')
  assert.equal(data.mainEntityOfPage['@id'], data.url)
  assert.equal(data.inLanguage, 'zh-CN')
  assert.equal(data.keywords, 'Next.js, SEO')
  assert.equal(data.articleSection, '前端')
  assert.equal(data.author.name, 'shadow')
  assert.equal(data.publisher.url, 'https://wuh.site/about')
  assert.equal(data.image.caption, 'SEO 封面')
})

test('omits absent optional BlogPosting fields instead of emitting undefined', () => {
  const data = createArticleStructuredData({
    url: 'https://wuh.site/post/123-nextjs-seo',
    title: 'Next.js SEO',
    description: '文章摘要',
    publishedAt: '2026-07-20T00:00:00.000Z',
  })

  assert.equal('image' in data, false)
  assert.equal('keywords' in data, false)
  assert.equal('articleSection' in data, false)
})

test('creates breadcrumb list items with stable positions and URLs', () => {
  const data = createBreadcrumbStructuredData([
    { name: '首页', url: 'https://wuh.site/' },
    { name: '博客', url: 'https://wuh.site/blog' },
    { name: 'Next.js SEO', url: 'https://wuh.site/post/123-nextjs-seo' },
  ])

  assert.equal(data['@type'], 'BreadcrumbList')
  assert.deepEqual(data.itemListElement.map((item) => item.position), [1, 2, 3])
  assert.equal(data.itemListElement[2].item, 'https://wuh.site/post/123-nextjs-seo')
})

test('root layout renders site structured data', () => {
  assert.match(rootLayoutSource, /createSiteStructuredData/)
  assert.match(rootLayoutSource, /<JsonLd data=\{createSiteStructuredData\(\)\}/)
})

test('post page builds article and breadcrumb structured data from the canonical URL', () => {
  assert.match(postPageSource, /createArticleStructuredData/)
  assert.match(postPageSource, /createBreadcrumbStructuredData/)
  assert.match(postPageSource, /name: '首页'/)
  assert.match(postPageSource, /name: '博客'/)
})

test('post view renders an accessible breadcrumb using canonical post URL', () => {
  assert.match(postViewSource, /BreadcrumbNav aria-label='文章面包屑'/)
  assert.match(postViewSource, /href='\/'/)
  assert.match(postViewSource, /href='\/blog'/)
  assert.match(postViewSource, /href=\{buildPostUrl\(issue.number, issue.title\)\}/)
})
