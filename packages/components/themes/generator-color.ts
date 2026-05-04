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
  '#FFFDFB',
  '#F8F3EE',
  '#EBE2D8',
  '#D4C8B8',
  '#B9A998',
  '#A08878',
  '#8A6E5C',
  '#5A4438',
  '#2A1E16',
)

const darkTextColors = generate('#ffffff', { theme: 'dark' })
const normalDark = toColorLevelsFromGenerate(darkTextColors)

const backgroundLight = toColorLevelsFromList(
  '#FFFBF8',
  '#FDF3EC',
  '#FAE5D8',
  '#F5D0BC',
  '#EBB89E',
  '#DE9A7C',
  '#C88062',
  '#A86A50',
  '#F5F0EC',
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
