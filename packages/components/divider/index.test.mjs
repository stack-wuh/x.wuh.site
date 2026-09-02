import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const componentDir = dirname(fileURLToPath(import.meta.url))
const indexSource = await readFile(resolve(componentDir, 'index.tsx'), 'utf8')
const stylesSource = await readFile(resolve(componentDir, 'styles/index.tsx'), 'utf8')
const specsSource = await readFile(resolve(componentDir, 'specs.tsx'), 'utf8')

test('Divider follows component folder structure', () => {
  assert.match(indexSource, /from '\.\/styles'/)
  assert.match(indexSource, /from '\.\/specs'/)
  assert.match(stylesSource, /export const SDivider/)
  assert.match(stylesSource, /export const SOrnament/)
  assert.match(specsSource, /export interface DividerProps/)
})

test('Divider defaults to hairline variant and supports separator semantics', () => {
  assert.match(indexSource, /variant = 'hairline'/)
  assert.match(indexSource, /role='separator'/)
})

test('Divider uses theme tokens only (no prefers-color-scheme, no hardcoded colors)', () => {
  assert.doesNotMatch(stylesSource + indexSource, /prefers-color-scheme/)
  assert.doesNotMatch(stylesSource, /#[0-9a-fA-F]{3,8}\b/)
})
