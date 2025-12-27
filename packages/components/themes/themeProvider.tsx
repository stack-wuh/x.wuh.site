import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { DefaultTheme } from './index'

interface IThemeProviderProps {
  children: React.ReactNode;
  theme?: Partial<typeof DefaultTheme>;
}

export const ThemeProviderComponent:React.FC<IThemeProviderProps> = (props) => {
  const mergedTheme = {
    ...DefaultTheme,
    ...props?.theme,
  }
  return <ThemeProvider theme={mergedTheme}>{props.children}</ThemeProvider>;
}

export default ThemeProviderComponent;