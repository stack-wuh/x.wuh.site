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

test('行高只走设计系统令牌，不写死数值', () => {
  assert.match(footer, /^\s*line-height: var\(--line-height-body\);$/m)
  assert.doesNotMatch(footer, /line-height:\s*\d/)
})

test('slogan 是唯一展示行：base 档衬线 + heading 行高', () => {
  const slogan = block('\\.footer-slogan')
  assert.match(slogan, /font-family: var\(--font-serif\);/)
  assert.match(slogan, /font-size: var\(--font-size-base\);/)
  assert.match(slogan, /line-height: var\(--line-height-heading\);/)
})

test('导航与注脚各行不再各自声明字号', () => {
  for (const selector of ['\\.footer-nav a', '\\.footer-beian a', '\\.footer-note', '\\.footer-data-item']) {
    assert.doesNotMatch(block(selector), /font-size:/, `${selector} 应继承根层字号`)
  }
})

test('纵向节奏全部交给行高：页脚区块不带上下 margin', () => {
  // 行与行的间距只能来自行盒 leading；间距 token 不得再出现在 margin 上
  assert.doesNotMatch(footer, /margin-(top|bottom):\s*var\(--space/)
  assert.doesNotMatch(footer, /margin:\s*var\(--space/)
  for (const selector of ['\\.footer-ornament', '\\.footer-slogan', '\\.footer-nav,\\s*\\.footer-beian', '\\.footer-note', '\\.footer-data-line']) {
    assert.doesNotMatch(block(selector), /margin-(top|bottom):/, `${selector} 不应带上下 margin`)
  }
})
