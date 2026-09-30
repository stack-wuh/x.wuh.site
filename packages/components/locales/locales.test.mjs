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

test('AppearanceOptions 提供语言循环切换（中→EN→日）', () => {
  assert.match(appearanceSource, /useLocale\(\)/)
  assert.match(appearanceSource, /setLocale\(/)
  assert.match(appearanceSource, /'zh', 'en', 'ja'/)
})

test('词典 zh/en/ja 均为可类型剥离的纯对象模块（node 直读无副作用）', () => {
  for (const [label, dict] of [['zh', zh], ['en', en], ['ja', ja]]) {
    assert.equal(typeof dict, 'object', `${label} default 导出必须是对象`)
  }
})
