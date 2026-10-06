import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const componentDir = dirname(fileURLToPath(import.meta.url))
const indexSource = await readFile(resolve(componentDir, 'index.tsx'), 'utf8')

test('Row is a grid container with 12-column default', () => {
  assert.match(indexSource, /display: \$\{\(props\) => \(props\.\$inline \? 'inline-grid' : 'grid'\)\}/)
  assert.match(indexSource, /responsive\(props\.\$cols \?\? 12, \(v\) => `grid-template-columns: repeat\(\$\{v\}, 1fr\);`/)
  assert.doesNotMatch(indexSource, /margin: -/)
})

test('Row props take breakpoint slots and resolve gap via spacing tokens', () => {
  assert.match(indexSource, /cols\?: TResponsive<number>/)
  assert.match(indexSource, /gap\?: TResponsive<TRowSpaceValue>/)
  assert.match(indexSource, /alignItems\?: TResponsive<TGridAlign>/)
  assert.match(indexSource, /justifyContent\?: TResponsive<TGridJustify>/)
  assert.match(indexSource, /responsive\(props\.\$gap[\s\S]*?getSpacingValue/)
})

test('Row grid vocabulary is start/end based, not flex legacy aliases', () => {
  assert.match(indexSource, /const gridAlignOptions = \['start', 'center', 'end', 'stretch'\]/)
  assert.match(indexSource, /const gridJustifyOptions = \[\s*'start',\s*'center',\s*'end',\s*'space-between',\s*'space-around',\s*'space-evenly',/)
})

test('Row layout props never leak to the DOM', () => {
  assert.match(indexSource, /const ROW_ONLY_KEYS: \(keyof IRowProps\)\[\] = \[/)
  assert.match(indexSource, /ROW_ONLY_KEYS\.forEach\(\(key\) => delete/)
  assert.match(indexSource, /React\.forwardRef<HTMLDivElement, IRowProps>/)
})

test('Row obeys component-package style discipline', () => {
  // styled-components 内部 useContext(ThemeContext)，消费惯例要求客户端边界
  assert.match(indexSource, /^'use client'/)
  assert.doesNotMatch(indexSource, /#[0-9a-fA-F]{3,8}\b/)
  assert.doesNotMatch(indexSource, /--motion-/)
  assert.doesNotMatch(indexSource, /@media/)
  assert.doesNotMatch(indexSource, /\b(640|520|1024|768|480|560|767)\b/)
  assert.doesNotMatch(indexSource, /from 'next|from "next/)
  assert.doesNotMatch(indexSource, /addEventListener/)
})
