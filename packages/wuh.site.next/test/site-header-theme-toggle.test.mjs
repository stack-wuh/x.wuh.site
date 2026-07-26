import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const headerPath = resolve(appRoot, 'app/components/SiteHeader/index.tsx')
const stylesPath = resolve(appRoot, 'app/components/SiteHeader/styles/index.ts')
const appearanceOptionsPath = resolve(appRoot, 'app/components/SiteHeader/AppearanceOptions.tsx')
const iconsPath = resolve(appRoot, '../components/icons/index.tsx')
const providerPath = resolve(appRoot, 'app/components/theme/ThemeModeProvider.tsx')
const layoutPath = resolve(appRoot, 'app/layout.tsx')

const [headerSource, stylesSource, appearanceOptionsSource, iconsSource, providerSource, layoutSource] = await Promise.all([
  readFile(headerPath, 'utf8'),
  readFile(stylesPath, 'utf8'),
  readFile(appearanceOptionsPath, 'utf8').catch(() => ''),
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
  assert.match(appearanceOptionsSource, /主题风格/)
  assert.match(appearanceOptionsSource, /显示模式/)
  assert.match(appearanceOptionsSource, /aria-pressed=\{themeFamily === option\.value\}/)
  assert.match(appearanceOptionsSource, /aria-pressed=\{colorSchemeMode === option\.value\}/)
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

test('移动菜单通过外观设置入口内联展开主题选项', () => {
  assert.match(headerSource, /MobileAppearanceAction/)
  assert.match(headerSource, /外观设置/)
  assert.match(headerSource, /MobileAppearanceOptions/)
  assert.match(headerSource, /aria-expanded=\{mobileAppearanceExpanded\}/)
  assert.match(headerSource, /aria-controls=\{mobileAppearanceId\}/)
})

test('移动菜单支持 Escape 关闭并重置展开状态', () => {
  assert.match(headerSource, /event\.key === 'Escape'/)
  assert.match(headerSource, /setMobileAppearanceExpanded\(false\)/)
})

test('移动菜单在当前层级内联展开外观选项', () => {
  assert.match(headerSource, /const \[mobileAppearanceExpanded, setMobileAppearanceExpanded\] = useState\(false\)/)
  assert.match(headerSource, /aria-expanded=\{mobileAppearanceExpanded\}/)
  assert.match(headerSource, /aria-controls=\{mobileAppearanceId\}/)
  assert.match(headerSource, /<S\.MobileAppearanceOptions id=\{mobileAppearanceId\} \$expanded=\{mobileAppearanceExpanded\}>/)
  assert.match(headerSource, /<S\.MobileAppearanceOptions[\s\S]*<AppearanceOptions/)
})

test('移动菜单不再使用二级 Bottom Sheet', () => {
  assert.doesNotMatch(headerSource, /MobileAppearanceOverlay/)
  assert.doesNotMatch(headerSource, /MobileAppearanceSheet/)
  assert.doesNotMatch(headerSource, /mobileAppearanceOpen/)
  assert.doesNotMatch(headerSource, /document\.body\.style\.overflow/)
  assert.doesNotMatch(headerSource, /onSheetTouchStart|onSheetTouchEnd/)
  assert.doesNotMatch(stylesSource, /export const MobileAppearanceOverlay/)
  assert.doesNotMatch(stylesSource, /export const MobileAppearanceSheet/)
})

test('关闭移动菜单时重置外观展开状态', () => {
  assert.match(headerSource, /const close = useCallback\(\(\) => \{[\s\S]*setMobileAppearanceExpanded\(false\)[\s\S]*setOpen\(false\)/)
  assert.match(headerSource, /if \(value\) setMobileAppearanceExpanded\(false\)/)
})

test('移动菜单限制高度并允许内部滚动', () => {
  assert.match(stylesSource, /export const MobileNav = styled\.nav`[\s\S]*max-height:\s*calc\(100dvh - 96px\)/)
  assert.match(stylesSource, /export const MobileNav = styled\.nav`[\s\S]*overflow-y:\s*auto/)
})

test('移动端内联外观区域适配窄屏并尊重减少动效', () => {
  assert.match(stylesSource, /export const MobileAppearanceOptions = styled\.div/)
  assert.match(stylesSource, /grid-template-rows:/)
  assert.match(stylesSource, /prefers-reduced-motion:\s*reduce/)
})

test('移动端内联外观区域展开后仍满足触摸目标约束', () => {
  assert.match(stylesSource, /export const MobileAppearanceAction = styled\.button/)
  assert.match(stylesSource, /min-height:\s*48px/)
  assert.match(stylesSource, /min-width:\s*44px/)
  assert.match(stylesSource, /flex:\s*0 0 auto/)
  assert.match(stylesSource, /prefers-reduced-motion:\s*reduce/)
})

test('桌面端外观控件与通用 Button 视觉样式解耦', () => {
  assert.match(stylesSource, /export const AppearanceTrigger = styled\.button/)
  assert.doesNotMatch(stylesSource, /export const AppearanceTrigger = styled\(Button\)/)
  assert.match(stylesSource, /border-radius:\s*12px/)
  assert.match(stylesSource, /padding:\s*10px 12px/)
})

test('桌面和移动端复用共享外观选项组件', () => {
  assert.match(headerSource, /import AppearanceOptions from '.\/AppearanceOptions'/)
  assert.equal((headerSource.match(/<AppearanceOptions/g) ?? []).length, 2)
  assert.match(appearanceOptionsSource, /interface AppearanceOptionsProps/)
  assert.match(appearanceOptionsSource, /aria-pressed=\{themeFamily === option\.value\}/)
  assert.match(appearanceOptionsSource, /aria-pressed=\{colorSchemeMode === option\.value\}/)
})

test('酒红和素雅色板使用各自固定主题色预览', () => {
  assert.match(appearanceOptionsSource, /preview: 'linear-gradient\(135deg, #C94A44 0 48%, #FFFBF8 48% 100%\)'/)
  assert.match(appearanceOptionsSource, /preview: 'linear-gradient\(135deg, #C89060 0 48%, #FFFDF9 48% 100%\)'/)
  assert.doesNotMatch(stylesSource, /background:\s*linear-gradient\(135deg, var\(--primary-color\)/)
})

test('移动端内联外观状态可独立展开和收起', () => {
  assert.doesNotMatch(headerSource, /const openMobileAppearance[\s\S]*?close\(\)/)
  assert.match(headerSource, /setMobileAppearanceExpanded\(\(value\) => !value\)/)
  assert.match(headerSource, /<S\.MobileAppearanceOptions id=\{mobileAppearanceId\} \$expanded=\{mobileAppearanceExpanded\}>/)
})

test('桌面外观入口采用导航同款轻量样式', () => {
  const triggerSource = stylesSource.match(/export const AppearanceTrigger = styled\.button`([\s\S]*?)`/)?.[1] ?? ''
  assert.match(triggerSource, /padding:\s*10px 12px/)
  assert.match(triggerSource, /border:\s*0/)
  assert.match(triggerSource, /border-radius:\s*12px/)
  assert.match(triggerSource, /color-mix\(in oklab, var\(--primary-color\) 8%, transparent\)/)
  assert.doesNotMatch(triggerSource, /border-radius:\s*999px/)
  assert.doesNotMatch(triggerSource, /box-shadow:\s*inset/)
  assert.doesNotMatch(triggerSource, /translateY/)
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
