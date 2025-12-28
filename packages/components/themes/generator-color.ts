import { generate, red, redDark, orange, orangeDark, green, greenDark } from '@ant-design/colors'
import { TBaseColorLevel } from './tokens'

const defaultThemeColors = generate('#8d21ec', { theme: 'default', backgroundColor: '#eee' })
const darkThemeColors = generate('#8d21ec', { theme: 'dark', backgroundColor: '#212529'})

const defaultTextColors = generate('#746a6a', { theme: 'default' })
const darkTextColors = generate('#e7b6b7', { theme: 'dark' })

const defaultBackgroundColors = generate('#f5f5f5', { theme: 'default' })
const darkBackgroundColors = generate('#212529', { theme: 'dark' })

const toColorLevels = (colors: string[]): TBaseColorLevel => {
  return colors.slice(0, 9).reduce((acc, curr, index) => {
    const key = (index + 1) * 100 as keyof TBaseColorLevel
    acc[key] = curr

    return acc
  }, {} as TBaseColorLevel)
}

const theme = {
  primary: {
    light: toColorLevels(defaultThemeColors),
    dark: toColorLevels(darkThemeColors)
  },
  normal: {
    light: toColorLevels(defaultTextColors),
    dark: toColorLevels(darkTextColors)
  },
  success: {
    light: toColorLevels(green),
    dark: toColorLevels(greenDark)
  },
  danger: {
    light: toColorLevels(red),
    dark: toColorLevels(redDark)
  },
  warning: {
    light: toColorLevels(orange),
    dark: toColorLevels(orangeDark)
  },
  background: {
    light: toColorLevels(defaultBackgroundColors),
    dark: toColorLevels(darkBackgroundColors)
  }
}

export default theme