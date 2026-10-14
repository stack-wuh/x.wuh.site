import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// 共享 hooks 二波纪律守卫（change 20261014-refactor-shared-hooks-wave2）：
// 1) 三件套导出契约（useScrollLock / useLocalStorageState+原语 / scheduleIdle）；
// 2) 已迁移消费文件禁现手写锁骨架 / 裸 localStorage 读 / 手写 idle 分支 / ahooks useEventListener；
// 3) INTL_LOCALE 与主题存储 key 双源消除；4) 白名单反查棘轮（实现处与内联脚本被迁空即判红）。
// 仅读源码文本，不 import .ts——node ≥ 22 可跑（SGN-002 豁免）。
const dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(dir, '..', '..', '..')
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

const HOOKS = {
  lock: 'packages/hooks/useScrollLock/index.ts',
  storage: 'packages/hooks/useLocalStorageState/index.ts',
  idle: 'packages/hooks/scheduleIdle/index.ts',
}

// 滚动锁已迁移消费文件：必须走 useScrollLock，禁现手写锁骨架
const MIGRATED_LOCK = [
  'packages/components/dialog/index.tsx',
  'packages/components/audio-player/PlayerPanel.tsx',
  'packages/components/image-preview/index.tsx',
]

// 存储已迁移消费文件：必须走原语/hook，禁现裸 window.localStorage 访问
const MIGRATED_STORAGE = [
  'packages/components/locales/index.tsx',
  'packages/components/audio-player/MiniPlayer.tsx',
  'apps/site/app/components/theme/ThemeModeProvider.tsx',
  'apps/site/app/post/components/PostComments/index.tsx',
  'apps/site/app/about/components/GuestbookBarrageDialog.tsx',
]

// 空闲调度已迁移消费文件：必须走 scheduleIdle，禁现手写 idle 分支调用
const MIGRATED_IDLE = [
  'packages/components/locales/index.tsx',
  'apps/site/app/components/player/GlobalAudioPlayer.tsx',
  'apps/site/app/components/FontPrefetch.tsx',
]

// INTL_LOCALE 消费文件：映射单源在 locales，禁本地重定义
const INTL_CONSUMERS = [
  'apps/site/app/about/components/GuestbookBarrageDialog.tsx',
  'apps/site/app/footprint/page.tsx',
  'apps/site/app/post/components/PostComments/index.tsx',
]

// 白名单=允许仍手写 localStorage/锁骨架的唯一实现处与已登记不适用点
const WHITELIST_STORAGE = [
  HOOKS.storage, // readStorage/writeStorage 实现处
  'apps/site/app/layout.tsx', // anti-FOUC 内联脚本（水合前运行，无法 import 原语；key 经 themeStorage 注入）
]

test('useScrollLock 导出契约：fixed/simple 双配方 + 条件挂载 + 对称还原 + SSR guard', () => {
  const src = read(HOOKS.lock)
  assert.match(src, /export const useScrollLock/)
  assert.match(src, /export default useScrollLock/)
  assert.match(src, /ScrollLockMode/)
  assert.match(src, /mode = 'fixed'/)
  assert.match(src, /mode === 'simple'/)
  // fixed 配方：body 四值暂存 + fixed 补偿；cleanup 逐值还原 + scrollTo
  assert.match(src, /document\.body\.style\.position = 'fixed'/)
  assert.match(src, /document\.body\.style\.top = `-\$\{scrollY\}px`/)
  assert.match(src, /window\.scrollTo\(0, scrollY\)/)
  // simple 配方：documentElement overflow 暂存还原
  assert.match(src, /document\.documentElement\.style\.overflow = 'hidden'/)
  // 条件挂载 + SSR guard + 依赖原语
  assert.match(src, /if \(!active \|\| typeof document === 'undefined'\) return/)
  assert.match(src, /\[active, mode\]/)
})

test('useLocalStorageState 导出契约：底层原语静默语义 + hook 惰性同步读 + write-through', () => {
  const src = read(HOOKS.storage)
  assert.match(src, /export const readStorage/)
  assert.match(src, /export const writeStorage/)
  assert.match(src, /export function useLocalStorageState/)
  // 原语：SSR/缺失/异常归 undefined；null 与校验失败同路
  assert.match(src, /typeof window === 'undefined'\) return undefined/)
  assert.match(src, /if \(raw === null\) return undefined/)
  assert.match(src, /validate && !validate\(raw\)/)
  assert.match(src, /\} catch \{\s*\n\s*return undefined/)
  // hook：惰性初始化同步读 + effect write-through + serialize/deserialize 经 ref 取最新（身份变化不加戏）
  assert.match(src, /useState<T>\(\(\) => \{/)
  assert.match(src, /const raw = readStorage\(key\)/)
  assert.match(src, /deserializeRef\.current/)
  assert.match(src, /serializeRef\.current/)
  assert.match(src, /writeStorage\(key, serializeRef\.current/)
  assert.match(src, /\[key, value\]/)
})

test('scheduleIdle 导出契约：idle timeout/fallbackMs 回落参数化 + cancel 闭包按分支收敛 + SSR 空函数', () => {
  const src = read(HOOKS.idle)
  assert.match(src, /export const scheduleIdle/)
  assert.match(src, /export \{ scheduleIdle as default \}/)
  assert.match(src, /timeout = 2000/)
  assert.match(src, /fallbackMs = timeout/)
  assert.match(src, /typeof window\.requestIdleCallback === 'function'/)
  assert.match(src, /window\.setTimeout\(callback, fallbackMs\)/)
  // 返回闭包 cancel：idle 分支 cancelIdleCallback、timer 分支 clearTimeout——不跨 id 空间
  assert.match(src, /return \(\) => \{[\s\S]*?window\.cancelIdleCallback\(id\)[\s\S]*?\}/)
  assert.match(src, /return \(\) => window\.clearTimeout\(timer\)/)
  assert.match(src, /typeof window === 'undefined'\) return \(\) => \{\}/)
})

test('滚动锁迁移文件禁现手写锁骨架（单一实现处收口）', () => {
  for (const rel of MIGRATED_LOCK) {
    const src = read(rel)
    assert.match(src, /@wuh\.site\/hooks\/useScrollLock/, `${rel} 应引用 useScrollLock`)
    assert.equal(src.match(/body\.style\.position/g), null, `${rel} 禁现 fixed 配方手写`)
    assert.equal(src.match(/(body|documentElement)\.style\.overflow = 'hidden'/g), null, `${rel} 禁现手写 overflow 锁`)
  }
})

test('存储迁移文件禁现裸 localStorage 访问（原语收口）', () => {
  for (const rel of MIGRATED_STORAGE) {
    const src = read(rel)
    assert.match(src, /@wuh\.site\/hooks\/useLocalStorageState/, `${rel} 应引用存储原语/hook`)
    assert.equal(src.match(/window\.localStorage\./g), null, `${rel} 禁现裸 window.localStorage 访问`)
  }
})

test('空闲调度迁移文件禁现手写 idle 分支调用', () => {
  for (const rel of MIGRATED_IDLE) {
    const src = read(rel)
    assert.match(src, /@wuh\.site\/hooks\/scheduleIdle/, `${rel} 应引用 scheduleIdle`)
    assert.equal(src.match(/\.requestIdleCallback\(/g), null, `${rel} 禁现手写 requestIdleCallback 调用`)
    assert.equal(src.match(/\.cancelIdleCallback\(/g), null, `${rel} 禁现手写 cancelIdleCallback 调用`)
  }
})

test('AppProviders ahooks 收敛：useEventListener 已替换、useRequest 暂留（非目标登记）', () => {
  const src = read('apps/site/app/components/AppProviders.tsx')
  assert.equal(src.match(/import\s*\{[^}]*useEventListener[^}]*\}\s*from\s*'ahooks'/), null, 'ahooks useEventListener 应已移除')
  assert.match(src, /from '@wuh\.site\/hooks\/useEventListener'/)
  assert.match(src, /useEventListener\([\s\S]*?'document'\)/, 'visibilitychange 目标应显式声明 document')
  assert.match(src, /useRequest/, 'useRequest 去 ahooks 为另项工程，此处必须仍在')
})

test('INTL_LOCALE 单源：locales 导出 + 消费文件禁本地重定义', () => {
  const locales = read('packages/components/locales/index.tsx')
  assert.match(locales, /export const INTL_LOCALE = LANG_BY_LOCALE/, 'INTL_LOCALE 必须从既有 LANG_BY_LOCALE 单源导出')
  assert.match(locales, /zh: 'zh-CN'/)
  for (const rel of INTL_CONSUMERS) {
    const src = read(rel)
    assert.match(src, /INTL_LOCALE[^\n]*from ['"]@wuh\.site\/components\/locales/, `${rel} 应从 locales import`)
    assert.equal(src.match(/const INTL_LOCALE: Record/g), null, `${rel} 禁现本地映射重定义`)
    assert.equal(src.match(/const DATE_LOCALES: Record/g), null, `${rel} 禁现本地映射重定义（PostComments 旧名）`)
  }
})

test('主题存储双源消除：themeStorage 单源 + layout 脚本注入 + provider 消费', () => {
  const storage = read('packages/components/themes/themeStorage.ts')
  assert.match(storage, /export const THEME_STORAGE_KEY = 'wuh\.site\.theme'/)
  assert.match(storage, /export const COLOR_SCHEME_STORAGE_KEY = 'wuh\.site\.color-scheme-mode'/)
  assert.match(storage, /THEME_FAMILY_VALUES = \['wine', 'plain'\]/)
  assert.match(storage, /COLOR_SCHEME_MODE_VALUES = \['system', 'light', 'dark'\]/)
  // 非 'use client' 模块——SSR layout 需读纯常量值（指令必须在文件首行才生效）
  assert.equal(/^'use client'/m.test(storage), false, 'themeStorage 不得标记 use client（RSC 值导入约束）')
  const layout = read('apps/site/app/layout.tsx')
  assert.match(layout, /from '@wuh\.site\/components\/themes\/themeStorage'/)
  assert.match(layout, /\$\{JSON\.stringify\(THEME_STORAGE_KEY\)\}/, '脚本 key 必须经常量注入')
  assert.match(layout, /\$\{JSON\.stringify\(THEME_FAMILY_VALUES\)\}\.includes/, '取值白名单必须经常量注入')
  assert.equal(layout.match(/getItem\('wuh\.site\.(theme|color-scheme-mode)'\)/), null, 'layout 禁现 key 字面量')
  const provider = read('apps/site/app/components/theme/ThemeModeProvider.tsx')
  assert.match(provider, /from '@wuh\.site\/components\/themes\/themeStorage'/)
})

test('白名单反查棘轮：实现处与内联脚本仍保有手写访问（被迁空即红）', () => {
  const expected = new Set([
    HOOKS.storage,
    'apps/site/app/layout.tsx',
  ])
  assert.equal(WHITELIST_STORAGE.length, expected.size)
  for (const rel of WHITELIST_STORAGE) {
    assert.ok(expected.has(rel), `白名单出现未登记文件: ${rel}`)
    const src = read(rel)
    assert.notEqual(src.match(/window\.localStorage\./g), null, `${rel} 已无手写 localStorage，请移出白名单`)
  }
  // 锁骨架白名单已收敛为零（除实现处外无手写站点）——实现处必须保有骨架
  const lockSrc = read(HOOKS.lock)
  assert.notEqual(lockSrc.match(/body\.style\.position/g), null, '实现处丢失 fixed 配方，契约已变')
})

test('image-preview 本地 useLockScroll 已删除且消费改走公开入口', () => {
  assert.equal(existsSync(resolve(root, 'packages/components/image-preview/hooks/useLockScroll.ts')), false, '本地 useLockScroll.ts 应已删除')
  const src = read('packages/components/image-preview/index.tsx')
  assert.match(src, /from '@wuh\.site\/hooks\/useScrollLock'/)
  assert.match(src, /mode: 'simple'/, 'image-preview 应使用 simple 配方（保持原语义）')
  assert.equal(src.match(/from '\.\/hooks\/useLockScroll'/g), null, '禁再引用已删除的本地实现')
})
