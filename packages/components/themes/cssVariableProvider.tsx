import { createGlobalStyle } from 'styled-components'
import type { TBaseColorLevel, Tokens } from './tokens'
import { palettes } from './generator-color'

/** Layer 1: emit all raw palette CSS variables into a single selector */
function emitLayer1(): string {
  const lines: string[] = []

  for (const [prefix, palette] of Object.entries(palettes)) {
    for (const [colorName, levels] of Object.entries(palette)) {
      if (colorName === 'light' || colorName === 'dark') {
        for (const [level, value] of Object.entries(levels as Record<string, string>)) {
          lines.push(`--_${prefix}-${colorName}-${level}: ${value};`)
        }
      } else {
        for (const [level, value] of Object.entries(levels as TBaseColorLevel)) {
          lines.push(`--_${prefix}-${colorName}-${level}: ${value};`)
        }
      }
    }
  }

  return lines.join('\n')
}

/** Layer 2: routing selectors */
function buildLayer2Blocks(): string {
  const FAMILY_NAMES = ['primary', 'normal', 'background'] as const
  const SHARED_NAMES = ['success', 'danger', 'warning'] as const
  const LEVELS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const

  const emitFamilyVars = (prefix: string, names: readonly string[]): string => {
    const lines: string[] = []
    for (const name of names) {
      for (const level of LEVELS) {
        lines.push(`--${name}-${level}: var(--_${prefix}-${name}-${level});`)
      }
    }
    return lines.join('\n')
  }

  const emitSharedVars = (scheme: 'light' | 'dark', names: readonly string[]): string => {
    const lines: string[] = []
    for (const name of names) {
      for (const level of LEVELS) {
        lines.push(`--${name}-${level}: var(--_${name}-${scheme}-${level});`)
      }
    }
    return lines.join('\n')
  }

  return [
    `:root {\n${emitFamilyVars('wl', FAMILY_NAMES)}\n${emitSharedVars('light', SHARED_NAMES)}\n}`,
    `[data-theme-family="plain"] {\n${emitFamilyVars('pl', FAMILY_NAMES)}\n}`,
    `[data-color-scheme="dark"] {\n${emitFamilyVars('wd', FAMILY_NAMES)}\n${emitSharedVars('dark', SHARED_NAMES)}\n}`,
    `[data-theme-family="plain"][data-color-scheme="dark"] {\n${emitFamilyVars('pd', FAMILY_NAMES)}\n}`,
  ].join('\n\n')
}

const LAYER1_CSS = emitLayer1()
const LAYER2_CSS = buildLayer2Blocks()

export const CssVariableStyles = createGlobalStyle`
  /* ===== Layer 1: raw palette values ===== */
  :root {
    ${LAYER1_CSS}
  }

  /* ===== Layer 2: routing ===== */
  ${LAYER2_CSS}

  /* ===== Layer 3: non-color tokens ===== */
  :root {
    ${(props) => {
      const theme = props.theme as Tokens
      return Object.keys(theme.spaces)
        .map((key) => `--space-${key}: ${theme.spaces[key as keyof typeof theme.spaces]};`)
        .join(';')
    }}

    ${(props) => {
      const theme = props.theme as Tokens
      return Object.keys(theme.fontSizes)
        .map((key) => `--font-size-${key}: ${theme.fontSizes[key as keyof typeof theme.fontSizes]};`)
        .join(';')
    }}

    ${(props) => {
      const theme = props.theme as Tokens
      return Object.keys(theme.borderRadius)
        .map((key) => `--border-radius-${key}: ${theme.borderRadius[key as keyof typeof theme.borderRadius]};`)
        .join(';')
    }}

    --line-height-body: 1.8;
    --line-height-heading: 1.35;
  }

  /* ===== Semantic & UI tokens ===== */
  :root {
    --primary-color: var(--primary-500);
    --secondary-color: var(--normal-500);
    --success-color: var(--success-500);
    --danger-color: var(--danger-500);
    --warning-color: var(--warning-500);
    --text-color: var(--normal-900);
    --text-primary: var(--normal-900);
    --text-secondary: var(--normal-700);
    --text-muted: var(--normal-700);
    --background-color: var(--background-900);
    --transition-fast: 180ms;
    --elevation-soft: 0 4px 14px rgba(0,0,0,.06);
    --elevation-card: 0 20px 40px rgba(0,0,0,0.08);
    --elevation-card-hover: 0 30px 50px rgba(0,0,0,0.12);
    --radius-card: var(--border-radius-2xl);
    --accent-color: #E3B567;
    --page-bg:
      linear-gradient(180deg,
        var(--background-color) 0%,
        color-mix(in oklab, var(--background-color) 95%, var(--primary-color) 5%) 100%);
  }

  /* ===== Dark semantic overrides ===== */
  [data-color-scheme="dark"] {
    --text-color: var(--normal-500);
    --text-primary: var(--normal-500);
    --text-secondary: var(--normal-600);
    --text-muted: var(--normal-700);
    --elevation-soft: 0 4px 14px rgba(0,0,0,.25);
    --elevation-card: 0 18px 36px rgba(0,0,0,0.45);
    --elevation-card-hover: 0 26px 46px rgba(0,0,0,0.6);
    --accent-color: #E3B567;
    --page-bg:
      radial-gradient(circle at 18% 0%, color-mix(in oklab, var(--primary-color) 18%, transparent), transparent 55%),
      radial-gradient(circle at 88% 18%, color-mix(in oklab, var(--accent-color) 18%, transparent), transparent 52%),
      linear-gradient(180deg,
        color-mix(in oklab, var(--background-color) 92%, var(--primary-color) 8%),
        var(--background-color));
  }

  /* ===== Plain light semantic overrides ===== */
  [data-theme-family="plain"] {
    --primary-color: var(--primary-600);
    --secondary-color: var(--normal-600);
    --text-primary: var(--normal-900);
    --text-secondary: var(--normal-700);
    --text-muted: var(--normal-600);
    --text-color: var(--normal-900);
    --accent-color: #C89060;
    --elevation-soft: 0 2px 8px rgba(0,0,0,.04);
    --elevation-card: 0 4px 16px rgba(0,0,0,.06);
    --elevation-card-hover: 0 8px 24px rgba(0,0,0,.09);
    --page-bg: linear-gradient(180deg, var(--background-900) 0%, color-mix(in oklab, var(--background-900) 96%, var(--primary-600) 4%) 100%);
    --font-size-sm: 15px;
    --font-size-md: 17px;
    --font-size-lg: 19px;
    --font-size-xl: 22px;
    --font-size-2xl: 27px;
    --line-height-body: 2.0;
    --line-height-heading: 1.4;
  }

  /* ===== Plain dark semantic overrides ===== */
  [data-theme-family="plain"][data-color-scheme="dark"] {
    --text-primary: var(--normal-900);
    --text-secondary: rgba(245, 241, 234, 0.82);
    --text-muted: rgba(245, 241, 234, 0.68);
    --text-color: var(--normal-900);
    --elevation-soft: 0 2px 8px rgba(0,0,0,.22);
    --elevation-card: 0 4px 16px rgba(0,0,0,.36);
    --elevation-card-hover: 0 8px 24px rgba(0,0,0,.5);
    --page-bg: linear-gradient(180deg, var(--background-900), color-mix(in oklab, var(--background-900) 98%, var(--primary-color) 2%));
  }

  /* ===== Base element styles ===== */
  html, body {
    max-width: 100vw;
    overflow-x: hidden;
  }

  body {
    color: var(--text-color);
    background: var(--page-bg, var(--background-color));
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px; font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }

  :root {
    --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    --font-serif: Georgia, 'Songti SC', 'STSong', serif;
  }

  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
  }
`
