import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const componentDir = dirname(fileURLToPath(import.meta.url))
const indexSource = await readFile(resolve(componentDir, 'index.tsx'), 'utf8')

test('Col renders grid-column span placement, default full-row stack', () => {
  assert.match(indexSource, /grid-column: \$\{offset \+ 1\} \/ span \$\{span\}/)
  assert.match(indexSource, /`grid-column: span \$\{span\};`/)
  assert.match(indexSource, /ladderSlots\(props\.span \?\? 12\)/)
})

test('span and offset compose jointly per ladder rung (carry-forward), never per-prop', () => {
  assert.match(indexSource, /const rungs = RESPONSIVE_LADDER\.length \+ 1/)
  // a rung emits a grid-column block only when either prop declares a slot there
  assert.match(
    indexSource,
    /const hasSlot = spanSlots\[tier\] !== undefined \|\| offsetSlots\[tier\] !== undefined/,
    'missing rungs skip; present rungs must not be split across two media blocks',
  )
  // missing side inherits the last defined value via carry-forward
  assert.match(indexSource, /span: spanSlots\[tier\] \?\? carry\.span/)
  assert.match(indexSource, /offset: offsetSlots\[tier\] \?\? carry\.offset/)
  // no upper slots collapse to a scalar base, so no empty media blocks are emitted
  assert.match(indexSource, /const hasUpperSlot = spanSlots\.length > 1 \|\| offsetSlots\.length > 1/)
  assert.match(indexSource, /hasUpperSlot \? placements : placements\[0\]/)
})

test('Col props are breakpoint-slot typed and order/alignSelf pass through', () => {
  assert.match(indexSource, /span\?: TResponsive<number>/)
  assert.match(indexSource, /offset\?: TResponsive<number>/)
  assert.match(indexSource, /order\?: TResponsive<number>/)
  assert.match(indexSource, /alignSelf\?: TResponsive<TColAlignSelf>/)
  assert.match(indexSource, /responsive\(props\.\$order, \(v\) => `order: \$\{v\};`\)/)
})

test('Col resets grid item min-width so spans stay shrinkable', () => {
  assert.match(indexSource, /min-width: 0;/)
})

test('Col layout props never leak to the DOM', () => {
  assert.match(indexSource, /const COL_ONLY_KEYS: \(keyof IColProps\)\[\] = \[/)
  assert.match(indexSource, /COL_ONLY_KEYS\.forEach\(\(key\) => delete/)
  assert.match(indexSource, /React\.forwardRef<HTMLDivElement, IColProps>/)
})

test('Col obeys component-package style discipline', () => {
  // styled-components 内部 useContext(ThemeContext)，消费惯例要求客户端边界
  assert.match(indexSource, /^'use client'/)
  assert.doesNotMatch(indexSource, /#[0-9a-fA-F]{3,8}\b/)
  assert.doesNotMatch(indexSource, /--motion-/)
  assert.doesNotMatch(indexSource, /@media/)
  assert.doesNotMatch(indexSource, /\b(640|520|1024|768|480|560|767)\b/)
  assert.doesNotMatch(indexSource, /from 'next|from "next/)
  assert.doesNotMatch(indexSource, /addEventListener/)
})
