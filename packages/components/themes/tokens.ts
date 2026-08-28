export type ThemeFamily = 'wine' | 'plain'
export type ColorScheme = 'light' | 'dark'

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
  motion: {
    'ease-out-soft': string
    'ease-in-out-soft': string
    'dur-quick': string
    'dur-reveal': string
    'dur-write': string
  }
}

export type TColorTokens = keyof Tokens['colors']
export type TSpaceTokens = keyof Tokens['spaces']
export type TFontSizeTokens = keyof Tokens['fontSizes']
export type TBorderRadiusTokens = keyof Tokens['borderRadius']
export type TMotionTokens = keyof Tokens['motion']
export type TPrimaryColorLevelTokens = keyof Tokens['primary']
export type TDangerColorLevelTokens = keyof Tokens['danger']
export type TSuccessColorLevelTokens = keyof Tokens['success']
export type TWarningColorLevelTokens = keyof Tokens['warning']
export type TNormalColorLevelTokens = keyof Tokens['normal']
