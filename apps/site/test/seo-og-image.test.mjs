import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const read = (relative) => readFile(resolve(appRoot, relative), 'utf8')

const seoSource = await read('app/lib/seo.ts')
const rootLayoutSource = await read('app/layout.tsx')
const sectionPagePaths = [
  'app/page.tsx',
  'app/blog/page.tsx',
  'app/about/page.tsx',
  'app/about/layout.tsx',
  'app/music/page.tsx',
  'app/footprint/layout.tsx',
  'app/weread/page.tsx',
  'app/topics/[label]/page.tsx',
]
const sectionSources = Object.fromEntries(
  await Promise.all(sectionPagePaths.map(async (p) => [p, await read(p)]))
)

test('seo.ts provides a shared section metadata builder with default OG image and large card', () => {
  assert.match(seoSource, /export function buildSectionMetadata/)
  const builderBody = seoSource.slice(seoSource.indexOf('export function buildSectionMetadata'))
  assert.match(builderBody, /DEFAULT_OG_IMAGE_PATH/)
  assert.match(builderBody, /1200/)
  assert.match(builderBody, /630/)
  assert.match(builderBody, /summary_large_image/)
})

test('root layout keeps the default OG image and large card as the safety net', () => {
  assert.match(rootLayoutSource, /og-default\.png/)
  assert.match(rootLayoutSource, /summary_large_image/)
})

test('every section page composes social metadata through the shared builder', () => {
  const consumerPages = sectionPagePaths.filter((p) => p !== 'app/about/layout.tsx')
  for (const page of consumerPages) {
    assert.match(sectionSources[page], /buildSectionMetadata\(/, `${page} must use buildSectionMetadata`)
  }
})

test('section pages no longer declare a degraded summary card', () => {
  for (const [page, source] of Object.entries(sectionSources)) {
    assert.doesNotMatch(source, /card:\s*["']summary["']/, `${page} must not declare card: summary`)
  }
})

test('about layout no longer shadows parent social metadata', () => {
  assert.doesNotMatch(sectionSources['app/about/layout.tsx'], /openGraph|twitter/)
})
