import { Tokens } from './tokens'
import themeColors from './generator-color'
export { BREAKPOINTS } from './breakpoints'
export const DefaultTheme: Tokens = {
  colors: {
    primary: '#C94A44', // 酒红
    secondary: '#A19090',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    text: '#2A1E16',
    background: '#F5F0EC'
  },
  primary: themeColors.primary,
  danger: themeColors.danger,
  success: themeColors.success,
  warning: themeColors.warning,
  normal: themeColors.normal,
  background: themeColors.background,
  // 大间距随视口收缩（窄屏收紧、桌面封顶原值），小间距保持固定
  spaces: {
    none: '0px',
    xs: '8px',
    sm: '16px',
    base: '12px',
    md: 'clamp(20px, 4vw, 28px)',
    lg: 'clamp(24px, 5vw, 36px)',
    xl: 'clamp(32px, 6vw, 48px)',
    '2xl': 'clamp(48px, 8vw, 72px)',
    '3xl': 'clamp(64px, 10vw, 96px)'
  },
  fontSizes: {
    none: '0px',
    xs: '12px',
    sm: '13px',
    base: '15px',
    md: '17px',
    lg: '22px',
    xl: '30px',
    '2xl': '38px',
    '3xl': '52px'
  },
  borderRadius: {
    none: '0px',
    xs: '2px',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px'
  },
  motion: {
    'ease-out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
    'ease-in-out-soft': 'cubic-bezier(0.45, 0, 0.25, 1)',
    'dur-quick': '150ms',
    'dur-reveal': '600ms',
    'dur-write': '400ms'
  }
}

/**
 * @NOTE 获取spacing有效值
 *
 * @param { string|number } value - spacing值
 * @param { Tokens } theme - 主题对象
 * @returns { string } - 有效的spacing值
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

    // 如果是 CSS 单位直接返回
    if (/(px|em|rem|%|vh|vw)$/.test(value)) {
      return value
    }

    return `${value}px`
  }

  return '0'
}
