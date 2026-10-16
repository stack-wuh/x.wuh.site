import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const componentDir = dirname(fileURLToPath(import.meta.url))
const indexSource = await readFile(resolve(componentDir, 'index.tsx'), 'utf8')
const stylesSource = await readFile(resolve(componentDir, 'styles/index.tsx'), 'utf8')
const specsSource = await readFile(resolve(componentDir, 'types.ts'), 'utf8')

test('Image follows component folder structure', () => {
  assert.match(indexSource, /from '\.\/styles'/)
  assert.match(indexSource, /from '\.\/types'/)
  assert.match(stylesSource, /export const Wrapper/)
  assert.match(specsSource, /export interface ImageProps/)
})

test('INV-1 cached images skip skeleton and fade (complete-check直达 loaded)', () => {
  // 缓存命中检查：img.complete + naturalWidth > 0 才可信（error 时 naturalWidth 为 0）
  assert.match(indexSource, /node\?\.complete && node\.naturalWidth > 0/)
  assert.match(indexSource, /setStatus\('loaded'\)/)
})

test('INV-1 error fallback renders mount-frame caption + seal (构A 装裱题注)', () => {
  // D1：界格发丝线（非 plain 外观）+ 衬线图题 + 朱砂印
  assert.match(stylesSource, /export const FallbackCaption/)
  assert.match(stylesSource, /export const FallbackSeal/)
  assert.match(stylesSource, /&::before \{[\s\S]*?border: 1px solid color-mix\(in oklab, var\(--text-color/)
  assert.match(stylesSource, /letter-spacing: 0\.14em/)
  // 印面「佚」为装饰字：aria-hidden，语义由屏读文本（loadFailed）承担
  assert.match(indexSource, /aria-hidden='true'>\s*佚/)
  assert.match(indexSource, /FallbackVisuallyHidden/)
  // 图题取 alt，无 alt 回落词典文案
  assert.match(indexSource, /caption \|\| loadFailed/)
  // 逃生口不丢：errorFallback 消费方契约保持
  assert.match(indexSource, /errorFallback \?\?/)
})

test('D2 compact fallback shows seal only (no caption)', () => {
  assert.match(indexSource, /!compact && <FallbackCaption>/)
  // compact 印独居中（translate 定位），非 compact 右下落款
  assert.match(stylesSource, /transform: translate\(50%, 50%\)/)
})
test('INV-1 blur placeholder gates skeleton and opacity', () => {
  // blur 门控必须同时具备策略与数据
  assert.match(indexSource, /placeholder === 'blur' && Boolean\(blurDataURL\)/)
  // 骨架在 blur 模式下退场（模糊占位代替 shimmer）
  assert.match(indexSource, /resolvedShowSkeleton && !hasBlur/)
  // styles：blur 模式 img 自挂载可见，非 blur 保持 loaded 淡入
  assert.match(stylesSource, /\$blur \|\| p\.\$status === 'loaded' \? 1 : 0/)
  // 过渡时长收敛 ui-patterns 动效带（150-300ms ease-out）
  assert.match(stylesSource, /transition: opacity 0\.3s ease-out/)
})
