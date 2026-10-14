import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

// 断点裸值扫描守卫（change 20261014-refactor-responsive-sweep）：
// 组件库层与 site 层媒体查询断点零裸数值——所有 @media (min|max-width: Npx) 与
// JS 侧 matchMedia/useMediaQuery 参数字面必须经 BREAKPOINTS / OFF_LADDER_BREAKPOINTS 语义常量
// 或 responsive() 编译口（模板插值形态天然不含裸数字）。扫描范围：
// packages/components + apps/site/app，排除 *.test.* 与 themes/breakpoints.ts 定义处。
const dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(dir, '..', '..', '..')
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

const RAW_MEDIA = /@media\s*\((?:min|max)-width:\s*\d+px/
const RAW_JS_MEDIA = /(?:matchMedia|useMediaQuery)\(\s*[`'"]\s*(?:min|max)-width:\s*\d+px/

const SKIP_DIRS = new Set(['node_modules', 'dist', '.next', 'test'])

const collect = (base) => {
  const out = []
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      if (SKIP_DIRS.has(name)) continue
      const p = join(d, name)
      const st = statSync(p)
      if (st.isDirectory()) { walk(p); continue }
      if (!/\.(ts|tsx)$/.test(name) || /\.test\.(ts|tsx|mjs)$/.test(name)) continue
      if (p.replace(/\\/g, '/').endsWith('themes/breakpoints.ts')) continue
      out.push(p)
    }
  }
  walk(base)
  return out
}

const SCOPES = [
  resolve(root, 'packages/components'),
  resolve(root, 'apps/site/app'),
]

const allFiles = SCOPES.flatMap(collect)

test('全域媒体行零裸数值：@media 与 JS 侧 matchMedia/useMediaQuery 必须经语义常量或编译口', () => {
  const offenders = []
  for (const file of allFiles) {
    const src = readFileSync(file, 'utf8')
    const lines = src.split('\n')
    lines.forEach((line, i) => {
      const stripped = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '')
      if (RAW_MEDIA.test(stripped) || RAW_JS_MEDIA.test(stripped)) {
        offenders.push(`${file.replace(root + '/', '')}:${i + 1}→ ${stripped.trim().slice(0, 80)}`)
      }
    })
  }
  assert.deepEqual(offenders, [], `出现裸断点数值媒体行 ${offenders.length} 处：\n${offenders.join('\n')}`)
})

test('阶梯外常量单源：OFF_LADDER_BREAKPOINTS 值冻结（767/480/768 逐字钉死）', () => {
  const src = read('packages/components/themes/breakpoints.ts')
  assert.match(src, /export const OFF_LADDER_BREAKPOINTS = \{/)
  assert.match(src, /previewMobile: 767/)
  assert.match(src, /paginationCompact: 480/)
  assert.match(src, /mapStack: 768/)
  // 阶梯成员不得被扩编：BREAKPOINTS 三键派生不动
  assert.match(src, /export const BREAKPOINTS = \{[\s\S]*?mobile: 640[\s\S]*?small: 520[\s\S]*?tablet: 1024[\s\S]*?\} as const/)
})

test('image-preview CSS/JS 双源收敛到同一常量', () => {
  for (const rel of ['packages/components/image-preview/styles/index.tsx', 'packages/components/image-preview/index.tsx']) {
    const src = read(rel)
    assert.match(src, /OFF_LADDER_BREAKPOINTS/, `${rel} 必须引用阶梯外常量`)
    assert.match(src, /previewMobile/, `${rel} 必须消费 previewMobile（767 单源）`)
  }
})

test('收编台账：纯声明块已走 responsive() 编译口（dialog/site-styles/GAP/barrage）', () => {
  for (const rel of [
    'packages/components/dialog/styles/index.tsx',
    'apps/site/app/styles/index.ts',
    'apps/site/app/components/player/GlobalAudioPlayer.tsx',
    'apps/site/app/about/components/guestbook-barrage.styles.ts',
  ]) {
    const src = read(rel)
    assert.match(src, /from '@wuh\.site\/components\/themes\/responsive'|from '\.\.\/\.\.\/\.\.\/packages\/components\/themes\/responsive'|themes\/responsive/, `${rel} 应引用编译口`)
    assert.match(src, /responsive\(/, `${rel} 收编块应使用 responsive()`)
  }
})

test('阶梯边界不受扩编影响：RESPONSIVE_LADDER 仍由 BREAKPOINTS 派生（521/641/1024）', () => {
  const src = read('packages/components/themes/responsive.ts')
  assert.match(src, /BREAKPOINTS\.small \+ 1/)
  assert.match(src, /BREAKPOINTS\.mobile \+ 1/)
  assert.match(src, /BREAKPOINTS\.tablet/)
  assert.equal(RAW_MEDIA.test(src.replace(/\$\{[^}]*\}/g, 'V')), false, 'responsive.ts 本体不得出现裸数值 @media')
})

test('site 保留项注记与常量双在位：post/SiteHeader/guestbook/pagination/cssVariableProvider/link-group', () => {
  const retained = [
    'apps/site/app/post/styles/post-floating.ts',
    'apps/site/app/post/styles/post-header.ts',
    'apps/site/app/components/SiteHeader/styles/index.ts',
    'apps/site/app/guestbook/GuestbookPageView/styles/index.tsx',
    'packages/components/pagination/styles/index.tsx',
    'packages/components/themes/cssVariableProvider.tsx',
    'packages/components/link-group/styles/index.tsx',
  ]
  for (const rel of retained) {
    const src = read(rel)
    assert.match(src, /BREAKPOINTS|OFF_LADDER_BREAKPOINTS/, `${rel} 保留媒体行必须引用语义常量`)
    assert.match(src, /保留|范围外|⑩|⑭|批次|阶梯外|非编译口射程|transient|瞬态/, `${rel} 保留块必须有范围外注记`)
  }
})
