import { Tokens, cssVariablesTokens } from './tokens'
import themeColors from './generator-color'
export const DefaultTheme: Tokens = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    text: '#212529',
    background: '#ffffff'
  },
  primary: themeColors.primary,
  danger: themeColors.danger,
  success: themeColors.success,
  warning: themeColors.warning,
  normal: themeColors.normal,
  background: themeColors.background,
  spaces: {
    none: '0px',
    xs: '4px',
    sm: '6px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px'
  },
  fontSizes: {
    none: '0px',
    xs: '8px',
    sm: '10px',
    base: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '30px',
    '3xl': '36px'
  },
  borderRadius: {
    none: '0px',
    xs: '2px',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px'
  }
}

export const cssVariablesGenerator = (theme: Tokens): cssVariablesTokens => {
  return {
    colors: {
      '--primary-color': theme.colors.primary,
      '--secondary-color': theme.colors.secondary,
      '--success-color': theme.colors.success,
      '--danger-color': theme.colors.danger,
      '--warning-color': theme.colors.warning,
      '--info-color': theme.colors.info
    },
    primary: {
      '--primary-color-100': theme.primary.light[100],
      '--primary-color-200': theme.primary.light[200],
      '--primary-color-300': theme.primary.light[300],
      '--primary-color-400': theme.primary.light[400],
      '--primary-color-500': theme.primary.light[500],
      '--primary-color-600': theme.primary.light[600],
      '--primary-color-700': theme.primary.light[700],
      '--primary-color-800': theme.primary.light[800],
      '--primary-color-900': theme.primary.light[900]
    },
    normal: {
      '--normal-color-100': theme.normal.light[100],
      '--normal-color-200': theme.normal.light[200],
      '--normal-color-300': theme.normal.light[300],
      '--normal-color-400': theme.normal.light[400],
      '--normal-color-500': theme.normal.light[500],
      '--normal-color-600': theme.normal.light[600],
      '--normal-color-700': theme.normal.light[700],
      '--normal-color-800': theme.normal.light[800],
      '--normal-color-900': theme.normal.light[900]
    },
    success: {
      '--success-color-100': theme.success.light[100],
      '--success-color-200': theme.success.light[200],
      '--success-color-300': theme.success.light[300],
      '--success-color-400': theme.success.light[400],
      '--success-color-500': theme.success.light[500],
      '--success-color-600': theme.success.light[600],
      '--success-color-700': theme.success.light[700],
      '--success-color-800': theme.success.light[800],
      '--success-color-900': theme.success.light[900]
    },
    danger: {
      '--danger-color-100': theme.danger.light[100],
      '--danger-color-200': theme.danger.light[200],
      '--danger-color-300': theme.danger.light[300],
      '--danger-color-400': theme.danger.light[400],
      '--danger-color-500': theme.danger.light[500],
      '--danger-color-600': theme.danger.light[600],
      '--danger-color-700': theme.danger.light[700],
      '--danger-color-800': theme.danger.light[800],
      '--danger-color-900': theme.danger.light[900]
    },
    warning: {
      '--warning-color-100': theme.warning.light[100],
      '--warning-color-200': theme.warning.light[200],
      '--warning-color-300': theme.warning.light[300],
      '--warning-color-400': theme.warning.light[400],
      '--warning-color-500': theme.warning.light[500],
      '--warning-color-600': theme.warning.light[600],
      '--warning-color-700': theme.warning.light[700],
      '--warning-color-800': theme.warning.light[800],
      '--warning-color-900': theme.warning.light[900]
    },
    background: {
      '--background-color-100': theme.background.light[100],
      '--background-color-200': theme.background.light[200],
      '--background-color-300': theme.background.light[300],
      '--background-color-400': theme.background.light[400],
      '--background-color-500': theme.background.light[500],
      '--background-color-600': theme.background.light[600],
      '--background-color-700': theme.background.light[700],
      '--background-color-800': theme.background.light[800],
      '--background-color-900': theme.background.light[900]
    },
    spaces: {
      '--space-none': theme.spaces.none,
      '--space-xs': theme.spaces.xs,
      '--space-sm': theme.spaces.sm,
      '--space-base': theme.spaces.base,
      '--space-md': theme.spaces.md,
      '--space-lg': theme.spaces.lg,
      '--space-xl': theme.spaces.xl,
      '--space-2xl': theme.spaces['2xl']
    },
    fontSizes: {
      '--font-size-none': theme.fontSizes.none,
      '--font-size-xs': theme.fontSizes.xs,
      '--font-size-sm': theme.fontSizes.sm,
      '--font-size-base': theme.fontSizes.base,
      '--font-size-md': theme.fontSizes.md,
      '--font-size-lg': theme.fontSizes.lg,
      '--font-size-xl': theme.fontSizes.xl,
      '--font-size-2xl': theme.fontSizes['2xl']
    },
    borderRadius: {
      '--border-radius-none': theme.borderRadius.none,
      '--border-radius-xs': theme.borderRadius.xs,
      '--border-radius-sm': theme.borderRadius.sm,
      '--border-radius-base': theme.borderRadius.base,
      '--border-radius-md': theme.borderRadius.md,
      '--border-radius-lg': theme.borderRadius.lg,
      '--border-radius-xl': theme.borderRadius.xl,
      '--border-radius-2xl': theme.borderRadius['2xl']
    }
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
