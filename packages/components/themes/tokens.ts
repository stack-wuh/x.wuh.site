export type TBaseColors = {
  primary: string;
  secondary: string;
  text: string;
  background: string;
}

export type TBaseSpace = {
  base: string;
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface IColors extends TBaseColors {
  success: string;
  danger: string;
  warning: string;
  info: string;
}

export interface Tokens {
  colors: IColors,
  spaces: TBaseSpace & {
    '2xl': string;
    '3xl': string;
  },
  fontSizes: TBaseSpace & {
    '2xl': string;
    '3xl': string;
  },
  borderRadius: TBaseSpace & {
    '2xl': string;
    '3xl': string;
  }
}

export type TColorTokens = keyof Tokens['colors'];
export type TSpaceTokens = keyof Tokens['spaces'];
export type TFontSizeTokens = keyof Tokens['fontSizes'];
export type TBorderRadiusTokens = keyof Tokens['borderRadius'];

export interface cssVariablesTokens {
  colors: {
    '--primary-color': string;
    '--secondary-color': string;
    '--success-color': string;
    '--danger-color': string;
    '--warning-color': string;
    '--info-color': string;
  },
  spaces: {
    '--space-none': string;
    '--space-xs': string;
    '--space-sm': string;
    '--space-base': string;
    '--space-md': string;
    '--space-lg': string;
    '--space-xl': string;
    '--space-2xl': string;
  },
  fontSizes: {
    '--font-size-none': string;
    '--font-size-xs': string;
    '--font-size-sm': string;
    '--font-size-base': string;
    '--font-size-md': string;
    '--font-size-lg': string;
    '--font-size-xl': string;
    '--font-size-2xl': string;
  },
  borderRadius: {
    '--border-radius-none': string;
    '--border-radius-xs': string;
    '--border-radius-sm': string;
    '--border-radius-base': string;
    '--border-radius-md': string;
    '--border-radius-lg': string;
    '--border-radius-xl': string;
    '--border-radius-2xl': string;
  }
}

export type CSSVariableKey = keyof {
  [K in keyof cssVariablesTokens as keyof cssVariablesTokens[K]]: string;
};