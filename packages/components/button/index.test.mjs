import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const componentDir = dirname(fileURLToPath(import.meta.url))
const indexSource = await readFile(resolve(componentDir, 'index.tsx'), 'utf8')
const stylesSource = await readFile(resolve(componentDir, 'styles/index.tsx'), 'utf8')
const specsSource = await readFile(resolve(componentDir, 'specs.tsx'), 'utf8')
const readmeSource = await readFile(resolve(componentDir, 'README.md'), 'utf8')

test('Button follows component folder structure', () => {
  assert.match(indexSource, /from '\.\/styles'/)
  assert.match(indexSource, /from '\.\/specs'/)
  assert.match(stylesSource, /export const StyledButton/)
  assert.match(stylesSource, /export const StyledLink/)
  assert.match(specsSource, /export interface ButtonProps/)
  assert.match(readmeSource, /# Button/)
})
