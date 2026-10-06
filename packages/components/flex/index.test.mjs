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

test('Flex layout props never leak to the DOM', () => {
  assert.match(indexSource, /const FLEX_ONLY_KEYS: \(keyof IFlexProps\)\[\] = \[/)
  assert.match(indexSource, /FLEX_ONLY_KEYS\.forEach\(\(key\) => delete/)
  assert.match(indexSource, /\$direction=\{props\.direction\}/)
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
