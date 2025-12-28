export type TBaseColors = {
  primary: string
  secondary: string
  success: string
  danger: string
  warning: string
  info: string
  text: string
  background: string
}

export type TBaseColorLevel = {
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export type TBaseColorSchema = {
  light: TBaseColorLevel
  dark: TBaseColorLevel
}

export type TBaseSpace = {
  base: string
  none: string
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

export interface IColors extends TBaseColors {
  success: string
  danger: string
  warning: string
  info: string
}

export interface Tokens {
  colors: IColors,
  background: TBaseColorSchema,
  primary: TBaseColorSchema,
  danger: TBaseColorSchema,
  success: TBaseColorSchema,
  warning: TBaseColorSchema,
  normal: TBaseColorSchema,
  spaces: TBaseSpace & {
    '2xl': string
    '3xl': string
  }
  fontSizes: TBaseSpace & {
    '2xl': string
    '3xl': string
  }
  borderRadius: TBaseSpace & {
    '2xl': string
    '3xl': string
  }
}

export type TColorTokens = keyof Tokens['colors']
export type TSpaceTokens = keyof Tokens['spaces']
export type TFontSizeTokens = keyof Tokens['fontSizes']
export type TBorderRadiusTokens = keyof Tokens['borderRadius']
export type TPrimaryColorLevelTokens = keyof Tokens['primary']
export type TDangerColorLevelTokens = keyof Tokens['danger']
export type TSuccessColorLevelTokens = keyof Tokens['success']
export type TWarningColorLevelTokens = keyof Tokens['warning']
export type TNormalColorLevelTokens = keyof Tokens['normal']

export interface cssVariablesTokens {
  colors: {
    '--primary-color': string
    '--secondary-color': string
    '--success-color': string
    '--danger-color': string
    '--warning-color': string
    '--info-color': string
  }
  primary: {
    '--primary-color-100': string
    '--primary-color-200': string
    '--primary-color-300': string
    '--primary-color-400': string
    '--primary-color-500': string
    '--primary-color-600': string
    '--primary-color-700': string
    '--primary-color-800': string
    '--primary-color-900': string
  }
  normal: {
    '--normal-color-100': string
    '--normal-color-200': string
    '--normal-color-300': string
    '--normal-color-400': string
    '--normal-color-500': string
    '--normal-color-600': string
    '--normal-color-700': string
    '--normal-color-800': string
    '--normal-color-900': string
  }
  success: {
    '--success-color-100': string
    '--success-color-200': string
    '--success-color-300': string
    '--success-color-400': string
    '--success-color-500': string
    '--success-color-600': string
    '--success-color-700': string
    '--success-color-800': string
    '--success-color-900': string
  }
  danger: {
    '--danger-color-100': string
    '--danger-color-200': string
    '--danger-color-300': string
    '--danger-color-400': string
    '--danger-color-500': string
    '--danger-color-600': string
    '--danger-color-700': string
    '--danger-color-800': string
    '--danger-color-900': string
  }
  warning: {
    '--warning-color-100': string
    '--warning-color-200': string
    '--warning-color-300': string
    '--warning-color-400': string
    '--warning-color-500': string
    '--warning-color-600': string
    '--warning-color-700': string
    '--warning-color-800': string
    '--warning-color-900': string
  }
  background: {
    '--background-color-100': string
    '--background-color-200': string
    '--background-color-300': string
    '--background-color-400': string
    '--background-color-500': string
    '--background-color-600': string
    '--background-color-700': string
    '--background-color-800': string
    '--background-color-900': string
  }
  spaces: {
    '--space-none': string
    '--space-xs': string
    '--space-sm': string
    '--space-base': string
    '--space-md': string
    '--space-lg': string
    '--space-xl': string
    '--space-2xl': string
  }
  fontSizes: {
    '--font-size-none': string
    '--font-size-xs': string
    '--font-size-sm': string
    '--font-size-base': string
    '--font-size-md': string
    '--font-size-lg': string
    '--font-size-xl': string
    '--font-size-2xl': string
  }
  borderRadius: {
    '--border-radius-none': string
    '--border-radius-xs': string
    '--border-radius-sm': string
    '--border-radius-base': string
    '--border-radius-md': string
    '--border-radius-lg': string
    '--border-radius-xl': string
    '--border-radius-2xl': string
  }
}

export type CSSVariableKey = keyof {
  [K in keyof cssVariablesTokens as keyof cssVariablesTokens[K]]: string
}
