import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const headerPath = resolve(appRoot, 'app/components/SiteHeader/index.tsx')
const stylesPath = resolve(appRoot, 'app/components/SiteHeader/styles/index.ts')
const iconsPath = resolve(appRoot, '../components/icons/index.tsx')

const [headerSource, stylesSource, iconsSource] = await Promise.all([
  readFile(headerPath, 'utf8'),
  readFile(stylesPath, 'utf8'),
  readFile(iconsPath, 'utf8'),
])

test('主题切换控件使用统一 outline 图标和明确的桌面/移动结构', () => {
  assert.match(headerSource, /IconPalette/)
  assert.match(headerSource, /IconChevronDown/)
  assert.match(headerSource, /DesktopThemeToggle/)
  assert.match(headerSource, /MobileThemeAction/)
  assert.match(headerSource, /切换主题（当前：\$\{THEME_LABELS\[theme\]\}）/)
  assert.match(headerSource, /切换主题/)
  assert.match(headerSource, /aria-hidden='true'/)

  assert.match(iconsSource, /Palette as IconPalette/)
  assert.match(iconsSource, /ChevronDown as IconChevronDown/)
})

test('移动端主题操作项满足触摸目标、图标防压缩和 reduced-motion 约束', () => {
  assert.match(stylesSource, /export const MobileThemeAction = styled\.button/)
  assert.match(stylesSource, /min-height:\s*48px/)
  assert.match(stylesSource, /min-width:\s*44px/)
  assert.match(stylesSource, /flex:\s*0 0 auto/)
  assert.match(stylesSource, /prefers-reduced-motion:\s*reduce/)
})

test('桌面端主题控件与通用 Button 视觉样式解耦', () => {
  assert.match(stylesSource, /export const DesktopThemeToggle = styled\.button/)
  assert.doesNotMatch(stylesSource, /export const DesktopThemeToggle = styled\(Button\)/)
  assert.match(stylesSource, /border-radius:\s*999px/)
  assert.match(stylesSource, /min-height:\s*36px/)
})
