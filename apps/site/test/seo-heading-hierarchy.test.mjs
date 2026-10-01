import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const read = (relative) => readFile(resolve(appRoot, relative), 'utf8')

const stylesSource = await read('app/styles/index.ts')
const musicLoadingSource = await read('app/music/loading.tsx')

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

test('music streaming skeleton does not render a duplicate h1', () => {
  assert.match(musicLoadingSource, /<PageTitle as=['"]div['"]>/)
  assert.doesNotMatch(musicLoadingSource, /<PageTitle>/)
})
