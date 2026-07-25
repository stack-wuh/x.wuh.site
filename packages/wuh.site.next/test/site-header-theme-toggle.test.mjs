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
const providerPath = resolve(appRoot, 'app/components/theme/ThemeModeProvider.tsx')
const layoutPath = resolve(appRoot, 'app/layout.tsx')

const [headerSource, stylesSource, iconsSource, providerSource, layoutSource] = await Promise.all([
  readFile(headerPath, 'utf8'),
  readFile(stylesPath, 'utf8'),
  readFile(iconsPath, 'utf8'),
  readFile(providerPath, 'utf8'),
  readFile(layoutPath, 'utf8'),
])

test('主题 Provider 暴露主题家族和三态显示模式', () => {
  assert.match(providerSource, /export type ColorSchemeMode = 'system' \| ColorScheme/)
  assert.match(providerSource, /themeFamily: ThemeFamily/)
  assert.match(providerSource, /colorSchemeMode: ColorSchemeMode/)
  assert.match(providerSource, /resolvedColorScheme: ColorScheme/)
  assert.match(providerSource, /setThemeFamily:/)
  assert.match(providerSource, /setColorSchemeMode:/)
})

test('主题 Provider 独立持久化显示模式并仅在 system 下响应系统变化', () => {
  assert.match(providerSource, /wuh\.site\.color-scheme-mode/)
  assert.match(providerSource, /value === 'system' \|\| value === 'light' \|\| value === 'dark'/)
  assert.match(providerSource, /colorSchemeMode === 'system'/)
  assert.match(providerSource, /applyColorScheme/)
})

test('首屏脚本在渲染前恢复主题家族和三态显示模式', () => {
  assert.match(layoutSource, /wuh\.site\.color-scheme-mode/)
  assert.match(layoutSource, /mode === 'light' \|\| mode === 'dark'/)
  assert.match(layoutSource, /prefers-color-scheme: dark/)
  assert.match(layoutSource, /dataset\.themeFamily/)
  assert.match(layoutSource, /dataset\.colorScheme/)
})

test('桌面 Header 提供可访问的外观入口和编辑部调色台浮层', () => {
  assert.match(headerSource, /AppearanceTrigger/)
  assert.match(headerSource, />外观</)
  assert.match(headerSource, /aria-haspopup='dialog'/)
  assert.match(headerSource, /aria-expanded=\{appearanceOpen\}/)
  assert.match(headerSource, /DesktopAppearancePopover/)
  assert.match(headerSource, /主题风格/)
  assert.match(headerSource, /显示模式/)
  assert.match(headerSource, /aria-pressed=\{themeFamily === option\.value\}/)
  assert.match(headerSource, /aria-pressed=\{colorSchemeMode === option\.value\}/)
})

test('桌面外观浮层支持 Escape、外部点击和焦点归还', () => {
  assert.match(headerSource, /appearanceRef/)
  assert.match(headerSource, /event\.key === 'Escape'/)
  assert.match(headerSource, /contains\(event\.target as Node\)/)
  assert.match(headerSource, /appearanceTriggerRef\.current\?\.focus\(\)/)
})

test('编辑部调色台使用纸张浮层、色板和 reduced-motion 样式', () => {
  assert.match(stylesSource, /export const AppearanceTrigger = styled\.button/)
  assert.match(stylesSource, /export const DesktopAppearancePopover = styled\.div/)
  assert.match(stylesSource, /export const ThemeSwatch = styled\.button/)
  assert.match(stylesSource, /export const SchemeOption = styled\.button/)
  assert.match(stylesSource, /prefers-reduced-motion:\s*reduce/)
})

test('外观入口继续使用统一 outline 图标', () => {
  assert.match(headerSource, /IconPalette/)
  assert.match(headerSource, /IconChevronDown/)
  assert.match(headerSource, /aria-hidden='true'/)

  assert.match(iconsSource, /Palette as IconPalette/)
  assert.match(iconsSource, /ChevronDown as IconChevronDown/)
})

test('移动菜单通过外观设置入口打开 Bottom Sheet', () => {
  assert.match(headerSource, /mobileAppearanceTriggerRef/)
  assert.match(headerSource, /MobileAppearanceAction/)
  assert.match(headerSource, /外观设置/)
  assert.match(headerSource, /MobileAppearanceOverlay/)
  assert.match(headerSource, /MobileAppearanceSheet/)
  assert.match(headerSource, /role='dialog'/)
  assert.match(headerSource, /aria-modal='true'/)
})

test('移动 Bottom Sheet 支持遮罩、关闭按钮、Escape 和滚动锁', () => {
  assert.match(headerSource, /document\.body\.style\.overflow = 'hidden'/)
  assert.match(headerSource, /onClick=\{closeMobileAppearance\}/)
  assert.match(headerSource, /event\.key === 'Escape'/)
  assert.match(headerSource, /mobileAppearanceTriggerRef\.current\?\.focus\(\)/)
})

test('移动 Bottom Sheet 限高、适配安全区并尊重减少动效', () => {
  assert.match(stylesSource, /export const MobileAppearanceOverlay = styled\.div/)
  assert.match(stylesSource, /export const MobileAppearanceSheet = styled\.div/)
  assert.match(stylesSource, /max-height:\s*80dvh/)
  assert.match(stylesSource, /env\(safe-area-inset-bottom\)/)
  assert.match(stylesSource, /prefers-reduced-motion:\s*reduce/)
})

test('移动端外观入口满足触摸目标和图标防压缩约束', () => {
  assert.match(stylesSource, /export const MobileAppearanceAction = styled\.button/)
  assert.match(stylesSource, /min-height:\s*48px/)
  assert.match(stylesSource, /min-width:\s*44px/)
  assert.match(stylesSource, /flex:\s*0 0 auto/)
  assert.match(stylesSource, /prefers-reduced-motion:\s*reduce/)
})

test('桌面端外观控件与通用 Button 视觉样式解耦', () => {
  assert.match(stylesSource, /export const AppearanceTrigger = styled\.button/)
  assert.doesNotMatch(stylesSource, /export const AppearanceTrigger = styled\(Button\)/)
  assert.match(stylesSource, /border-radius:\s*999px/)
  assert.match(stylesSource, /min-height:\s*36px/)
})

test('移动端 Header 菜单按钮使用独立按钮样式并固定汉堡图标尺寸', () => {
  assert.match(headerSource, /<S\.MobileToggle[\s\S]*<IconBars \/>/)
  assert.match(stylesSource, /export const MobileToggle = styled\.button/)
  assert.match(stylesSource, /export const MobileToggle = styled\.button[\s\S]*?svg \{/)
  assert.match(stylesSource, /MobileToggle[\s\S]*?svg[\s\S]*?width: 20px/)
  assert.match(stylesSource, /MobileToggle[\s\S]*?svg[\s\S]*?height: 20px/)
  assert.match(stylesSource, /MobileToggle[\s\S]*?svg[\s\S]*?display: block/)
  assert.match(stylesSource, /MobileToggle[\s\S]*?svg[\s\S]*?flex-shrink: 0/)
})
