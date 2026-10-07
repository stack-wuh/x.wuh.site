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
const { RESPONSIVE_LADDER, ladderSlots, responsive } = await import('./responsive.ts')

const dir = dirname(fileURLToPath(import.meta.url))
const source = await readFile(resolve(dir, 'responsive.ts'), 'utf8')
const breakpointsSource = await readFile(resolve(dir, 'breakpoints.ts'), 'utf8')

test('ladder boundaries derive from BREAKPOINTS +1, never raw literals', () => {
  assert.deepEqual(RESPONSIVE_LADDER, [521, 641, 1024])
  assert.match(source, /BREAKPOINTS\.small \+ 1/)
  assert.match(source, /BREAKPOINTS\.mobile \+ 1/)
  assert.match(source, /BREAKPOINTS\.tablet(?!\s*\+)/)
  // 剥注释后代码体不得出现裸断点数值（文档注释提及不违规）
  const codeOnly = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
  assert.doesNotMatch(codeOnly, /\b(640|520|1024|768|480|560|767|521|641)\b/)
  assert.match(breakpointsSource, /mobile: 640/)
  assert.match(breakpointsSource, /tablet: 1024/)
})

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

test('undefined value compiles to empty string (prop absent emits nothing)', () => {
  assert.equal(responsive(undefined, () => 'gap: 8px;'), '')
})

test('two-slot array compiles baseline plus sm media block (521)', () => {
  const css = responsive([1, 3], (v) => `grid-template-columns: repeat(${v}, 1fr);`)
  assert.match(css, /^grid-template-columns: repeat\(1, 1fr\);/)
  assert.match(css, /@media \(min-width: 521px\)/)
  assert.match(css, /grid-template-columns: repeat\(3, 1fr\);/)
  assert.doesNotMatch(css, /1024px/, 'two-slot is the sm rung now, not tablet')
})

test('four-slot array compiles base plus sm/md/lg media blocks in ascending order', () => {
  const css = responsive(
    ['column', 'row', 'row', 'row-reverse'],
    (v) => `flex-direction: ${v};`,
  )
  assert.match(css, /^flex-direction: column;/)
  const smAt = css.indexOf('@media (min-width: 521px)')
  const mdAt = css.indexOf('@media (min-width: 641px)')
  const lgAt = css.indexOf('@media (min-width: 1024px)')
  assert.ok(smAt > 0 && mdAt > smAt && lgAt > mdAt, 'rungs emit ascending')
  assert.match(css.slice(lgAt), /flex-direction: row-reverse;/)
})

test('sparse slots skip absent rungs; lower declaration naturally continues', () => {
  const css = responsive(['column', undefined, 'row'], (v) => `flex-direction: ${v};`)
  assert.match(css, /^flex-direction: column;/)
  assert.doesNotMatch(css, /@media \(min-width: 521px\)/, 'sm slot absent → no 521 block')
  assert.match(css, /@media \(min-width: 641px\)[\s\S]*flex-direction: row;/, 'md slot present → 641 block')
})

test('slots beyond the three upper rungs are ignored at compile time', () => {
  const css = responsive(['a', 'b', 'c', 'd', 'e'], (v) => `x: ${v};`)
  assert.match(css, /^x: a;/)
  assert.equal((css.match(/@media/g) ?? []).length, 3, 'at most 3 media blocks (521/641/1024)')
  assert.doesNotMatch(css, /x: e;/)
})

test('ladderSlots normalizes scalar to a single-slot array', () => {
  assert.deepEqual(ladderSlots('a'), ['a'])
  assert.deepEqual(ladderSlots(['a', 'b']), ['a', 'b'])
})

// 批次5 契约：decl 声明串可含嵌套选择器（&:active / ::before 等）逐字透传进媒体块，
// SC v6.4.2 SSR 展开实测正确挂宿主类、媒体块提升后级联方向不变（九宫格移动端伪类组的落位依据）。
test('decl may return nested-selector strings, passed through verbatim into media blocks', () => {
  const css = responsive(
    ['&:active { background: red; }', undefined, '&:active { background: blue; }'],
    (v) => v,
  )
  assert.ok(css.startsWith('&:active { background: red; }'), 'baseline 嵌套串逐字在场')
  assert.match(
    css,
    /@media \(min-width: 641px\)[\s\S]*&:active \{ background: blue; \}/,
    'md 槽嵌套声明进 641 媒体块',
  )
  // 文档承诺同步：源码注释必须声明嵌套选择器可用（旧措辞「不含嵌套选择器」作废）
  assert.match(source, /decl 可含嵌套选择器串/)
})
