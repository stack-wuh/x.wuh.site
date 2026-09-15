import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(testDir, '../../..')
const styles = await readFile(resolve(repoRoot, 'apps/site/app/components/SiteHeader/styles/index.ts'), 'utf8')
const tsx = await readFile(resolve(repoRoot, 'apps/site/app/components/SiteHeader/index.tsx'), 'utf8')

const block = (decl) => {
  const matched = styles.match(new RegExp(`${decl}\`([\\s\\S]*?)\``))
  assert.ok(matched, `未找到样式块 ${decl}`)
  return matched[1]
}

test('页头根层自持字体族、辅助字号与局部行高', () => {
  // Header 挂在页面容器之外（AppProviders），页面级 font-family 覆盖不到它
  const root = block('export const HeaderRoot = styled\\.header')
  assert.match(root, /font-family: var\(--font-sans\);/)
  assert.match(root, /font-size: var\(--font-size-xs\);/)
  // 控件条行高 1.5 自持变量，不引全站 --line-height-body/heading
  assert.match(root, /--header-lh: 1\.5;/)
  assert.match(root, /line-height: var\(--header-lh\);/)
  assert.doesNotMatch(styles, /line-height: var\(--line-height-(body|heading)\)/)
})

test('页头不使用 --font-size-sm，展示档只经令牌', () => {
  // 素雅主题把 --font-size-sm 覆写为 15px（与 base 同值），导航层级会消失
  assert.doesNotMatch(styles, /font-size: var\(--font-size-sm\);/)
  assert.doesNotMatch(styles, /font-size: \d+(\.\d+)?px;/)
  // 墨签字高 = 导航字号档 ×2（与 logo 同参照系），移动菜单项走 base 档（15px）
  assert.match(block('export const InkSample = styled\\.div<\\{[^>]*\\}>'), /font-size: calc\(var\(--header-fs\) \* 2\);/)
  assert.match(block('export const MobileItem = styled\\(Link\\)'), /font-size: var\(--font-size-base\);/)
  // 导航行是主动线入口：平板带局部 13px（无四主题稳定 13px 令牌，理由见样式注释），
  // PC 带（≥1024 语义断点）升 base 档 15px，均不落 12px 辅助档
  const rootBlock = block('export const HeaderRoot = styled\\.header')
  assert.match(rootBlock, /--header-fs: 13px;/)
  assert.match(rootBlock, /@media \(min-width: \$\{BREAKPOINTS\.tablet\}px\) \{ --header-fs: var\(--font-size-base\); \}/)
  assert.match(block('export const NavLink = styled\\(Link\\)'), /font-size: var\(--header-fs\);/)
})

test('野断点 768px 收敛为语义常量', () => {
  assert.doesNotMatch(styles, /768/, '禁止残留 768 野断点')
  assert.match(styles, /import \{ BREAKPOINTS \} from '@wuh\.site\/components\/themes\/breakpoints'/)
  assert.match(styles, /@media \(min-width: \$\{BREAKPOINTS\.mobile\}px\)/)
})

test('底边框与页脚同档发丝线', () => {
  assert.match(styles, /border-bottom: 1px solid color-mix\(in oklab, var\(--text-muted\) 18%, transparent\);/)
})

test('渐隐下划线几何由令牌推导', () => {
  const link = block('export const NavLink = styled\\(Link\\)')
  assert.match(link, /left: var\(--space-base\);/)
  assert.match(link, /right: var\(--space-base\);/)
  assert.match(link, /bottom: calc\(var\(--space-base\) \/ 2\);/)
  assert.match(link, /padding: var\(--space-xs\) var\(--space-base\);/)
  // 触发器与 NavLink 同一行盒高（行节奏不随入口形态变化）
  const trigger = block('export const AppearanceTrigger = styled\\.button')
  assert.match(trigger, /font-size: var\(--header-fs\);/)
  assert.match(trigger, /min-height: calc\(1em \* var\(--header-lh\) \+ var\(--space-xs\) \* 2\);/)
  assert.ok(trigger.indexOf('font: inherit') < trigger.indexOf('font-size: var(--header-fs)'),
    'font 简写必须排在 font-size 之前，否则简写会把 font-size 重置回继承值')
  assert.match(block('export const NavLink = styled\\(Link\\)'), /bottom: calc\(var\(--space-base\) \/ 2\);/)
  // logo 与导航同参照系：高 = --header-fs ×2，宽按 42:26 原比例，不新增断点
  const brand = block('export const Brand = styled\\.div')
  assert.match(brand, /height: calc\(var\(--header-fs\) \* 2\);/)
  assert.match(brand, /width: calc\(var\(--header-fs\) \* 2 \/ 26 \* 42\);/)
})

test('外观入口图标化：桌面触发器不再携带文字与箭头', () => {
  assert.doesNotMatch(tsx, /<span>外观<\/span>/)
  const trigger = tsx.match(/<S\.AppearanceTrigger[\s\S]*?<\/S\.AppearanceTrigger>/)?.[0] ?? ''
  assert.ok(trigger, '未找到 AppearanceTrigger')
  assert.doesNotMatch(trigger, /ThemeChevron/)
  // 可访问名保留当前主题信息（图标按钮无可见文字）
  assert.match(trigger, /aria-label=\{`外观设置，当前/)
  // 移动端菜单行仍保留文字+chevron（面板行不是导航入口）
  assert.match(tsx, /<S\.MobileThemeTitle>外观设置<\/S\.MobileThemeTitle>/)
})

test('胶囊底色退场：触发器无背景', () => {
  const trigger = block('export const AppearanceTrigger = styled\\.button')
  assert.match(trigger, /background: transparent;/)
  assert.doesNotMatch(trigger, /background: color-mix\(in oklab, var\(--primary-color\) 8%/)
})

test('间距、偏移与圆角不写死 px，全部经令牌', () => {
  const spacingProps = 'margin|margin-top|margin-bottom|padding|padding-inline|gap|row-gap|column-gap|outline-offset|bottom|top|left|right|border-radius'
  const bare = new RegExp(`(?:^|[;\\s])(?:${spacingProps}):\\s*[^;\\n]*?\\d+(\\.\\d+)?px`, 'gm')
  assert.deepEqual(styles.match(bare) ?? [], [], '间距/偏移/圆角属性只能引用 --space-* / --border-radius-* 令牌或 calc 推导')
  // 关键映射抽查
  assert.match(block('export const HeaderInner = styled\\.div'), /padding: var\(--space-base\) var\(--space-md\);/)
  assert.match(styles, /top: calc\(100% \+ var\(--space-base\)\);/)
})

test('字重只落在真实字面：无 650', () => {
  assert.doesNotMatch(styles, /font-weight: 650;/)
})

// —— 主题选择器「试笔墨签」重设计 ——
const opts = await readFile(resolve(repoRoot, 'apps/site/app/components/SiteHeader/AppearanceOptions.tsx'), 'utf8')

test('弹层容器换纸卡语言：无毛玻璃/白高光/大圆角', () => {
  const pop = block('export const DesktopAppearancePopover = styled\\.div')
  assert.match(pop, /background: var\(--background-100\);/)
  assert.match(pop, /border-radius: var\(--border-radius-base\);/)
  assert.match(pop, /box-shadow: var\(--elevation-soft\);/)
  assert.doesNotMatch(pop, /backdrop-filter/)
  assert.doesNotMatch(pop, /inset 0 1px/)
})

test('墨签样本引用原始调色板，零复制漂移', () => {
  // Layer 1 的 --_wl-* / --_pl-* 恒定挂在 :root、不随当前主题路由——预览必须取它们
  assert.match(opts, /paper: 'var\(--_wl-background-900\)'/)
  assert.match(opts, /line: 'var\(--_wl-primary-500\)'/)
  assert.match(opts, /paper: 'var\(--_pl-background-900\)'/)
  assert.match(opts, /line: 'var\(--_pl-primary-600\)'/) // 素雅 primary 在 600 档
  assert.doesNotMatch(opts, /#[0-9a-fA-F]{6}/, '不允许再写死色值')
})

test('明暗段选中用渐隐下划线，与导航同源；无彩色胶囊', () => {
  const seg = block('export const SchemeOption = styled\\.button')
  assert.match(seg, /background: linear-gradient\(90deg, transparent, var\(--primary-color\) 18%, var\(--primary-color\) 82%, transparent\);/)
  assert.match(seg, /&\[aria-pressed='true'\]/)
  assert.doesNotMatch(seg, /background: var\(--primary-color\);/, '选中不再整块反白')
  // 淡化表达一律 text-color mix：--text-secondary 在暗色调色板反向（600 比 500 亮），选中会比未选中更暗
  assert.doesNotMatch(styles, /color: var\(--text-secondary\);/, 'Header 内不得使用 text-secondary')
})

test('旧装饰件退场：标题行/角标/假色板不复存在', () => {
  for (const gone of ['AppearanceHeading', 'SwatchPreview', 'SelectionMark', 'ThemeValue']) {
    assert.doesNotMatch(styles, new RegExp(`export const ${gone} =`), `${gone} 应已删除`)
  }
  assert.doesNotMatch(tsx, /AppearanceHeading/)
})

test('主题入口是朱砂印「墨」：钤印开弹层，印面即装饰', () => {
  const seal = block('export const ThemeSeal = styled\\.span<\\{[^>]*\\}>')
  // 状态直挂印面：开合走 transient prop（跨组件插值选择器在 SSR 双写 styleSheets 下不可靠）
  // 边框拆长写（color-mix 进 border 简写时态切换覆盖不稳）
  assert.match(seal, /border-width: 1px;/)
  assert.match(seal, /border-style: solid;/)
  assert.match(seal, /border-color: \$\{\(\{ \$open \}\) => \(\$open \? 'var\(--primary-color\)' : 'color-mix\(in oklab, var\(--primary-color\) 45%, transparent\)'\)\};/)
  assert.match(seal, /&:hover \{ border-color: var\(--primary-color\); \}/)
  assert.match(tsx, /<S\.ThemeSeal aria-hidden='true' \$open=\{appearanceOpen\}>墨<\/S\.ThemeSeal>/)
  assert.match(seal, /border-radius: var\(--border-radius-xs\);/)
  assert.match(seal, /font-family: var\(--font-serif\);/)
  assert.match(seal, /font-size: var\(--font-size-xs\);/)
  assert.match(seal, /color: var\(--primary-color\);/)
  // 印面无渐隐下划线（弹层里墨字段才用下划线；再挂线就是双份装饰）
  assert.doesNotMatch(block('export const AppearanceTrigger = styled\\.button'), /&::after/, '印钮不再需要下划线装饰')
  const triggerEl = tsx.match(/<S\.AppearanceTrigger[\s\S]*?<\/S\.AppearanceTrigger>/)?.[0] ?? ''
  assert.doesNotMatch(triggerEl, /IconPalette/, '桌面入口弃用通用调色盘图标')
  assert.match(triggerEl, /title='外观设置'/, '原生悬停提示补可发现性')
  // 移动端外观行是列表行不是印，保留调色盘图标+文字
  assert.match(tsx, /IconPalette size=\{18\}/)
})

test('分组文案用用户视角：主题/明暗', () => {
  assert.match(opts, /<S\.AppearanceLabel>主题<\/S\.AppearanceLabel>/)
  assert.match(opts, /<S\.AppearanceLabel>明暗<\/S\.AppearanceLabel>/)
  // 无障碍名保留系统全称，不随装饰性可见文案收窄
  assert.match(opts, /aria-label='主题风格'/)
  assert.match(opts, /aria-label='显示模式'/)
})

// —— 导航运笔：下划线从「淡入」升级为「行笔」，当前页常驻，外链有标记 ——

test('下划线是运笔动画：scaleX 从左行笔到右，弃用透明度显隐', () => {
  const link = block('export const NavLink = styled\\(Link\\)')
  assert.match(link, /transform: scaleX\(0\);/)
  assert.match(link, /transform-origin: left center;/)
  assert.match(link, /transition: transform var\(--transition-fast\) ease-out;/)
  assert.match(link, /&:hover::after,[\s\S]*?&:focus-visible::after \{\s*transform: scaleX\(1\);\s*\}/)
  // 整块不得再出现 opacity 显隐（渐变背景里的 stop 不算属性声明）
  assert.doesNotMatch(link, /^\s*opacity:/m, '下划线显隐不得回退为 opacity 淡入')
  // 减弱动效：运笔与色彩过渡同时停
  assert.match(link, /@media \(prefers-reduced-motion: reduce\) \{\s*transition: none;\s*&::after \{ transition: none; \}/)
})

test('当前页同一支笔：样式挂在 aria-current 语义上，桌面与移动同源', () => {
  const link = block('export const NavLink = styled\\(Link\\)')
  assert.match(link, /&\[aria-current='page'\] \{\s*color: var\(--text-color\);\s*&::after \{\s*transform: scaleX\(1\);/)
  const mobile = block('export const MobileItem = styled\\(Link\\)')
  assert.match(mobile, /&\[aria-current='page'\] \{/)
  // tsx 侧归段：博客详情页与列表页共享「博客」段；首页独立（移动菜单）
  assert.match(tsx, /const isBlog = pathname === '\/blog' \|\| pathname\.startsWith\('\/post\/'\)/)
  assert.match(tsx, /aria-current=\{isBlog \? 'page' : undefined\}/)
  assert.match(tsx, /aria-current=\{isAbout \? 'page' : undefined\}/)
  assert.match(tsx, /aria-current=\{isHome \? 'page' : undefined\}/)
})

test('外链标记 ↗：桌面+移动双处，装饰性隐藏、无障碍名交代去向', () => {
  const ext = block('export const ExternalMark = styled\\.span')
  // 信息不装饰：只用与导航同源的淡化色，无独立 hover/动画
  assert.match(ext, /color: color-mix\(in oklab, var\(--text-color\) 72%, transparent\);/)
  assert.doesNotMatch(ext, /transition|:hover/)
  assert.equal((tsx.match(/<S\.ExternalMark aria-hidden='true'>↗<\/S\.ExternalMark>/g) ?? []).length, 2,
    '知识库在桌面导航与移动菜单各出现一次')
  assert.equal((tsx.match(/aria-label='知识库（在新窗口打开）'/g) ?? []).length, 2)
})
