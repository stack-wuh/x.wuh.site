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

Replaces legacy `data-theme="money|plain"`.

## CSS Variable Architecture (3-layer)

### Layer 1: Raw Palettes

All 4 palette variants defined as private CSS variables with prefixed names:

```
--_wl-primary-500   (wine light)
--_wd-primary-500   (wine dark)
--_pl-primary-500   (plain light)
--_pd-primary-500   (plain dark)
```

Exported from `generator-color.ts` as `palettes` (6 color groups × 4 variants + shared semantic colors).

### Layer 2: Routing Selectors

```
:root                                            → wine light (default)
[data-theme-family="plain"]                      → plain light
[data-color-scheme="dark"]                       → wine dark
[data-theme-family="plain"][data-color-scheme="dark"] → plain dark
```

Each selector maps private variables to public CSS variables (`--primary-500`, `--normal-300`, etc.).

### Layer 3: Non-color Tokens

`spaces`, `fontSizes`, `borderRadii` — independent of theme family / color scheme. Injected via styled-components theme props.

### Semantic Variables

- `--primary-color`, `--secondary-color`, `--success-color`, `--danger-color`, `--warning-color`
- `--text-primary`, `--text-secondary`, `--text-muted`, `--text-color`
- `--background-color`, `--accent-color`
- `--page-bg`, `--elevation-soft`, `--elevation-card`, `--elevation-card-hover`
- `--font-sans`, `--font-mono`, `--font-serif`

## Color Palettes

### Wine / 酒红

Primary: `#C94A44` (light) / `#E36A64` (dark)
Background: ivory-warm tone → deep brown

### Plain / 素雅

Primary: `#C89060` (light) / `#D4A478` (dark)
Background: paper-white → near-black
Typography: slightly smaller font sizes, increased line-height

## Storage

- Key: `wuh.site.theme` (replaces `wuh.site.themeMode`)
- Value: `'wine-light' | 'wine-dark' | 'plain-light' | 'plain-dark'`
- Default: `'wine-light'`

## Components

| Component | File | Role |
|-----------|------|------|
| `DefaultTheme` | `themes/index.ts` | JS-level token definitions (styled-components) |
| `CssVariableStyles` | `themes/cssVariableProvider.tsx` | CSS variable injection (3-layer architecture) |
| `ThemeModeProvider` | `app/.../ThemeModeProvider.tsx` | Context + localStorage + DOM attribute sync |
| `SiteHeader` | `app/.../SiteHeader/index.tsx` | 4-state theme toggle button |
| `/design/system-color` | `app/design/system-color/page.tsx` | Real-time design token debug panel |
