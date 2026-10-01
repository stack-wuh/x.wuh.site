import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const repoRoot = resolve(appRoot, '../..')
const read = (relative) => readFile(resolve(repoRoot, relative), 'utf8')

const imageSource = await read('packages/components/image/index.tsx')
const postCoverSource = await read('apps/site/app/post/components/PostCover/index.tsx')

test('priority maps to an explicit high fetchPriority on the img element', () => {
  assert.match(imageSource, /const resolvedFetchPriority = priority \? \('high' as const\) : undefined/)
  assert.match(imageSource, /fetchPriority=\{resolvedFetchPriority\}/)
})

test('post cover declares realistic sizes instead of the fill-mode 100vw default', () => {
  assert.match(postCoverSource, /sizes=['"]\(max-width:\s*1023px\)\s+100vw,\s*526px['"]/)
})
