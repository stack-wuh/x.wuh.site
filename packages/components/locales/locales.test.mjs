import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const localesDir = dirname(fileURLToPath(import.meta.url))
const packagesComponentsDir = resolve(localesDir, '..')
const repoRoot = resolve(packagesComponentsDir, '..', '..')

const NAMESPACES = ['common', 'site', 'home', 'blog', 'post', 'player', 'about', 'guestbook', 'music', 'weread', 'footprint', 'components']

async function loadDictionary(lang) {
  const dict = {}
  for (const ns of NAMESPACES) {
    dict[ns] = (await import(`./dictionaries/${lang}/${ns}.ts`))[ns]
  }
  return dict
}

const [zh, en, ja, translateMod, indexSource, appProvidersSource, appearanceSource, headerSource, useLocaleSource, componentsPkgSource, zhAssemblySource, enAssemblySource, jaAssemblySource] = await Promise.all([
  loadDictionary('zh'),
  loadDictionary('en'),
  loadDictionary('ja'),
  import('./translate.ts'),
  readFile(resolve(localesDir, 'index.tsx'), 'utf8'),
  readFile(resolve(repoRoot, 'apps/site/app/components/AppProviders.tsx'), 'utf8'),
  readFile(resolve(repoRoot, 'apps/site/app/components/SiteHeader/AppearanceOptions.tsx'), 'utf8'),
  readFile(resolve(repoRoot, 'apps/site/app/components/SiteHeader/index.tsx'), 'utf8'),
  readFile(resolve(repoRoot, 'packages/hooks/useLocale/index.ts'), 'utf8'),
  readFile(resolve(packagesComponentsDir, 'package.json'), 'utf8'),
  readFile(resolve(localesDir, 'dictionaries/zh.ts'), 'utf8'),
  readFile(resolve(localesDir, 'dictionaries/en.ts'), 'utf8'),
  readFile(resolve(localesDir, 'dictionaries/ja.ts'), 'utf8'),
])

const { translate } = translateMod

test('装配文件引入并铺开全部命名空间片段', () => {
  for (const [lang, source] of [['zh', zhAssemblySource], ['en', enAssemblySource], ['ja', jaAssemblySource]]) {
    for (const ns of NAMESPACES) {
      assert.match(source, new RegExp(`from '\\./${lang}/${ns}'`), `${lang}.ts 缺少片段 ${ns}`)
      assert.match(source, new RegExp(`\\b${ns},`), `${lang}.ts 未铺开命名空间 ${ns}`)
    }
  }
})

function leaves(node, path = [], out = []) {
  for (const [key, value] of Object.entries(node)) {
    const next = [...path, key]
    if (value && typeof value === 'object') leaves(value, next, out)
    else out.push([next.join('.'), value])
  }
  return out
}

function keySet(node, prefix = '', out = new Set()) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') keySet(value, path, out)
    else out.add(path)
  }
  return out
}

test('zh 词典是类型基准：叶子全为非空字符串，key 不以点结尾', () => {
  const entries = leaves(zh)
  assert.ok(entries.length > 0, 'zh 词典不能为空')
  for (const [path, value] of entries) {
    assert.equal(typeof value, 'string', `${path} 叶子必须是字符串`)
    assert.ok(value.trim().length > 0, `${path} 不能是空串`)
  }
})

test('en/ja 词典是 zh 的 DeepPartial：不缺命名空间、不多 key', () => {
  const zhKeys = keySet(zh)
  for (const [label, dict] of [['en', en], ['ja', ja]]) {
    const keys = keySet(dict)
    assert.ok(keys.size > 0, `${label} 词典不能为空`)
    for (const key of keys) {
      assert.ok(zhKeys.has(key), `${label} 词典含 zh 不存在的 key: ${key}`)
    }
    const roots = Object.keys(dict)
    for (const root of roots) {
      assert.ok(zh[root] !== undefined, `${label} 命名空间 ${root} 不在 zh 中`)
    }
  }
})

test('translate 运行时缺 key 回落中文，全缺返回 key 本身', () => {
  const dicts = { zh: { a: { hello: '你好' } }, en: { a: {} }, ja: {} }
  assert.equal(translate(dicts, 'en', 'a.hello'), '你好')
  assert.equal(translate(dicts, 'ja', 'a.hello'), '你好')
  assert.equal(translate(dicts, 'zh', 'a.missing'), 'a.missing')
})

test('translate 支持 {param} 插值且不吞未知占位符', () => {
  const dicts = { zh: { a: { x: '已跳过 {count} 首曲目', y: '保留 {unknown} 原样' } } }
  assert.equal(translate(dicts, 'zh', 'a.x', { count: 3 }), '已跳过 3 首曲目')
  assert.equal(translate(dicts, 'zh', 'a.y'), '保留 {unknown} 原样')
})

test('en/ja 词典经 dynamic import 惰性加载，zh 静态导入', () => {
  assert.match(indexSource, /import\('\.\/dictionaries\/en'\)/)
  assert.match(indexSource, /import\('\.\/dictionaries\/ja'\)/)
  assert.match(indexSource, /import zh from '\.\/dictionaries\/zh'/)
  assert.doesNotMatch(indexSource, /import en from /)
  assert.doesNotMatch(indexSource, /import ja from /)
})

test('locale 持久化循主题先例：wuh.site.locale，且 SSR html 恒 zh-CN 由客户端同步', () => {
  assert.match(indexSource, /wuh\.site\.locale/)
  assert.match(indexSource, /documentElement\.lang/)
  assert.match(indexSource, /zh: 'zh-CN'/)
  assert.match(indexSource, /en: 'en'/)
  assert.match(indexSource, /ja: 'ja'/)
})

test('LocaleProvider 为客户端组件且导出 useLocale', () => {
  assert.match(indexSource, /'use client'/)
  assert.match(indexSource, /export function useLocale/)
})

test('零第三方 i18n 依赖', () => {
  const forbidden = /next-intl|react-i18next|i18next|react-intl|@lingui/
  assert.doesNotMatch(indexSource, forbidden)
  const pkg = JSON.parse(componentsPkgSource)
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }
  for (const name of Object.keys(allDeps)) {
    assert.doesNotMatch(name, /intl|i18n/, `components 包不得引入 i18n 依赖: ${name}`)
  }
})

test('AppProviders 挂载 LocaleProvider', () => {
  assert.match(appProvidersSource, /<LocaleProvider>/)
  assert.match(appProvidersSource, /import \{[^}]*LocaleProvider[^}]*\} from '@wuh\.site\/components\/locales'/)
})

test('useLocale 落位 packages/hooks/useLocale 并复用 locales 实现', () => {
  assert.match(useLocaleSource, /export \{ useLocale/)
  assert.match(useLocaleSource, /@wuh\.site\/components\/locales/)
})

test('AppearanceOptions 语言三选平铺（中｜英｜日，aria-pressed 直选），不再循环轮转', () => {
  assert.match(appearanceSource, /useLocale\(\)/)
  assert.match(appearanceSource, /setLocale\(/)
  assert.match(appearanceSource, /value: 'zh'/)
  assert.match(appearanceSource, /value: 'en'/)
  assert.match(appearanceSource, /value: 'ja'/)
  assert.match(appearanceSource, /aria-pressed=\{locale === option\.value\}/)
  // 循环轮转退役：无 LOCALE_CYCLE / nextLocale 推导
  assert.doesNotMatch(appearanceSource, /LOCALE_CYCLE|nextLocale/)
  // 挂载即兜底预取（外观弹层打开 = 组件挂载）
  assert.match(appearanceSource, /preloadDictionaries\(\)/)
})

test('词典空闲预取：requestIdleCallback 回退 setTimeout，双语言槽，失败静默回落', () => {
  assert.match(indexSource, /export function preloadDictionaries/)
  // 预取必须经单一入口：只热 webpack 模块缓存不等于「可渲染」，词典要落进缓存槽
  assert.match(indexSource, /ensureDict\(target\)\.catch\(\(\) => \{\}\)/)
  assert.match(indexSource, /window\.requestIdleCallback\(\(\) => cb\(\), \{ timeout: 3000 \}\)/)
  assert.match(indexSource, /window\.setTimeout\(cb, 1500\)/)
})

test('词典 zh/en/ja 均为可类型剥离的纯对象模块（node 直读无副作用）', () => {
  for (const [label, dict] of [['zh', zh], ['en', en], ['ja', ja]]) {
    assert.equal(typeof dict, 'object', `${label} default 导出必须是对象`)
  }
})

// 20261005-fix-locale-switch-realtime：切语言非实时的两条根因各钉一枚守卫
test('词典必须是渲染输入：存 state 且 t 依赖含 dicts，ref+版本号自增的通知机制退役', () => {
  // 反 bail out：词典不得藏在 ref 里，也不得靠「不进 context value 的版本号自增」来通知
  assert.doesNotMatch(indexSource, /dictsRef/)
  assert.doesNotMatch(indexSource, /bumpDictVersion|setDictVersion/)
  assert.doesNotMatch(indexSource, /loadingRef/)
  // 词典快照进 state，t 读 state 且依赖含 dicts —— 入库必然改变 context identity
  assert.match(indexSource, /useState<TranslateDicts>\(\{ zh \}\)/)
  assert.match(indexSource, /translate\(dicts, locale, key, params\)/)
  assert.match(indexSource, /\[dicts, locale\]/)
})

test('切语言就绪门控：ensureDict 到位后才成套提交 locale/lang/localStorage，连点取最新值', () => {
  // 单一入口 + 模块级缓存 + in-flight 去重
  assert.match(indexSource, /function ensureDict\(target: Locale\): Promise<void>/)
  assert.match(indexSource, /dictCache\[slot\]/)
  assert.match(indexSource, /dictPending\.get\(slot\)/)
  // 挂载路径同样经门控（不得「先 setLocaleState 后 loadDict」）
  assert.match(indexSource, /ensureDict\(stored\)/)

  const setLocaleBody = indexSource.slice(
    indexSource.indexOf('const setLocale = useCallback'),
    indexSource.indexOf('const t = useCallback'),
  )
  assert.ok(setLocaleBody.length > 0, '未找到 setLocale 实现')
  assert.match(setLocaleBody, /ensureDict\(next\)/)
  assert.ok(
    setLocaleBody.indexOf('ensureDict') < setLocaleBody.indexOf('commitLocale'),
    'setLocale 必须先等词典就绪（ensureDict）再提交（commitLocale），否则点击首帧必读空槽回落中文',
  )
  // 提交只许发生在 commitLocale 内，setLocale 里不得出现裸的 setLocaleState
  assert.doesNotMatch(setLocaleBody, /setLocaleState\(next\)/)
  // 连点语言取最新值
  assert.match(setLocaleBody, /requestIdRef\.current/)
  // 词典加载失败仍提交：按既有回落链走中文，不吞用户意图
  assert.match(setLocaleBody, /\.catch\(\(\) => \{\}\)/)

  const commitBody = indexSource.slice(
    indexSource.indexOf('const commitLocale'),
    indexSource.indexOf('const setLocale'),
  )
  assert.ok(commitBody.length > 0, '未找到 commitLocale 实现')
  // 文案、<html lang>、持久化、词典快照同一批落地，禁止「按钮已切、文案未切」的半更新帧
  assert.match(commitBody, /setDicts\(\{ \.\.\.dictCache \}\)/)
  assert.match(commitBody, /setLocaleState\(next\)/)
  assert.match(commitBody, /applyDocumentLang\(next\)/)
  assert.match(commitBody, /LOCALE_STORAGE_KEY/)
})
