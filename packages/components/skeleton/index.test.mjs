import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const componentDir = dirname(fileURLToPath(import.meta.url))
const indexSource = await readFile(resolve(componentDir, 'index.tsx'), 'utf8')
const stylesSource = await readFile(resolve(componentDir, 'styles/index.tsx'), 'utf8')
const specsSource = await readFile(resolve(componentDir, 'types.ts'), 'utf8')

test('Skeleton follows component folder structure', () => {
  assert.match(indexSource, /from '\.\/styles'/)
  assert.match(indexSource, /from '\.\/types'/)
  assert.match(stylesSource, /export const SkeletonRoot/)
  assert.match(specsSource, /export type SkeletonProps/)
})
