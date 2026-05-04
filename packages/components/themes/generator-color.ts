import { generate, red, redDark, orange, orangeDark, green, greenDark } from '@ant-design/colors'
import { TBaseColorLevel } from './tokens'

// "酒红"：暖红/金/棕灰
const PRIMARY_RED = '#C94A44'

const toColorLevelsFromList = (...colors: [string, string, string, string, string, string, string, string, string]): TBaseColorLevel => {
  const keys: (keyof TBaseColorLevel)[] = [100, 200, 300, 400, 500, 600, 700, 800, 900]
  return keys.reduce((acc, key, index) => {
    acc[key] = colors[index]
    return acc
  }, {} as TBaseColorLevel)
}

const toColorLevelsFromGenerate = (colors: string[]): TBaseColorLevel => {
  return colors.slice(0, 9).reduce((acc, curr, index) => {
    const key = (index + 1) * 100 as keyof TBaseColorLevel
    acc[key] = curr
    return acc
  }, {} as TBaseColorLevel)
}

const primaryLight = toColorLevelsFromList(
  '#FCEDEC',
  '#F8D8D6',
  '#F2BEBB',
  '#E2928D',
  '#C94A44', // primary
  '#A13531', // hover/active
  '#8A2A26',
  '#6B1F1E',
  '#4D1515',
)

const primaryDark = toColorLevelsFromList(
  '#3A1516',
  '#4A1B1C',
  '#5B2223',
  '#7A2F2F',
  '#E36A64',
  '#F07A73',
  '#F6A09B',
  '#F9C5C1',
  '#FCE6E4',
)

const normalLight = toColorLevelsFromList(
  '#FFFDFD',
  '#F6EFEF',
  '#E8DEDE',
  '#D2C3C3',
  '#B9A7A7',
  '#A19090',
  '#8A7A7A',
  '#5A4A4A',
  '#1F1F1F',
)

const darkTextColors = generate('#ffffff', { theme: 'dark' })
const normalDark = toColorLevelsFromGenerate(darkTextColors)

const backgroundLight = toColorLevelsFromList(
  '#FFF3F0',
  '#FDE4E4',
  '#F9D1D0',
  '#F2B9B6',
  '#E7A09B',
  '#D4847E',
  '#B86E68',
  '#9A5F5C',
  '#7B5A5A',
)

const darkBackgroundColors = generate('#0a0404', { theme: 'dark' })
const backgroundDark = toColorLevelsFromGenerate(darkBackgroundColors)

const theme = {
  primary: {
    light: primaryLight,
    dark: primaryDark,
  },
  normal: {
    light: normalLight,
    dark: normalDark,
  },
  success: {
    light: toColorLevelsFromGenerate(green),
    dark: toColorLevelsFromGenerate(greenDark),
  },
  danger: {
    light: toColorLevelsFromGenerate(red),
    dark: toColorLevelsFromGenerate(redDark),
  },
  warning: {
    light: toColorLevelsFromGenerate(orange),
    dark: toColorLevelsFromGenerate(orangeDark),
  },
  background: {
    light: backgroundLight,
    dark: backgroundDark,
  }
}

export default theme
