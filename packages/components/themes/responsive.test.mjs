import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { registerHooks } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// node 原生 type stripping 不重写无扩展名 import（responsive.ts 内部引 ./breakpoints），
// 测试内注册解析钩子补 .ts 后缀——源码保持仓内无扩展名惯例，不为此加新文件。
registerHooks({
  resolve (specifier, context, next) {
    if (specifier.startsWith('./') && !/\.[a-z]+$/i.test(specifier)) {
      return next(new URL(`${specifier}.ts`, context.parentURL).href, context)
    }
    return next(specifier, context)
  },
})
const { hasTabletSlot, responsive, responsiveSlots } = await import('./responsive.ts')

const dir = dirname(fileURLToPath(import.meta.url))
const source = await readFile(resolve(dir, 'responsive.ts'), 'utf8')
const breakpointsSource = await readFile(resolve(dir, 'breakpoints.ts'), 'utf8')

test('scalar value compiles to a single declaration, no media block', () => {
  const css = responsive('row', (v) => `flex-direction: ${v};`)
  assert.equal(css, 'flex-direction: row;')
  assert.doesNotMatch(css, /@media/)
})

test('one-element array equals scalar (explicit baseline-only)', () => {
  const css = responsive(['row'], (v) => `flex-direction: ${v};`)
  assert.equal(css, 'flex-direction: row;')
  assert.doesNotMatch(css, /@media/)
})

test('two-slot array compiles baseline plus tablet media block', () => {
  const css = responsive([1, 3], (v) => `grid-template-columns: repeat(${v}, 1fr);`)
  assert.match(css, /^grid-template-columns: repeat\(1, 1fr\);/)
  assert.match(css, /@media \(min-width: 1024px\)/)
  assert.match(css, /grid-template-columns: repeat\(3, 1fr\);/)
})

test('undefined value compiles to empty string (prop absent emits nothing)', () => {
  assert.equal(responsive(undefined, () => 'gap: 8px;'), '')
})

test('hasTabletSlot only reports true for a filled second slot', () => {
  assert.equal(hasTabletSlot('row'), false)
  assert.equal(hasTabletSlot(['row']), false)
  assert.equal(hasTabletSlot(['row', undefined]), false)
  assert.equal(hasTabletSlot(['row', 'column']), true)
})

test('responsiveSlots splits base and tablet, tablet absent stays undefined', () => {
  assert.deepEqual(responsiveSlots('a'), { base: 'a' })
  assert.deepEqual(responsiveSlots(['a']), { base: 'a', tablet: undefined })
  assert.deepEqual(responsiveSlots(['a', 'b']), { base: 'a', tablet: 'b' })
})

test('media query is built from BREAKPOINTS semantic constant, never a literal breakpoint', () => {
  assert.match(source, /import \{ BREAKPOINTS \} from '\.\/breakpoints'/)
  assert.match(source, /@media \(min-width: \$\{BREAKPOINTS\.tablet\}px\)/)
  // 剥除注释后，responsive.ts 代码体不得出现裸断点数值（文档注释提及断点不违规）
  const codeOnly = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
  assert.doesNotMatch(codeOnly, /\b(640|520|1024|768|480|560|767)\b/)
  // BREAKPOINTS 定义本身保持三档语义常量
  assert.match(breakpointsSource, /mobile: 640/)
  assert.match(breakpointsSource, /tablet: 1024/)
})
