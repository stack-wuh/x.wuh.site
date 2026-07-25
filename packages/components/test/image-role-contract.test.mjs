import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(testDir, '..')
const imageSource = await readFile(resolve(packageRoot, 'image/index.tsx'), 'utf8')
const stylesSource = await readFile(resolve(packageRoot, 'image/styles/index.tsx'), 'utf8')

const roles = ['avatar', 'book-cover', 'content', 'cover', 'thumbnail', 'logo', 'qr']

test('Image 声明完整语义角色集合', () => {
  assert.match(imageSource, /export type ImageRole/)
  for (const role of roles) assert.match(imageSource, new RegExp(`'${role}'`))
  assert.match(imageSource, /role\?: ImageRole/)
})

test('角色 resolver 使用显式属性覆盖角色默认值', () => {
  assert.match(imageSource, /ROLE_PRESETS/)
  assert.match(imageSource, /borderRadius \?\? preset\?\.borderRadius/)
  assert.match(imageSource, /appearance \?\? preset\?\.appearance/)
  assert.match(imageSource, /variant \?\? preset\?\.variant/)
})

test('Image 为内部图片提供 className 和 style 通道', () => {
  assert.match(imageSource, /imageClassName\?: string/)
  assert.match(imageSource, /imageStyle\?: React\.CSSProperties/)
  assert.match(imageSource, /className=\{imageClassName\}/)
  assert.match(imageSource, /style=\{imageStyle\}/)
})

test('未传 role 时保留兼容默认值并仅在开发环境提示', () => {
  assert.match(imageSource, /process\.env\.NODE_ENV !== 'production'/)
  assert.match(imageSource, /!role/)
  assert.match(imageSource, /console\.warn/)
  assert.match(imageSource, /var\(--border-radius-lg, 16px\)/)
})

test('角色视觉由 Wrapper 和状态层统一承载', () => {
  assert.match(stylesSource, /\$role: ImageRole \| undefined/)
  assert.match(stylesSource, /\$compactFallback/)
  assert.match(stylesSource, /border-radius:\s*inherit/)
  assert.match(stylesSource, /prefers-reduced-motion:\s*reduce/)
})

test('plain 角色的默认错误态保持透明背景', () => {
  assert.match(imageSource, /<DefaultFallback compact=\{compactFallback\} appearance=\{resolvedAppearance\}/)
  assert.match(stylesSource, /\$appearance: ImageAppearance/)
  assert.match(stylesSource, /p\.\$appearance === 'plain' \? 'transparent'/)
})

test('角色预设符合已确认视觉基线', () => {
  assert.match(imageSource, /'book-cover':[\s\S]*borderRadius: '2px'[\s\S]*variant: 'contain'/)
  assert.match(imageSource, /avatar:[\s\S]*borderRadius: '50%'[\s\S]*appearance: 'plain'/)
  assert.match(imageSource, /logo:[\s\S]*borderRadius: '0'[\s\S]*appearance: 'plain'/)
  assert.match(imageSource, /qr:[\s\S]*borderRadius: '2px'[\s\S]*variant: 'contain'/)
})
