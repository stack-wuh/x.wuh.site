import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const [layoutSource, aboutSource, sitemapSource, defaultImage] = await Promise.all([
  readFile(resolve(appRoot, 'app/layout.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/about/page.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/sitemap.ts'), 'utf8'),
  readFile(resolve(appRoot, 'public/og-default.png')),
])

test('全站默认分享图片资源为 1200×630 PNG', () => {
  assert.deepEqual([...defaultImage.subarray(0, 8)], [
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ])
  assert.equal(defaultImage.readUInt32BE(16), 1200)
  assert.equal(defaultImage.readUInt32BE(20), 630)
})

test('根 layout 配置默认 Open Graph 与 Twitter 大图 metadata', () => {
  assert.match(layoutSource, /openGraph:\s*\{[\s\S]*images:\s*\[[\s\S]*og-default\.png/)
  assert.match(layoutSource, /twitter:\s*\{[\s\S]*card:\s*['"]summary_large_image['"]/)
  assert.match(layoutSource, /twitter:\s*\{[\s\S]*images:\s*\[[\s\S]*og-default\.png/)
  assert.match(layoutSource, /metadataBase:\s*new URL\('https:\/\/wuh\.site'\)/)
})


test('About 页面输出 ProfilePage JSON-LD 并关联站点 Person', () => {
  assert.match(aboutSource, /buildProfilePageJsonLd/)
  assert.match(aboutSource, /<JsonLd[\s\S]*data=/)
  assert.match(aboutSource, /ProfilePage/)
})


test('工具目录不使用 Next metadata route 保留文件名 sitemap.ts', async () => {
  await assert.rejects(
    readFile(resolve(appRoot, 'app/lib/sitemap.ts'), 'utf8'),
    /ENOENT/,
  )
  const appSitemapSource = await readFile(resolve(appRoot, 'app/sitemap.ts'), 'utf8')
  assert.match(appSitemapSource, /\.\/lib\/sitemap-utils/)
})


test('sitemap 构建阶段 API 失败时降级而不是抛错', () => {
  assert.doesNotMatch(sitemapSource, /throw new Error\(['"]Failed to load sitemap/)
  assert.match(sitemapSource, /return \[\]/)
})

test('sitemap API 失败时写入可观测错误日志', () => {
  assert.match(sitemapSource, /logSitemapFetchError/)
  assert.match(sitemapSource, /process\.stderr\.write/)
})
