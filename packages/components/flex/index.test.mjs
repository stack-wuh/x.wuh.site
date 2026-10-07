import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const componentDir = dirname(fileURLToPath(import.meta.url))
const indexSource = await readFile(resolve(componentDir, 'index.tsx'), 'utf8')
const specsSource = await readFile(resolve(componentDir, 'specs.tsx'), 'utf8')

test('Flex is a responsive distribution primitive compiled through the breakpoint helper', () => {
  assert.match(indexSource, /import \{ responsive \} from '@wuh\.site\/components\/themes\/responsive'/)
  assert.match(indexSource, /responsive\(props\.\$direction \?\? 'row'/)
  assert.match(indexSource, /responsive\(props\.\$justifyContent \?\? 'flex-start'/)
  assert.match(indexSource, /responsive\(props\.\$alignItems \?\? 'flex-start'/)
  assert.match(indexSource, /responsive\(props\.\$wrap/)
  assert.match(indexSource, /React\.forwardRef<HTMLDivElement, IFlexProps>/)
})

test('core props are typed as breakpoint slots in specs', () => {
  for (const prop of ['direction', 'justifyContent', 'alignItems', 'gap', 'wrap', 'padding', 'margin']) {
    assert.match(specsSource, new RegExp(`${prop}\\?: TResponsive<`), `${prop} must accept TResponsive`)
  }
  // 旧 [row, column] / 四值盒式简写元组让位给断点槽语法
  assert.doesNotMatch(specsSource, /TFlexGap|TFlexSpace/)
})

test('gap padding margin resolve through spacing tokens, never unitless numbers', () => {
  assert.match(indexSource, /getSpacingValue|lengthValue\(v, props\.theme\)/)
  assert.match(indexSource, /const lengthValue = /)
  assert.match(indexSource, /typeof value === 'number' \? `\$\{value\}px`/)
})

test('Flex keeps only the alignment alias set; Row alias belongs to the grid row package', () => {
  assert.doesNotMatch(indexSource, /export const Row\b|export const RowReverse\b/)
  for (const alias of ['Column', 'Center', 'CenterHorizontal', 'CenterVertical', 'SpaceBetween', 'SpaceAround', 'SpaceEvenly', 'InlineFlex']) {
    assert.match(indexSource, new RegExp(`export const ${alias} = styled\\(Flex\\)`), `${alias} alias retained`)
  }
  // 单 bool/尺寸糖已删，由 props 直给
  assert.doesNotMatch(indexSource, /export const (Wrap|NoWrap|FlexEnd|FlexStart|AlignTop|AlignBottom|FullWidth|FullHeight|FullSize) =/)
})

test('Flex layout props never leak to the DOM (destructured out, not delete-cast)', () => {
  // 布局 props 解构剔除，hidden 等原生同名属性不会带错误类型泄进 styled.div
  assert.match(indexSource, /const \{[\s\S]*?hidden, width, height[\s\S]*?\.\.\.domProps\s*\} = props/)
  assert.match(indexSource, /\$hidden=\{hidden\}/)
  assert.match(indexSource, /\$direction=\{direction\}/)
})

test('Flex adds ladder-responsive hidden and width/height (#499)', () => {
  // hidden 编译段在模板尾部——覆盖初始 display、媒体块后段胜出
  const hiddenAt = indexSource.indexOf('responsive(props.$hidden')
  const flexBasisAt = indexSource.indexOf('props.$flexBasis')
  assert.ok(hiddenAt > 0, 'hidden ladder compile present')
  assert.ok(hiddenAt < flexBasisAt, 'hidden emitted before & > * block (top-level tail, after sizing)')
  assert.match(indexSource, /display: \$\{props\.\$inline \? 'inline-flex' : 'flex'\}/, 'false 档恢复值按 $inline 内推')
  assert.match(indexSource, /responsive\(props\.\$width, \(v\) => `width: \$\{lengthValue\(v, props\.theme\)\};`\)/)
  assert.match(indexSource, /responsive\(props\.\$height, \(v\) => `height: \$\{lengthValue\(v, props\.theme\)\};`\)/)
  // CSS 关键字直通（防 getSpacingValue 把 'auto' 拼成 'autopx'）
  assert.match(indexSource, /const CSS_LENGTH_KEYWORDS = \//)
  assert.match(indexSource, /CSS_LENGTH_KEYWORDS\.test\(value\)/)
  assert.match(indexSource, /auto\|fit-content\|max-content\|min-content/)
  // 剥离面（transient props + 解构剔除）
  assert.match(indexSource, /\$hidden\?: IFlexProps\['hidden'\]/)
  assert.match(indexSource, /inline, hidden, width, height/)
  assert.match(specsSource, /hidden\?: TResponsive<boolean>/)
  assert.match(specsSource, /width\?: TResponsive<string \| number>/)
  assert.match(specsSource, /height\?: TResponsive<string \| number>/)
})

test('Flex adds ladder-responsive maxWidth (#508)', () => {
  // 编译段与 width 同口同构（themes/responsive.ts 唯一编译口 + lengthValue 关键字直通）；
  // 标量直编/阶梯出 min-width media 块/稀疏槽跳过由 responsive.test.mjs 在 helper 层钉死，
  // 本层钉死 max-width 的确切编译行，杜绝旁路
  assert.match(
    indexSource,
    /responsive\(props\.\$maxWidth, \(v\) => `max-width: \$\{lengthValue\(v, props\.theme\)\};`\)/,
  )
  assert.match(indexSource, /\$maxWidth\?: IFlexProps\['maxWidth'\]/)
  assert.match(indexSource, /\$maxWidth=\{maxWidth\}/)
  // 剥离面：解构清单含 maxWidth（同 width/height，杜绝 prop 泄进 DOM）
  assert.match(indexSource, /hidden, width, height, maxWidth/)
  assert.match(specsSource, /maxWidth\?: TResponsive<string \| number>/)
  // 词汇文档：与 height「同 width」注释并列，声明数组=断点槽
  assert.match(specsSource, /最大宽度：同 width；数组 = 断点槽/)
})

test('Flex obeys component-package style discipline', () => {
  // styled-components 内部 useContext(ThemeContext)，消费惯例要求客户端边界（divider/card/tag 同规）
  assert.match(indexSource, /^'use client'/)
  for (const source of [indexSource, specsSource]) {
    assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}\b/)
    assert.doesNotMatch(source, /--motion-/)
    // 断点只经 responsive helper，组件源码内不得出现 @media 字面量
    assert.doesNotMatch(source, /@media/)
    assert.doesNotMatch(source, /\b(640|520|1024|768|480|560|767)\b/)
    assert.doesNotMatch(source, /from 'next|from "next/)
    assert.doesNotMatch(source, /addEventListener/)
  }
})
