import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(testDir, '../../..')
const base = 'apps/site/app/components/TypewriterMotto'
const styles = await readFile(resolve(repoRoot, base, 'styles.ts'), 'utf8')
const tsx = await readFile(resolve(repoRoot, base, 'index.tsx'), 'utf8')

const block = (decl) => {
  const matched = styles.match(new RegExp(`${decl}\`([\\s\\S]*?)\``))
  assert.ok(matched, `未找到样式块 ${decl}`)
  return matched[1]
}

test('隐藏占位字锁定容器高度', () => {
  // 布局稳定与内容同源：in-flow 的不可见最长句决定行数，打字进度无关，随断点/主题字号自适应
  const sizer = block('export const Sizer = styled\\.span')
  assert.match(sizer, /visibility: hidden;/)
  assert.match(sizer, /display: block;/)
  assert.match(sizer, /user-select: none;/)
})

test('内容覆盖层绝对定位、inset 与容器 padding 同令牌', () => {
  const content = block('export const Content = styled\\.span')
  assert.match(content, /position: absolute;/)
  assert.match(content, /inset: var\(--space-md\) 0;/)
  assert.match(content, /display: flex;/)
  assert.match(content, /align-items: center;/)
  assert.match(content, /justify-content: center;/)
  // 容器纵向 padding 仍是 space-md：inset 与它同源，否则覆盖层错位
  assert.match(block('export const Container = styled\\.div'), /padding: var\(--space-md\) 0;/)
})

test('组件结构：占位字在前，文字与光标在覆盖层内', () => {
  assert.match(tsx, /<S\.Sizer aria-hidden[^>]*>\{SIZER_TEXT\}<\/S\.Sizer>/)
  assert.ok(tsx.indexOf('<S.Sizer') < tsx.indexOf('<S.Content'), 'Sizer 必须先于 Content 渲染')
  const overlay = tsx.match(/<S\.Content>[\s\S]*?<\/S\.Content>/)?.[0] ?? ''
  assert.ok(overlay, '未找到 Content 覆盖层')
  assert.match(overlay, /<S\.TextWrap ref=\{textRef\}/)
  assert.match(overlay, /<S\.Cursor/)
  // 无障碍语义不变：全句仍在容器 aria-label
  assert.match(tsx, /aria-label=\{PHRASES\[phraseIdx\]\}/)
})

test('占位文本由 PHRASES 推导，文案不复制第二份', () => {
  assert.match(tsx, /const SIZER_TEXT = PHRASES\.reduce\(\(longer, p\) => \(p\.length > longer\.length \? p : longer\)\)/)
  const first = '写作是抵抗遗忘的方式，代码是构建世界的语言。'
  assert.equal(
    tsx.split(first).length - 1,
    1,
    '第一句只允许出现在 PHRASES 一处（Sizer 必须引用推导值）'
  )
})
