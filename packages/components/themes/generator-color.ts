import { generate, red, redDark, orange, orangeDark, green, greenDark } from '@ant-design/colors'
import { TBaseColorLevel } from './tokens'

// 中国红主色（RGB 230,0,0 / PANTONE 186 C）
const CHINA_RED = '#E60000'

// Light 模式：浅色背景上的中国红衍生色阶
const defaultThemeColors = generate(CHINA_RED, { theme: 'default', backgroundColor: '#fef6f6' })
const darkThemeColors = generate(CHINA_RED, { theme: 'dark', backgroundColor: '#1a0808' })

// 中性/正文色：Light 深灰，Dark 浅灰
const defaultTextColors = generate('#434343', { theme: 'default' })
const darkTextColors = generate('#e8e8e8', { theme: 'dark' })

// 背景色阶：与主色协调 — Light 极浅红/暖白，Dark 深红黑（随系统 prefers-color-scheme 切换）
const defaultBackgroundColors = generate('#fef6f6', { theme: 'default' })
const darkBackgroundColors = generate('#1a0808', { theme: 'dark' })

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
