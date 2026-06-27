# 主题系统系统性重构 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将主题系统从硬编码 4 套 CSS 变量分支，重构为两个正交维度（ThemeFamily × ColorScheme）的组合覆盖架构。

**Architecture:** Layer 1 私有调色板（raw 值定义一次）→ Layer 2 路由选择器（4 个 CSS selector 做映射）→ Layer 3 非颜色 tokens。HTML 双属性 `data-theme-family` + `data-color-scheme` 替换单一 `data-theme`。

**Tech Stack:** TypeScript 5, styled-components 6, Next.js 15 App Router, React 19

**依赖顺序:** tokens.ts → generator-color.ts → index.ts → cssVariableProvider.tsx → ThemeModeProvider.tsx → SiteHeader/index.tsx → system-color/page.tsx → spec.md

---

### Task 1: 重写 tokens.ts — 新增类型 + 删除死代码

**Files:**
- Modify: `packages/components/themes/tokens.ts`

**Changes:**
- 新增 `ThemeFamily`、`ColorScheme` 类型
- 删除 `cssVariablesTokens` 类型（完全未使用）
- 保留其余所有类型不变

- [ ] **Step 1: Modify tokens.ts**

保持 `TBaseColors`, `TBaseColorLevel`, `TBaseColorSchema`, `TBaseSpace`, `IColors`, `Tokens` 及其它类型别名不变。

在文件顶部（TBaseColors 之前）新增：

```ts
export type ThemeFamily = 'wine' | 'plain'
export type ColorScheme = 'light' | 'dark'
```

在文件末尾，**删除** `cssVariablesTokens` interface（第 78-183 行）和 `CSSVariableKey` 类型（第 185-188 行）。

- [ ] **Step 2: Verify**

```bash
cd packages/components && pnpm exec tsc --noEmit
```

预期：无类型错误（此时 index.ts 引用了删除的 cssVariablesGenerator 但 tokens.ts 本身编译通过）。

---

### Task 2: 重写 generator-color.ts — 4 套 raw 调色板 + 向后兼容导出

**Files:**
- Modify: `packages/components/themes/generator-color.ts`

**Changes:**
- 提取 cssVariableProvider.tsx 中 hardcoded 的 plain light/dark 色值移入生成器
- 导出 `palettes` 对象（4 套 × 3 色系 + 共享语义色）
- 保留向后兼容的 `export default` 和命名导出

- [ ] **Step 1: Replace generator-color.ts**

```ts
import { generate, red, redDark, orange, orangeDark, green, greenDark } from '@ant-design/colors'
import type { TBaseColorLevel, ThemeFamily, ColorScheme } from './tokens'

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

// ======== Shared semantic colors (only differ by light/dark) ========

const successLight = toColorLevelsFromGenerate(green)
const successDark = toColorLevelsFromGenerate(greenDark)
const dangerLight = toColorLevelsFromGenerate(red)
const dangerDark = toColorLevelsFromGenerate(redDark)
const warningLight = toColorLevelsFromGenerate(orange)
const warningDark = toColorLevelsFromGenerate(orangeDark)

// ======== Unified palette export (new API) ========

export const palettes = {
  _wl: { primary: wineLightPrimary, normal: wineLightNormal, background: wineLightBackground },
  _wd: { primary: wineDarkPrimary, normal: wineDarkNormal, background: wineDarkBackground },
  _pl: { primary: plainLightPrimary, normal: plainLightNormal, background: plainLightBackground },
  _pd: { primary: plainDarkPrimary, normal: plainDarkNormal, background: plainDarkBackground },
  success: { light: successLight, dark: successDark },
  danger: { light: dangerLight, dark: dangerDark },
  warning: { light: warningLight, dark: warningLight },
} as const

// ======== Backward-compatible exports for index.ts ========

export const primary = { light: palettes._wl.primary, dark: palettes._wd.primary }
export const danger = { light: palettes.danger.light, dark: palettes.danger.dark }
export const success = { light: palettes.success.light, dark: palettes.success.dark }
export const warning = { light: palettes.warning.light, dark: palettes.warning.dark }
export const normal = { light: palettes._wl.normal, dark: palettes._wd.normal }
export const background = { light: palettes._wl.background, dark: palettes._wd.background }

const themeForBackCompat = { primary, normal, success, danger, warning, background }
export default themeForBackCompat
```

- [ ] **Step 2: Type check**

```bash
cd packages/components && pnpm exec tsc --noEmit
```

预期：通过（向后兼容的导出结构未变）。

---

### Task 3: 清理 index.ts — 删除 cssVariablesGenerator 死代码

**Files:**
- Modify: `packages/components/themes/index.ts`

**Changes:**
- 删除 `cssVariablesGenerator` 函数和 `cssVariablesTokens` 的 import
- `DefaultTheme` 结构不变（继续通过 generator-color.ts 的向后兼容导出工作）

- [ ] **Step 1: Remove dead code**

删除整个 `cssVariablesGenerator` 函数（第 55-162 行，即从 `export const cssVariablesGenerator` 到 `}` 闭包结束）。

同时删除文件顶部对 `cssVariablesTokens` 的 import 引用：

```ts
// 第 1 行，修改前:
import { Tokens, cssVariablesTokens } from './tokens'
// 修改后:
import { Tokens } from './tokens'
```

- [ ] **Step 2: Type check**

```bash
cd packages/components && pnpm exec tsc --noEmit
```

预期：通过。

---

### Task 4: 重写 cssVariableProvider.tsx — Layer 1 + Layer 2 + Layer 3

**Files:**
- Modify: `packages/components/themes/cssVariableProvider.tsx`

**Changes:**
- Layer 1: 静态注入 4 套 raw 调色板 CSS 变量（`--_wl-primary-500` 等）
- Layer 2: 4 个 selector 路由到公共 CSS 变量（`--primary-500` 等）
- Layer 3: 非颜色 tokens（spaces, fontSizes, borderRadius）通过 theme props 注入
- 语义变量：`--text-primary`、`--page-bg`、`--elevation-*` 等保持但适配新架构
- 删除 `@media (prefers-color-scheme: dark)` 块

- [ ] **Step 1: Replace cssVariableProvider.tsx**

```tsx
import { createGlobalStyle } from 'styled-components'
import type { TBaseColorLevel, Tokens, ThemeFamily, ColorScheme } from './tokens'
import { palettes } from './generator-color'

/** Layer 1: emit all raw palette CSS variables into a single selector */
function emitLayer1(): string {
  const lines: string[] = []

  for (const [prefix, palette] of Object.entries(palettes)) {
    for (const [colorName, levels] of Object.entries(palette)) {
      if (colorName === 'light' || colorName === 'dark') {
        // Shared semantic colors: palettes.success.light / palettes.success.dark
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

  // Family colors: reference _wl / _wd / _pl / _pd prefix
  const emitFamilyVars = (prefix: string, names: readonly string[]): string => {
    const lines: string[] = []
    for (const name of names) {
      for (const level of LEVELS) {
        lines.push(`--${name}-${level}: var(--_${prefix}-${name}-${level});`)
      }
    }
    return lines.join('\n')
  }

  // Shared colors: reference _<name>-light-<level> or _<name>-dark-<level>
  const emitSharedVars = (scheme: 'light' | 'dark', names: readonly string[]): string => {
    const lines: string[] = []
    for (const name of names) {
      for (const level of LEVELS) {
        lines.push(`--${name}-${level}: var(--_${name}-${scheme}-${level});`)
      }
    }
    return lines.join('\n')
  }

  // Default: wine light (family: _wl, shared: light)
  const defaultBlock = `:root {\n${emitFamilyVars('wl', FAMILY_NAMES)}\n${emitSharedVars('light', SHARED_NAMES)}\n}`

  // Plain light (family: _pl, shared unchanged → light)
  const plainLightBlock = `[data-theme-family="plain"] {\n${emitFamilyVars('pl', FAMILY_NAMES)}\n}`

  // Wine dark (family: _wd, shared: dark)
  const wineDarkBlock = `[data-color-scheme="dark"] {\n${emitFamilyVars('wd', FAMILY_NAMES)}\n${emitSharedVars('dark', SHARED_NAMES)}\n}`

  // Plain dark (family: _pd, shared already dark from parent)
  const plainDarkBlock = `[data-theme-family="plain"][data-color-scheme="dark"] {\n${emitFamilyVars('pd', FAMILY_NAMES)}\n}`

  return [defaultBlock, plainLightBlock, wineDarkBlock, plainDarkBlock].join('\n\n')
}

// Pre-compute at module load time
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

  /* ===== Typography themes ===== */
  [data-theme-family="plain"] {
    --font-size-sm: 15px;
    --font-size-md: 17px;
    --font-size-lg: 19px;
    --font-size-xl: 22px;
    --font-size-2xl: 27px;
    --line-height-body: 2.0;
    --line-height-heading: 1.4;
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
```

> **⚠️ 重要**: 以上代码为架构骨架。Layer 2 中 shared colors (success/danger/warning) 的 light→dark 切换需要独立处理 — 它们在 `data-color-scheme="dark"` 时切换到 dark 变体。实际实现时需要验证 emitLayer1 对 shared 色的前缀命名（`success-light-500` vs `_success-500`）与 Layer 2 路由一致。

- [ ] **Step 2: Type check**

```bash
cd packages/wuh.site.next && pnpm exec tsc --noEmit
```

预期：通过。

---

### Task 5: 重写 ThemeModeProvider.tsx — 4 态循环 + 双 HTML 属性

**Files:**
- Modify: `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx`

**Changes:**
- 类型从 `'money' | 'plain'` 改为 `Theme` = `'wine-light' | 'wine-dark' | 'plain-light' | 'plain-dark'`
- 设置 `document.documentElement.dataset.themeFamily` + `.colorScheme`
- localStorage key 从 `wuh.site.themeMode` → `wuh.site.theme`
- 提供 `toggle()` 做 4 态循环

- [ ] **Step 1: Replace ThemeModeProvider.tsx**

```tsx
'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ThemeFamily, ColorScheme } from '@wuh.site/components/themes/tokens'

export type Theme = `${ThemeFamily}-${ColorScheme}`

type ThemeContextValue = {
  theme: Theme
  /** 4 态循环: wine-light→wine-dark→plain-light→plain-dark */
  toggle: () => void
}

const STORAGE_KEY = 'wuh.site.theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_CYCLE: Theme[] = ['wine-light', 'wine-dark', 'plain-light', 'plain-dark']

function isValidTheme(value: unknown): value is Theme {
  return THEME_CYCLE.includes(value as Theme)
}

function parseTheme(raw: unknown): Theme {
  return isValidTheme(raw) ? raw : 'wine-light'
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const [family, scheme] = theme.split('-') as [ThemeFamily, ColorScheme]
  document.documentElement.dataset.themeFamily = family
  document.documentElement.dataset.colorScheme = scheme
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('wine-light')

  useEffect(() => {
    let stored: Theme | null = null
    try {
      stored = parseTheme(window.localStorage.getItem(STORAGE_KEY))
    } catch {}
    const resolved = stored ?? 'wine-light'
    setThemeState(resolved)
    applyTheme(resolved)
  }, [])

  useEffect(() => {
    applyTheme(theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  const toggle = useCallback(() => {
    setThemeState((current) => {
      const idx = THEME_CYCLE.indexOf(current)
      return THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]
    })
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({ theme, toggle }), [theme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeModeProvider')
  }
  return ctx
}
```

- [ ] **Step 2: Verify type check**

```bash
cd packages/wuh.site.next && pnpm exec tsc --noEmit
```

此时 SiteHeader 会有类型错误（仍引用旧的 `mode` / `toggleMode`）— 预期行为，Task 6 修复。

---

### Task 6: 更新 SiteHeader — 4 态按钮文案

**Files:**
- Modify: `packages/wuh.site.next/app/components/SiteHeader/index.tsx`

**Changes:**
- `mode` → `theme`，`toggleMode` → `toggle`
- 显示文案映射 4 态

- [ ] **Step 1: Update SiteHeader**

需要改动的行（精确替换）：

第 16 行:
```tsx
// 旧:
const { mode, toggleMode } = useThemeMode()
// 新:
const { theme, toggle } = useThemeMode()
```

第 46 行附近（desktop toggle button）:
```tsx
// 旧:
<S.ThemeToggle type='button' onClick={toggleMode} aria-label={`切换主题（当前：${mode === 'money' ? '酒红' : '素雅'}）`}>
  <S.ThemeDot aria-hidden='true' />
  <span>{mode === 'money' ? '酒红' : '素雅'}</span>
</S.ThemeToggle>
// 新:
<S.ThemeToggle type='button' onClick={toggle} aria-label={`切换主题（当前：${THEME_LABELS[theme]}）`}>
  <S.ThemeDot aria-hidden='true' />
  <span>{THEME_LABELS[theme]}</span>
</S.ThemeToggle>
```

第 74-83 行附近（mobile toggle）:
```tsx
// 旧:
toggleMode()
// 新:
toggle()
```

```tsx
// 旧:
<span>主题：{mode === 'money' ? '酒红' : '素雅'}</span>
// 新:
<span>主题：{THEME_LABELS[theme]}</span>
```

在组件函数体顶部（`export default function SiteHeader() {` 之后）添加常量：

```tsx
const THEME_LABELS: Record<Theme, string> = {
  'wine-light': '酒红明亮',
  'wine-dark': '酒红暗黑',
  'plain-light': '素雅明亮',
  'plain-dark': '素雅暗黑',
}
```

同时在文件顶部添加 import:
```tsx
import type { Theme } from '../theme/ThemeModeProvider'
```

- [ ] **Step 2: Verify type check**

```bash
cd packages/wuh.site.next && pnpm exec tsc --noEmit
```

预期：通过（SiteHeader 不再报错）。

---

### Task 7: 重写 /design/system-color — Design Token 调试面板

**Files:**
- Modify: `packages/wuh.site.next/app/design/system-color/page.tsx`

**Changes:**
- 从硬编码中国红 → 实时读取 CSS 变量并展示 4 种主题下的色板
- 引入 `useThemeMode()` 提供快速切换控件

- [ ] **Step 1: Replace page.tsx**

```tsx
'use client'
import * as React from 'react'
import styled from '@wuh.site/components/styled'
import { useThemeMode, type Theme } from '@/app/components/theme/ThemeModeProvider'

const H2 = styled.h2`
  margin-top: 32px;
  font-family: var(--font-sans);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
`

const H3 = styled.h3`
  margin-top: 16px;
  margin-left: 12px;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
`

const SwatchRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  gap: 0;
  margin: 8px 0 16px;

  & > div {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 500;
    font-family: var(--font-mono);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      height: 92px;
      margin-top: -12px;
    }
  }
`

const ToggleBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 16px 0 32px;
`

const ThemeChip = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  border: 1px solid ${(p) => (p.$active ? 'var(--primary-color)' : 'var(--normal-300)')};
  background: ${(p) => (p.$active ? 'color-mix(in srgb, var(--primary-color) 12%, transparent)' : 'var(--background-100)')};
  color: ${(p) => (p.$active ? 'var(--primary-color)' : 'var(--text-secondary)')};
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
  }
`

const Label = styled.span`
  display: inline-block;
  width: 140px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`

const THEME_OPTIONS: Theme[] = ['wine-light', 'wine-dark', 'plain-light', 'plain-dark']
const THEME_LABELS: Record<Theme, string> = {
  'wine-light': '酒红明亮',
  'wine-dark': '酒红暗黑',
  'plain-light': '素雅明亮',
  'plain-dark': '素雅暗黑',
}

function Swatch({ colors }: { colors: string[] }) {
  return (
    <SwatchRow>
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            backgroundColor: color,
            color: i < 4 ? '#fff' : '#222',
          }}
          title={`${(i + 1) * 100}: ${color}`}
        >
          {color}
        </div>
      ))}
    </SwatchRow>
  )
}

const COLOR_NAMES = ['primary', 'normal', 'background', 'success', 'danger', 'warning'] as const

function readPalette(family: string, name: string): string[] {
  const result: string[] = []
  for (let l = 100; l <= 900; l += 100) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}-${l}`)
      .trim()
    result.push(value || '#N/A')
  }
  return result
}

export default function DesignTokenPage() {
  const { theme, toggle } = useThemeMode()
  const [previewTheme, setPreviewTheme] = React.useState<Theme | null>(null)

  const activeTheme = previewTheme ?? theme

  // Sync preview to actual DOM
  React.useEffect(() => {
    if (!previewTheme) return
    const [family, scheme] = previewTheme.split('-') as ['wine' | 'plain', 'light' | 'dark']
    document.documentElement.dataset.themeFamily = family
    document.documentElement.dataset.colorScheme = scheme
    return () => {
      // Restore actual theme on unmount / preview change
      const [f, s] = theme.split('-') as ['wine' | 'plain', 'light' | 'dark']
      document.documentElement.dataset.themeFamily = f
      document.documentElement.dataset.colorScheme = s
    }
  }, [previewTheme, theme])

  const [currentColors, setCurrentColors] = React.useState<Record<string, string[]>>({})

  React.useEffect(() => {
    // Read CSS variables after render
    const colors: Record<string, string[]> = {}
    for (const name of COLOR_NAMES) {
      colors[name] = readPalette(activeTheme.split('-')[0], name)
    }
    setCurrentColors(colors)
  }, [activeTheme])

  return (
    <div style={{ padding: '48px', maxWidth: '960px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-2xl)', color: 'var(--text-primary)' }}>
        Design Token 调试面板
      </h1>

      <ToggleBar>
        <ThemeChip $active={!previewTheme} onClick={() => setPreviewTheme(null)}>
          ✓ 跟随页面
        </ThemeChip>
        {THEME_OPTIONS.map((t) => (
          <ThemeChip key={t} $active={activeTheme === t} onClick={() => setPreviewTheme(t)}>
            {THEME_LABELS[t]}
          </ThemeChip>
        ))}
      </ToggleBar>

      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 24 }}>
        当前生效主题: <strong>{THEME_LABELS[activeTheme]}</strong>
        &nbsp;| data-theme-family=&quot;{activeTheme.split('-')[0]}&quot;
        &nbsp;| data-color-scheme=&quot;{activeTheme.split('-')[1]}&quot;
      </p>

      <H2>语义变量</H2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px 16px' }}>
        {(['--primary-color', '--secondary-color', '--text-primary', '--text-secondary', '--text-muted', '--background-color', '--accent-color'] as const).map((v) => {
          const val = typeof window !== 'undefined'
            ? getComputedStyle(document.documentElement).getPropertyValue(v).trim()
            : ''
          return (
            <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: val, border: '1px solid var(--normal-300)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{v}</span>
            </div>
          )
        })}
      </div>

      {COLOR_NAMES.map((name) => (
        <React.Fragment key={name}>
          <H2>{name.charAt(0).toUpperCase() + name.slice(1)}</H2>
          {currentColors[name] ? (
            <Swatch colors={currentColors[name]} />
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>加载中...</p>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((l) => (
              <Label key={l}>--{name}-{l}</Label>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Type check**

```bash
cd packages/wuh.site.next && pnpm exec tsc --noEmit
```

预期：通过。

---

### Task 8: 更新设计系统 spec

**Files:**
- Modify: `openspec/specs/design-system/spec.md`
- Modify (archive): `openspec/changes/20260627_P_theme_system_refactor/specs/design-system/spec.md`

- [ ] **Step 1: Write updated spec**

新 spec 内容写入 `openspec/changes/20260627_P_theme_system_refactor/specs/design-system/spec.md`：

```markdown
# Design System — v2 Theme Architecture

## Theme Model

### Two Orthogonal Dimensions

| Dimension | Type | Values |
|-----------|------|--------|
| ThemeFamily | `'wine' \| 'plain'` | 酒红 / 素雅 |
| ColorScheme | `'light' \| 'dark'` | 明亮 / 暗黑 |

```ts
type Theme = `${ThemeFamily}-${ColorScheme}`
// 'wine-light' | 'wine-dark' | 'plain-light' | 'plain-dark'
```

### HTML Attributes

```html
<html data-theme-family="wine" data-color-scheme="light">
```

## CSS Variable Architecture (3-layer)

### Layer 1: Raw Palettes (`--_wl-primary-500` etc.)

All 4 palette variants defined as private CSS variables. Exported from `generator-color.ts` as `palettes`.

### Layer 2: Routing Selectors

```
:root                                           → wine light (default)
[data-theme-family="plain"]                     → plain light
[data-color-scheme="dark"]                      → wine dark
[data-theme-family="plain"][data-color-scheme="dark"] → plain dark
```

Each selector only sets public CSS variable names (`--primary-500`, `--normal-300`, etc.) as references to Layer 1 variables.

### Layer 3: Non-color Tokens

`spaces`, `fontSizes`, `borderRadii` — independent of theme family/color scheme.

### Semantic Variables

- `--primary-color`, `--secondary-color`, `--success-color`, `--danger-color`, `--warning-color`
- `--text-primary`, `--text-secondary`, `--text-muted`, `--text-color`
- `--background-color`, `--accent-color`
- `--page-bg`, `--elevation-soft`, `--elevation-card`, `--elevation-card-hover`

## Storage

- Key: `wuh.site.theme` (replaces `wuh.site.themeMode`)
- Value: `'wine-light' | 'wine-dark' | 'plain-light' | 'plain-dark'`
- Default: `'wine-light'`

## Components

- `ThemeModeProvider` — Context provider, sets `data-theme-family` + `data-color-scheme` on `<html>`, 4-state toggle
- `SiteHeader` — Theme toggle button with 4-state label display
- `/design/system-color` — Design token debug panel with real-time palette preview
```
