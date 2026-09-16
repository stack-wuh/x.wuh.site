import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const componentDir = dirname(fileURLToPath(import.meta.url))
const indexSource = await readFile(resolve(componentDir, 'index.tsx'), 'utf8')
const stylesSource = await readFile(resolve(componentDir, 'styles/index.tsx'), 'utf8')
const specsSource = await readFile(resolve(componentDir, 'specs.tsx'), 'utf8')

test('Dialog follows component folder structure', () => {
  assert.match(indexSource, /from '\.\/styles'/)
  assert.match(indexSource, /from '\.\/specs'/)
  assert.match(stylesSource, /export const DialogSurface/)
  assert.match(specsSource, /export interface DialogProps/)
})

/* ===== paper 变体（20260916-style-contact-dialog-paper）===== */

test('DialogProps declares variant with paper value', () => {
  assert.match(specsSource, /variant\?:\s*'default'\s*\|\s*'paper'/)
})

test('index destructures variant with default and passes $variant transient props', () => {
  assert.match(indexSource, /variant = 'default'/)
  const passes = (indexSource.match(/\$variant=\{variant\}/g) || []).length
  assert.ok(passes >= 3, `expected $variant passed to >=3 styled nodes, got ${passes}`)
})

test('paper surface uses paper-language tokens', () => {
  // 发丝线边框 + soft 阴影 + base 圆角，且仅在 $variant === 'paper' 分支生效
  assert.match(stylesSource, /\$variant === 'paper'/)
  assert.match(stylesSource, /color-mix\(in oklab, var\(--normal-300\) 45%, transparent\)/)
  assert.match(stylesSource, /--elevation-soft/)
  assert.match(stylesSource, /--border-radius-base/)
})

test('paper header divider is a fading ink line (transport同源)', () => {
  assert.match(stylesSource, /linear-gradient\(\s*90deg/)
  assert.match(stylesSource, /color-mix\(in oklab, var\(--primary-color\) 45%, var\(--normal-300\)\)/)
})

test('default variant keeps legacy geometry untouched', () => {
  // 既有默认值不得被 paper 分支改写：中心 16px 圆角与通用发丝分割线仍在
  assert.match(stylesSource, /return '16px'/)
  assert.match(stylesSource, /border-bottom: 1px solid color-mix\(in oklab, var\(--normal-200\) 60%, transparent\)/)
})

test('bottom placement geometry survives variant', () => {
  assert.match(stylesSource, /'16px 16px 0 0'/)
  assert.match(stylesSource, /'80vh'/)
})

test('44px close button touch target survives variant', () => {
  assert.match(stylesSource, /min-width: 44px/)
  assert.match(stylesSource, /min-height: 44px/)
})
