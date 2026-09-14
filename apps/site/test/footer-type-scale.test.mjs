import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(testDir, '../../..')
const footer = await readFile(resolve(repoRoot, 'packages/components/layout/styles/index.tsx'), 'utf8')

const block = (selector) => {
  const matched = footer.match(new RegExp(`${selector} \\{([\\s\\S]*?)\\n  \\}`))
  assert.ok(matched, `未找到样式块 ${selector}`)
  return matched[1]
}

test('页脚自持无衬线字体族', () => {
  // 页脚在页面容器之外，页面级 font-family 覆盖不到它，缺失会回落浏览器默认族
  assert.match(footer, /^\s*font-family: var\(--font-sans\);$/m)
})

test('页脚整层落在辅助字号档', () => {
  assert.match(footer, /font-size: var\(--font-size-xs\);/)
  // 素雅主题把 --font-size-sm 覆写为 15px（与 base 同值），页脚不得用该档分级
  assert.doesNotMatch(footer, /font-size: var\(--font-size-sm\);/)
  assert.equal(
    [...footer.matchAll(/font-size: var\(--font-size-base\);/g)].length,
    1,
    '--font-size-base 只允许 slogan 使用一次'
  )
})

test('页脚行高固定 1.8 / 1.5，不引用全站行高令牌', () => {
  // 全站令牌落不进 1.5–1.8：--line-height-body 素雅到 2.0、--line-height-heading 只有 1.35
  assert.match(footer, /--footer-lh: 1\.8;/)
  assert.match(footer, /--footer-lh-display: 1\.5;/)
  assert.match(footer, /^\s*line-height: var\(--footer-lh\);$/m)
  assert.doesNotMatch(footer, /line-height: var\(--line-height-(body|heading)\)/)
  for (const m of footer.matchAll(/--footer-lh(?:-display)?:\s*([\d.]+)/g)) {
    const value = Number(m[1])
    assert.ok(value >= 1.5 && value <= 1.8, `行高 ${value} 超出 1.5–1.8 区间`)
  }
  const numeric = [...footer.matchAll(/line-height:\s*([\d.]+)/g)].map((m) => m[0])
  assert.deepEqual(numeric, [], '行高数值只允许出现在 --footer-lh / --footer-lh-display 上')
})

test('slogan 是唯一展示行：base 档衬线 + 展示行高', () => {
  const slogan = block('\\.footer-slogan')
  assert.match(slogan, /font-family: var\(--font-serif\);/)
  assert.match(slogan, /font-size: var\(--font-size-base\);/)
  assert.match(slogan, /line-height: var\(--footer-lh-display\);/)
})

test('导航与注脚各行不再各自声明字号', () => {
  for (const selector of ['\\.footer-nav a', '\\.footer-beian a', '\\.footer-note', '\\.footer-data-item']) {
    assert.doesNotMatch(block(selector), /font-size:/, `${selector} 应继承根层字号`)
  }
})

test('区块间距由 margin 承担，行间不能只靠行高', () => {
  // linkUnderline 的 ::after 挂在行盒底部再往下 4px：行间只靠行高时它会落进下一行的盒子里
  const navRow = block('\\.footer-nav,\\s*\\.footer-beian')
  assert.match(navRow, /margin-bottom: var\(--space-sm\);/)
  assert.match(navRow, /row-gap: var\(--space-xs\);/)
  assert.match(block('\\.footer-note'), /margin-bottom: var\(--space-sm\);/)
  assert.match(block('\\.footer-ornament'), /margin: var\(--space-sm\) 0 var\(--space-base\);/)
  assert.match(block('\\.footer-slogan'), /margin: 0 0 var\(--space-xs\);/)
})

test('间距与偏移不写死 px，全部经令牌', () => {
  assert.match(footer, /bottom: calc\(var\(--space-xs\) \/ -2\);/)
  assert.match(footer, /bottom: calc\(100% \+ var\(--space-xs\)\);/)
  assert.match(footer, /padding: calc\(var\(--space-xs\) \/ 2\) var\(--space-xs\);/)
  assert.match(footer, /max-width: \$\{BREAKPOINTS\.mobile\}px;/)
  const spacingProps = 'margin|margin-top|margin-bottom|padding|padding-inline|gap|row-gap|column-gap|outline-offset|bottom|top|left|right'
  const bare = new RegExp(`(?:^|\\s)(?:${spacingProps}):\\s*[^;]*?\\d+(\\.\\d+)?px`, 'g')
  assert.deepEqual(footer.match(bare) ?? [], [], '间距类属性只能引用 --space-* / --border-radius-* 令牌')
})
