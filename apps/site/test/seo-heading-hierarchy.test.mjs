import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const read = (relative) => readFile(resolve(appRoot, relative), 'utf8')

async function fileExists(relative) {
  try {
    await access(resolve(appRoot, relative))
    return true
  } catch {
    return false
  }
}

const stylesSource = await read('app/styles/index.ts')

test('site title carries the single h1 semantic for the home page', () => {
  assert.match(stylesSource, /export const SiteTitle = styled\.h1/)
})

test('h1 default margin is fully reset to preserve the hero layout', () => {
  const start = stylesSource.indexOf('export const SiteTitle')
  const end = stylesSource.indexOf('export const', start + 10)
  const block = stylesSource.slice(start, end)
  assert.match(block, /margin:\s*var\(--space-xs\)\s+0\s+0/)
  assert.doesNotMatch(block, /margin-top:/)
})

test('music streaming skeleton is removed entirely, leaving the real h1 as the only one', async () => {
  assert.equal(await fileExists('app/music/loading.tsx'), false, 'skeleton file must not exist')
})
