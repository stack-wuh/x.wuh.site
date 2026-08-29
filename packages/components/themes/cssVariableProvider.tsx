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

    ${(props) => {
      const theme = props.theme as Tokens
      return Object.keys(theme.motion)
        .map((key) => `--motion-${key}: ${theme.motion[key as keyof typeof theme.motion]};`)
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
  /* overflow-x 必须用 clip 而非 hidden：hidden 会让 body 成为滚动容器，
     导致 scroll-driven 动画（view() 时间线）永远判定元素已进入视口 */
  html, body {
    max-width: 100vw;
    overflow-x: clip;
  }

  /* 移动端行高收紧：小屏短行宽下大行高显松，桌面保持原值 */
  @media (max-width: 640px) {
    :root {
      --line-height-body: 1.7;
      --line-height-heading: 1.3;
    }

    [data-theme-family="plain"] {
      --line-height-body: 1.8;
      --line-height-heading: 1.35;
    }
  }

  body {
    color: var(--text-color);
    background: var(--page-bg, var(--background-color));
    font-synthesis: none;
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

  /* ===== 全局滚动条：主题色细条 ===== */
  /* 颜色走 CSS 变量，4 主题自动适配；触控设备恢复系统覆盖式滚动条 */
  @media (pointer: fine) {
    /* Firefox（形状不可控，颜色统一） */
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--primary-color) transparent;
    }

    /* WebKit（Chrome/Edge/Safari）+ 标准 ::scrollbar 语法（Chrome 121+） */
    *::-webkit-scrollbar,
    *::scrollbar {
      width: 8px;
      height: 8px;
    }

    *::-webkit-scrollbar-track,
    *::scrollbar-track {
      background: transparent;
    }

    *::-webkit-scrollbar-thumb,
    *::scrollbar-thumb {
      background: linear-gradient(
        180deg,
        var(--primary-color),
        color-mix(in oklab, var(--primary-color) 70%, black)
      );
      border-radius: 99px;
    }

    *::-webkit-scrollbar-thumb:hover,
    *::scrollbar-thumb:hover {
      background: linear-gradient(
        180deg,
        color-mix(in oklab, var(--primary-color) 85%, white),
        var(--primary-color)
      );
    }

    *::-webkit-scrollbar-corner,
    *::scrollbar-corner {
      background: transparent;
    }
  }

  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px; font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }

  :root {
    --font-sans: 'Noto Sans SC', ui-sans-serif, system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, 'Courier New', monospace;
    --font-serif: Georgia, serif;
  }

  html[data-no-transition] *,
  html[data-no-transition] *::before,
  html[data-no-transition] *::after {
    transition: none !important;
  }

  *, *::before, *::after {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
`
