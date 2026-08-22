import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const personName = '吴尒红（Shadow）'

const indexedMetadataFiles = [
  'app/layout.tsx',
  'app/page.tsx',
  'app/blog/page.tsx',
  'app/topics/[label]/page.tsx',
  'app/about/layout.tsx',
  'app/about/page.tsx',
  'app/weread/page.tsx',
  'app/footprint/layout.tsx',
  'app/guestbook/page.tsx',
]

test('所有可索引页面 metadata 均包含统一姓名', async () => {
  const files = await Promise.all(indexedMetadataFiles.map(async (path) => ({
    path,
    source: await readFile(resolve(appRoot, path), 'utf8'),
  })))

  for (const { path, source } of files) {
    assert.match(source, /(吴尒红（Shadow）|AUTHOR_NAME|SITE_DESCRIPTION)/, `${path} 应包含 ${personName} 或作者相关常量引用`)
  }
})

test('内部 noindex 调试页保持非索引状态', async () => {
  const source = await readFile(resolve(appRoot, 'app/design/system-color/layout.tsx'), 'utf8')
  assert.match(source, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/)
})

test('结构化数据统一作者姓名与 GitHub 身份', async () => {
  const [structuredData, seo] = await Promise.all([
    readFile(resolve(appRoot, 'app/lib/structured-data.ts'), 'utf8'),
    readFile(resolve(appRoot, 'app/lib/seo.ts'), 'utf8'),
  ])

  assert.match(structuredData, /(吴尒红（Shadow）|AUTHOR_NAME)/)
  assert.match(seo, /(吴尒红（Shadow）|AUTHOR_NAME)/)
  assert.match(structuredData, /(https:\/\/github\.com\/stack-wuh|AUTHOR_URL)/)
  assert.match(seo, /(https:\/\/github\.com\/stack-wuh|AUTHOR_URL)/)
})

test('文章 description 继续使用内容摘要', async () => {
  const source = await readFile(resolve(appRoot, 'app/lib/seo.ts'), 'utf8')
  assert.match(source, /if \(cmsSummary\) return cmsSummary/)
  assert.match(source, /extractFirstParagraphText\(body\)/)
  assert.doesNotMatch(source, /buildArticleDescription[\s\S]*?吴尒红（Shadow）[\s\S]*?getArticleKeywords/)
})
