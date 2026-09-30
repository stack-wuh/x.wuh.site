import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const componentDir = dirname(fileURLToPath(import.meta.url))
const indexSource = await readFile(resolve(componentDir, 'index.tsx'), 'utf8')
const stylesSource = await readFile(resolve(componentDir, 'styles/index.tsx'), 'utf8')
const specsSource = await readFile(resolve(componentDir, 'specs.tsx'), 'utf8')

test('Progress follows component folder structure', () => {
  assert.match(indexSource, /from '\.\/styles'/)
  assert.match(indexSource, /from '\.\/specs'/)
  assert.match(stylesSource, /export const STrack/)
  assert.match(stylesSource, /export const SFill/)
  assert.match(stylesSource, /export const SStroke/)
  assert.match(stylesSource, /export const SThumb/)
  assert.match(specsSource, /export interface ProgressProps/)
})

test('Progress is dual-mode: display progressbar plus native range interactive', () => {
  assert.match(indexSource, /'use client'/)
  assert.match(indexSource, /role='progressbar'/)
  assert.match(indexSource, /aria-valuenow/)
  assert.match(indexSource, /type='range'/)
  assert.match(indexSource, /onChange/)
  // 交互态必须有无障碍名（原生 slider 语义零降级）；默认 label 已迁 i18n 词典，守卫改断言 t() 兜底形状
  assert.match(indexSource, /aria-label=\{label \?\? t\('components\.progress\.defaultLabel'\)\}/)
})

test('Progress renders the intaglio seal thumb with glyph and breathing props', () => {
  assert.match(specsSource, /glyph\?: string/)
  assert.match(specsSource, /breathing\?: boolean/)
  assert.match(indexSource, /glyph = '樂'/)
  // 呼吸动画条件插值必须用 css`` 包裹（裸模板串会在运行时抛
  // interpolating a keyframe declaration into an untagged string 崩掉整页）
  assert.match(stylesSource, /\$breathing \? css`\$\{breathe\}/)
})

test('Progress styles use theme tokens only', () => {
  assert.doesNotMatch(stylesSource, /#[0-9a-fA-F]{3,8}\b/)
  assert.doesNotMatch(stylesSource, /--motion-/)
  assert.doesNotMatch(stylesSource, /--text-secondary/)
})

test('Progress carries reduced-motion downgrades', () => {
  const reducedBlocks = stylesSource.match(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?(?=\n`)/g) ?? []
  assert.ok(reducedBlocks.length >= 4, 'bar/fill/stroke/thumb each carry a downgrade block')
  assert.ok((stylesSource.match(/animation: none/g) ?? []).length >= 2, 'stroke and thumb stop animating')
  assert.match(stylesSource, /transition: none/, 'fill transition disabled under reduced motion')
})

test('Progress does not attach scroll or resize listeners', () => {
  assert.doesNotMatch(indexSource, /addEventListener/)
})

test('Progress keeps breathing and travel keyframes local and named', () => {
  assert.match(stylesSource, /const inkTravel = keyframes`/)
  assert.match(stylesSource, /const breathe = keyframes`/)
})

test('interactive range expands touch target to 44px on coarse pointers', () => {
  assert.match(stylesSource, /@media \(pointer: coarse\)/)
  const rangeBlock = stylesSource.slice(stylesSource.indexOf('export const SRange'))
  const coarseBlock = rangeBlock.match(/@media \(pointer: coarse\)[\s\S]*?\n  \}/)?.[0] ?? ''
  assert.ok(coarseBlock.length > 0, 'SRange needs a coarse-pointer block')
  assert.match(coarseBlock, /calc\(50% - 22px\)/, 'vertical hit area must reach 44px centred')
})

test('non-finite values (NaN from zero-duration math) clamp to 0 instead of poisoning the slider', () => {
  assert.match(indexSource, /Number\.isFinite/)
})
