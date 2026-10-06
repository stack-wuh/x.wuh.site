import test from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'

// 纯函数模块，只 import ./tokens（无扩展名），注册 .ts 解析钩子即可，不牵 @ant-design/colors
registerHooks({
  resolve (specifier, context, next) {
    if (specifier.startsWith('./') && !/\.[a-z]+$/i.test(specifier)) {
      return next(new URL(`${specifier}.ts`, context.parentURL).href, context)
    }
    return next(specifier, context)
  },
})
const { getSpacingValue } = await import('./spacing.ts')

const theme = { spaces: { xs: '8px', sm: '16px', md: '24px' } }

test('number 折算 px、token 名查表、单位串透传（既有语义不变）', () => {
  assert.equal(getSpacingValue(8, theme), '8px')
  assert.equal(getSpacingValue('md', theme), '24px')
  assert.equal(getSpacingValue('12px', theme), '12px')
})

test('非对称盒式简写与 CSS 函数放行（兑现卡「CSS 字符串透传」承诺）', () => {
  // 多值简写（含空格）：不拼成 `0 0 0 calc(6px + var(--space-sm))px`
  assert.equal(getSpacingValue('0 0 0 calc(6px + var(--space-sm))', theme), '0 0 0 calc(6px + var(--space-sm))')
  assert.equal(getSpacingValue('8px 16px', theme), '8px 16px')
  // calc/var 函数（含括号）
  assert.equal(getSpacingValue('calc(100% - 24px)', theme), 'calc(100% - 24px)')
  // 关键字
  assert.equal(getSpacingValue('auto', theme), 'auto')
})

test('未知裸标识符仍按 px 兜底（不放行，保留原行为）', () => {
  assert.equal(getSpacingValue('nope', theme), 'nopepx')
})
