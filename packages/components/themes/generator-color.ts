import { generate, red, redDark, orange, orangeDark, green, greenDark } from '@ant-design/colors'
import type { TBaseColorLevel } from './tokens'

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

// ======== Wine / 酒红 ========

const wineLightPrimary = toColorLevelsFromList(
  '#FCEDEC', '#F8D8D6', '#F2BEBB', '#E2928D',
  '#C94A44', '#A13531', '#8A2A26', '#6B1F1E', '#4D1515',
)

const wineDarkPrimary = toColorLevelsFromList(
  '#3A1516', '#4A1B1C', '#5B2223', '#7A2F2F',
  '#E36A64', '#F07A73', '#F6A09B', '#F9C5C1', '#FCE6E4',
)

const wineLightNormal = toColorLevelsFromList(
  '#FFFDFB', '#F8F3EE', '#EBE2D8', '#D4C8B8',
  '#B9A998', '#A08878', '#8A6E5C', '#5A4438', '#2A1E16',
)

const wineDarkNormalColors = generate('#ffffff', { theme: 'dark' })
const wineDarkNormal = toColorLevelsFromGenerate(wineDarkNormalColors)

const wineLightBackground = toColorLevelsFromList(
  '#FFFBF8', '#FDF3EC', '#FAE5D8', '#F5D0BC',
  '#EBB89E', '#DE9A7C', '#C88062', '#A86A50', '#F5F0EC',
)

const wineDarkBgColors = generate('#0a0404', { theme: 'dark' })
const wineDarkBackground = toColorLevelsFromGenerate(wineDarkBgColors)

// ======== Plain / 素雅 ========

const plainLightPrimary = toColorLevelsFromList(
  '#FBF4EE', '#F5E4D6', '#EBC9AE', '#DBA87E',
  '#C89060', '#A87348', '#8C5A35', '#6B4325', '#4A2C18',
)

const plainDarkPrimary = toColorLevelsFromList(
  '#2a1a0c', '#3a2412', '#4e2e18', '#6a3e20',
  '#D4A478', '#deb896', '#e8ccb4', '#f2e0d2', '#faf0ea',
)

const plainLightNormal = toColorLevelsFromList(
  '#FDFCFA', '#F5F1EA', '#E8E2D6', '#D4CBB8',
  '#B8AC98', '#9B8D78', '#6B5E4E', '#4A3F32', '#2A2218',
)

const plainDarkNormal = toColorLevelsFromList(
  '#201a14', '#28221a',
  'rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.14)',
  'rgba(255, 255, 255, 0.20)', 'rgba(255, 255, 255, 0.30)',
  'rgba(255, 255, 255, 0.42)', 'rgba(255, 255, 255, 0.58)',
  'rgba(255, 255, 255, 0.72)',
)

const plainLightBackground = toColorLevelsFromList(
  '#FFFDF9', '#F8F3EC', '#F0E8DC', '#E5D8C4',
  '#D4C4AC', '#BFA88C', '#A68B6C', '#8B7052', '#F2EDE4',
)

const plainDarkBackground = toColorLevelsFromList(
  '#1c1814', '#221c18', '#2a221c', '#322820',
  '#3a2e24', '#44362a', '#504032', '#5c4a3a', '#0b0908',
)

// ======== Shared semantic colors ========

const successLight = toColorLevelsFromGenerate(green)
const successDark = toColorLevelsFromGenerate(greenDark)
const dangerLight = toColorLevelsFromGenerate(red)
const dangerDark = toColorLevelsFromGenerate(redDark)
const warningLight = toColorLevelsFromGenerate(orange)
const warningDark = toColorLevelsFromGenerate(orangeDark)

// ======== Unified palette export (new API) ========

export const palettes = {
  wl: { primary: wineLightPrimary, normal: wineLightNormal, background: wineLightBackground },
  wd: { primary: wineDarkPrimary, normal: wineDarkNormal, background: wineDarkBackground },
  pl: { primary: plainLightPrimary, normal: plainLightNormal, background: plainLightBackground },
  pd: { primary: plainDarkPrimary, normal: plainDarkNormal, background: plainDarkBackground },
  success: { light: successLight, dark: successDark },
  danger: { light: dangerLight, dark: dangerDark },
  warning: { light: warningLight, dark: warningDark },
} as const

// ======== Backward-compatible exports ========

export const primary = { light: palettes.wl.primary, dark: palettes.wd.primary }
export const danger = { light: palettes.danger.light, dark: palettes.danger.dark }
export const success = { light: palettes.success.light, dark: palettes.success.dark }
export const warning = { light: palettes.warning.light, dark: palettes.warning.dark }
export const normal = { light: palettes.wl.normal, dark: palettes.wd.normal }
export const background = { light: palettes.wl.background, dark: palettes.wd.background }

const themeForBackCompat = { primary, normal, success, danger, warning, background }
export default themeForBackCompat
