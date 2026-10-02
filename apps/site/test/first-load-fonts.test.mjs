import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const read = (relative) => readFile(resolve(appRoot, relative), 'utf8')

const cjkCssSource = await read('app/fonts/cjk.css')
const layoutSource = await read('app/layout.tsx')
const fontPrefetchSource = await read('app/components/FontPrefetch.tsx')

test('sans 700 weight is no longer shipped as a font face', () => {
  assert.doesNotMatch(cjkCssSource, /NotoSansSC-700/)
  assert.match(cjkCssSource, /NotoSansSC-400/)
  assert.match(cjkCssSource, /NotoSerifSC-700/, 'serif 700 stays for titles and seals')
})

test('above-the-fold weights are preloaded before css discovery', () => {
  const preloads = layoutSource.match(/rel=["']preload["'][^>]*as=["']font["']/g) || []
  assert.ok(preloads.length >= 2, `expected serif-400 and sans-400 preloads, got ${preloads.length}`)
  assert.match(layoutSource, /NotoSerifSC-400\.woff2/)
  assert.match(layoutSource, /NotoSansSC-400\.woff2/)
})

test('idle warm-up no longer references the removed sans 700', () => {
  assert.doesNotMatch(fontPrefetchSource, /Noto Sans SC/)
  assert.match(fontPrefetchSource, /Noto Serif SC/)
})
