import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// 事件副作用四件套纪律守卫（change 20261013-refactor-shared-event-hooks）：
// 1) 四件套导出契约与 SSR/清理实现约束；2) 已迁移消费文件禁现裸 addEventListener；
// 3) workspace 依赖声明在位；4) image-preview 本地 useMediaQuery 已删除并改走公开入口。
// 仅读源码文本，不 import .ts——node ≥ 22 可跑（SGN-002 豁免）。
const dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(dir, '..', '..', '..')
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

const HOOKS = {
  listener: 'packages/hooks/useEventListener/index.ts',
  media: 'packages/hooks/useMediaQuery/index.ts',
  key: 'packages/hooks/useKeyPress/index.ts',
  outside: 'packages/hooks/useClickOutside/index.ts',
}

// 已迁移消费文件：必须走 @wuh.site/hooks 事件原语，禁现裸 addEventListener
const MIGRATED = [
  'packages/components/icons/iconfont-context.tsx',
  'packages/components/image-preview/index.tsx',
  'packages/components/image-preview/hooks/useKeyboard.ts',
  'packages/components/audio-player/PlayerPanel.tsx',
  'packages/components/audio-player/panel/PanelVolume.tsx',
  'packages/components/dialog/index.tsx',
  'packages/components/image/index.tsx',
  'apps/site/app/components/theme/ThemeModeProvider.tsx',
  'apps/site/app/components/SiteHeader/index.tsx',
  'apps/site/app/music/MusicView/index.tsx',
  'apps/site/app/post/usePostImagePreview.ts',
  'apps/site/app/about/components/GuestbookBarrageDialog.tsx',
  'apps/site/app/blog/components/TitleWithTooltip/index.tsx',
  // wave2（20261014）：兑现「触碰时收敛」条款，ahooks useEventListener 已替换为 @wuh.site/hooks 原语
  'apps/site/app/components/AppProviders.tsx',
]

// 白名单=已登记非目标（brief「执行偏差」）与唯一实现处，出现 addEventListener 合法
const WHITELIST = [
  HOOKS.listener, // 原语唯一实现处
  'packages/components/cursor/index.tsx', // 引擎闭包 + 源码字面量守卫
  'packages/components/audio-player/provider.tsx', // new Audio() 元素重建
  'apps/site/app/components/ContactCard.tsx', // hasLink 节点重建
  'packages/components/footprint-map/index.tsx', // Leaflet 命令式绑定
]

test('useEventListener 导出契约：命名+默认导出、事件名/类型/最新值/清理/SSR 约束在位', () => {
  const src = read(HOOKS.listener)
  assert.match(src, /export function useEventListener\(/)
  assert.match(src, /export default useEventListener/)
  assert.match(src, /interface UseEventListenerOptions/)
  assert.match(src, /enabled\?: boolean/)
  // handler 最新值：ref 存储 + effect 内读取
  assert.match(src, /const handlerRef = useRef\(handler\)/)
  assert.match(src, /handlerRef\.current\(event\)/)
  // 建立与清理必须成对
  assert.match(src, /\.addEventListener\(eventName, listener, listenerOptions\)/)
  assert.match(src, /\.removeEventListener\(eventName, listener, listenerOptions\)/)
  // SSR guard
  assert.match(src, /typeof window === 'undefined'/)
  // 依赖数组以原语参与（options 对象身份不触发重绑）
  assert.match(src, /\[eventName, target, enabled, capture, once, passive\]/)
})

test('useMediaQuery 导出契约：SSR 占位 + 首帧同步 + 委托原语监听', () => {
  const src = read(HOOKS.media)
  assert.match(src, /export const useMediaQuery/)
  assert.match(src, /export default useMediaQuery/)
  assert.match(src, /defaultValue\?: boolean/)
  assert.match(src, /typeof window === 'undefined'/)
  // 挂载后同步真实值，再委托 useEventListener 订阅 change
  assert.match(src, /setMatches\(mql\.matches\)/)
  assert.match(src, /from '..\/useEventListener'/)
  assert.equal(src.match(/addEventListener/g), null, 'useMediaQuery 不得绕过原语直接 addEventListener')
})

test('useKeyPress 导出契约：单键/组合键/别名表 + 修饰键宽松语义', () => {
  const src = read(HOOKS.key)
  assert.match(src, /export const useKeyPress/)
  assert.match(src, /export default useKeyPress/)
  assert.match(src, /interface UseKeyPressOptions/)
  assert.match(src, /enabled\?: boolean/)
  assert.match(src, /preventDefault\?: boolean/)
  assert.match(src, /'window' \| 'document' \| HTMLElement \| RefObject<HTMLElement \| null>/)
  assert.match(src, /KEY_ALIASES/)
  assert.match(src, /esc: \['escape', 'esc'\]/)
  assert.match(src, /space: \[' ', 'space'\]/)
  // 声明的修饰键必须按下、未声明不否决（与存量「只判 event.key」等价）
  assert.match(src, /if \(spec\.modifiers\.ctrl && !event\.ctrlKey\) return false/)
  assert.match(src, /from '..\/useEventListener'/)
})

test('useClickOutside 导出契约：ref + enabled + 默认 pointerdown + contains 判定', () => {
  const src = read(HOOKS.outside)
  assert.match(src, /export const useClickOutside/)
  assert.match(src, /export default useClickOutside/)
  assert.match(src, /enabled\?: boolean/)
  assert.match(src, /event = 'pointerdown'/)
  assert.match(src, /\.contains\(nativeEvent\.target as Node\)/)
  assert.match(src, /'document'/)
  assert.match(src, /from '..\/useEventListener'/)
})

test('三合成 hook 复用原语且不裸加监听（清理语义单点保证）', () => {
  for (const rel of [HOOKS.media, HOOKS.key, HOOKS.outside]) {
    const src = read(rel)
    assert.match(src, /useEventListener\(/, `${rel} 必须组合 useEventListener`)
    assert.equal(src.match(/\.addEventListener\(/g), null, `${rel} 不得直接 addEventListener`)
  }
})

test('已迁移消费文件禁现裸 addEventListener', () => {
  for (const rel of MIGRATED) {
    const src = read(rel)
    assert.match(src, /@wuh\.site\/hooks\/(useEventListener|useMediaQuery|useKeyPress|useClickOutside)/, `${rel} 应引用事件原语`)
    assert.equal(src.match(/\.addEventListener\(/g), null, `${rel} 禁现裸 addEventListener`)
  }
})

test('白名单文件与登记清单一一对应（偏差清单膨胀即红）', () => {
  const expected = new Set([
    HOOKS.listener,
    'packages/components/cursor/index.tsx',
    'packages/components/audio-player/provider.tsx',
    'apps/site/app/components/ContactCard.tsx',
    'packages/components/footprint-map/index.tsx',
  ])
  assert.equal(WHITELIST.length, expected.size)
  for (const rel of WHITELIST) {
    assert.ok(expected.has(rel), `白名单出现未登记文件: ${rel}`)
    // 白名单文件的价值恰恰是存在手写监听；若被迁空应移出白名单（棘轮只减不增的反向核对）
    const src = read(rel)
    if (rel !== HOOKS.listener) {
      assert.notEqual(src.match(/\.addEventListener\(/g), null, `${rel} 已无手写监听，请移出白名单`)
    }
  }
})

test('workspace 依赖声明：site 与 components 均声明 @wuh.site/hooks', () => {
  for (const pkg of ['apps/site/package.json', 'packages/components/package.json']) {
    const json = JSON.parse(read(pkg))
    assert.equal(json.dependencies['@wuh.site/hooks'], 'workspace:^', `${pkg} 缺少 @wuh.site/hooks 声明`)
  }
})

test('image-preview 本地 useMediaQuery 已删除且消费改走公开入口', () => {
  assert.equal(existsSync(resolve(root, 'packages/components/image-preview/hooks/useMediaQuery.ts')), false, '本地 useMediaQuery.ts 应已删除')
  const src = read('packages/components/image-preview/index.tsx')
  assert.match(src, /from '@wuh\.site\/hooks\/useMediaQuery'/)
  assert.equal(src.match(/from '\.\/hooks\/useMediaQuery'/g), null, '禁再引用已删除的本地实现')
})
