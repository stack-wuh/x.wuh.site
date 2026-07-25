import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const [seoSource, pageSource] = await Promise.all([
  readFile(resolve(appRoot, 'app/lib/seo.ts'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/[number]/page.tsx'), 'utf8'),
])

test('SEO builder 集中处理摘要、图片、关键词、分类和 JSON-LD', () => {
  assert.match(seoSource, /export const DEFAULT_OG_IMAGE_PATH = '\/og-default\.png'/)
  assert.match(seoSource, /export function buildArticleDescription\(/)
  assert.match(seoSource, /const cmsSummary = getMetadata\(issue\)\?\.summary\?\.trim\(\)/)
  assert.match(seoSource, /export function getArticleKeywords\(/)
  assert.match(seoSource, /export function getArticleCategory\(/)
  assert.match(seoSource, /getMetadata\(issue\)\?\.extra\?\.category/)
  assert.match(seoSource, /export function getArticleImage\(/)
  assert.match(seoSource, /export function buildArticleMetadata\(/)
  assert.match(seoSource, /authors: \[author\]/)
  assert.match(seoSource, /keywords,/)
  assert.match(seoSource, /category,/)
  assert.match(seoSource, /export function buildBlogPostingJsonLd\(/)
  assert.match(seoSource, /export function buildProfilePageJsonLd\(/)
})

test('文章页面复用统一 SEO builder，移除正则摘要', () => {
  assert.match(pageSource, /buildArticleMetadata/)
  assert.match(pageSource, /buildBlogPostingJsonLd/)
  assert.doesNotMatch(pageSource, /issue\.body\.replace\(\//)
})
