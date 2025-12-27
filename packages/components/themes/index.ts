import {  Tokens, cssVariablesTokens } from './tokens';
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
  spaces: {
    none: '0px',
    xs: '4px',
    sm: '6px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
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
    '3xl': '36px',
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
    '3xl': '24px',
  }
}

export const cssVariablesGenerator = (theme: Tokens): cssVariablesTokens => {
  return {
    colors: {
      '--primary-color':  theme.colors.primary,
      '--secondary-color': theme.colors.secondary,
      '--success-color': theme.colors.success,
      '--danger-color': theme.colors.danger,
      '--warning-color': theme.colors.warning,
      '--info-color': theme.colors.info,
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
    },
  }
}