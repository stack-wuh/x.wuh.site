import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createCollectionPageStructuredData } from '../app/lib/structured-data.ts'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const topicPageSource = await readFile(resolve(appRoot, 'app/topics/[label]/page.tsx'), 'utf8')

test('creates a CollectionPage with canonical item list entries', () => {
  const data = createCollectionPageStructuredData({
    url: 'https://wuh.site/topics/Next.js',
    name: 'Next.js 相关文章',
    description: 'Next.js 主题文章。',
    items: [
      { name: '文章一', url: 'https://wuh.site/post/1-one' },
      { name: '文章二', url: 'https://wuh.site/post/2-two' },
    ],
  })

  assert.equal(data['@type'], 'CollectionPage')
  assert.equal(data.mainEntity['@type'], 'ItemList')
  assert.equal(data.mainEntity.numberOfItems, 2)
  assert.deepEqual(data.mainEntity.itemListElement.map((item) => item.position), [1, 2])
  assert.equal(data.mainEntity.itemListElement[1].item, 'https://wuh.site/post/2-two')
})

test('topic page renders collection structured data', () => {
  assert.match(topicPageSource, /createCollectionPageStructuredData/)
  assert.match(topicPageSource, /<JsonLd data=\{collectionJsonLd\}/)
})
