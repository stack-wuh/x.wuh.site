import { useTheme as useStyledTheme } from 'styled-components'
import { Tokens } from '@/packages/components/themes/tokens'

export const useTheme = (): Tokens => {
  const theme = useStyledTheme()

  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return theme
}

export const useTokens = <T extends keyof Tokens>(tokenType: T, token: keyof Tokens[T]): Tokens[T][keyof Tokens[T]] => {
  const tokens = useTheme()

  return tokens[tokenType][token]
}

export default useTokens
