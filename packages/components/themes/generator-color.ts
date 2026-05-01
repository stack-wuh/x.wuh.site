import { generate, red, redDark, orange, orangeDark, green, greenDark } from '@ant-design/colors'
import { TBaseColorLevel } from './tokens'

// Site Theme: "文青纸张风"（象牙白纸 / 深棕墨迹 / 陶土赭色）
const PRIMARY_OCHRE = '#C89060'

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

// Primary：陶土赭色（暖赭），500 为主要色，600 为 hover/active
const primaryLight = toColorLevelsFromList(
  '#FBF4EE',
  '#F5E4D6',
  '#EBC9AE',
  '#DBA87E',
  '#C89060', // primary
  '#A87348', // hover/active
  '#8C5A35',
  '#6B4325',
  '#4A2C18',
)

// Dark 主色：提亮暖色，避免深色背景下发闷
const primaryDark = toColorLevelsFromList(
  '#2A1C12',
  '#3A2618',
  '#4D321F',
  '#6B452A',
  '#C89060',
  '#D4A478',
  '#E0BC98',
  '#ECD4B8',
  '#F5EBE0',
)

// Normal：用于正文/边框等中性色（900 为最强文本——深棕墨迹）
const normalLight = toColorLevelsFromList(
  '#FDFCFA',
  '#F5F1EA',
  '#E8E2D6',
  '#D4CBB8',
  '#B8AC98',
  '#9B8D78',
  '#6B5E4E',
  '#4A3F32',
  '#2A2218',
)

// Dark 文本色使用 generate 保证对比度
const darkTextColors = generate('#e8dcc8', { theme: 'dark' })
const normalDark = toColorLevelsFromGenerate(darkTextColors)

// Background：100 为卡片/容器象牙白，900 为页面暖纸底
const backgroundLight = toColorLevelsFromList(
  '#FFFDF9', // card/surface ivory white
  '#F8F3EC', // tag bg hint
  '#F0E8DC',
  '#E5D8C4',
  '#D4C4AC',
  '#BFA88C',
  '#A68B6C',
  '#8B7052',
  '#F2EDE4', // page deep bg warm paper
)

const darkBackgroundColors = generate('#1a1512', { theme: 'dark' })
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
