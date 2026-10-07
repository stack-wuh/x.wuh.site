import type { Tokens } from './tokens'

/**
 * @NOTE 获取 spacing 有效值（纯函数，独立于主题色生成，便于单测）。
 *
 * 解析顺序：number→px；spaces token 名→主题值；CSS 长度串透传；
 * 盒式简写/函数（含空格或括号）与关键字（auto 等）透传；未知裸标识符按 px 兜底。
 *
 * 兑现 layout-components 卡「非对称盒式简写走 CSS 字符串」承诺：
 * 如 margin 简写 `0 0 0 calc(6px + var(--space-sm))` 原样透传，不再被拼成 `…px`。
 *
 * @param { string|number } value - spacing 值
 * @param { Tokens } theme - 主题对象
 * @returns { string } - 有效的 spacing 值
 */
export const getSpacingValue = (value: string | number, theme?: Tokens): string => {
  if (typeof value === 'number') {
    return `${value}px`
  }

  if (typeof value === 'string') {
    const spaceValue = theme?.spaces?.[value as keyof typeof theme.spaces]
    if (spaceValue) {
      return spaceValue
    }

    // CSS 单位结尾直接返回
    if (/(px|em|rem|%|vh|vw)$/.test(value)) {
      return value
    }

    // 多值简写（含空格）、calc/var/env（含括号）、尺寸关键字 → 原样透传
    if (/[(\s]/.test(value) || /^(auto|fit-content|max-content|min-content|inherit|initial|unset|none)$/.test(value)) {
      return value
    }

    return `${value}px`
  }

  return '0'
}
