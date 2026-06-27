# 设计 — 主题系统重构

## 数据模型

```ts
type ThemeFamily = 'wine' | 'plain'
type ColorScheme = 'light' | 'dark'

// 4 种组合
type Theme = `${ThemeFamily}-${ColorScheme}`
// 'wine-light' | 'wine-dark' | 'plain-light' | 'plain-dark'
```

## HTML 属性

```html
<html data-theme-family="wine" data-color-scheme="light">
```

替换当前 `data-theme="money|plain"`。

## CSS 变量架构 — Layer 1 + Layer 2 组合路由

### Layer 1: 私有调色板

所有 raw 颜色值定义为前缀变量，只定义一次：

```css
/* 前缀: _wl = wine light, _wd = wine dark, _pl = plain light, _pd = plain dark */
:root {
  --_wl-primary-500: #C94A44;  --_wd-primary-500: #E36A64;
  --_pl-primary-500: #C89060;  --_pd-primary-500: #D4A478;
  /* ... 6 色系 × 9 色阶 × 4 套 */
}
```

### Layer 2: 路由选择器

短 selector 做黑白名单路由：

```css
/* 默认: wine + light */
:root {
  --primary-500: var(--_wl-primary-500);
  --normal-500: var(--_wl-normal-500);
  /* ... */
}

[data-theme-family="plain"] {
  --primary-500: var(--_pl-primary-500);
  --normal-500: var(--_pl-normal-500);
}

[data-color-scheme="dark"] {
  --primary-500: var(--_wd-primary-500);
  --normal-500: var(--_wd-normal-500);
}

[data-theme-family="plain"][data-color-scheme="dark"] {
  --primary-500: var(--_pd-primary-500);
  --normal-500: var(--_pd-normal-500);
}
```

CSS 特异性自然叠加 — `plain` + `dark` 自动匹配到 `_pd` 前缀。

### Layer 3: 非颜色 tokens

`spaces`, `fontSizes`, `borderRadii` — 不变，只与色板无关。

## 切换逻辑

`ThemeModeProvider` 重写为 4 态循环：

```
wine-light → wine-dark → plain-light → plain-dark → wine-light ...
```

- `document.documentElement.dataset.themeFamily` + `.colorScheme` 同时设置
- localStorage key: `wuh.site.theme`
- 初始值：localStorage → 默认 `wine-light`

## 关键变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `themes/tokens.ts` | 修改 | 新增 ThemeFamily/ColorScheme 类型；删除 cssVariablesTokens |
| `themes/generator-color.ts` | 重写 | 导出 4 套 raw 调色板 `palettes` |
| `themes/index.ts` | 修改 | 删除 cssVariablesGenerator |
| `themes/cssVariableProvider.tsx` | 重写 | Layer 1+2+3 架构 |
| `app/.../ThemeModeProvider.tsx` | 重写 | 4 态循环 + 双属性设置 |
| `app/.../SiteHeader/index.tsx` | 修改 | 按钮文案 4 态 |
| `app/design/system-color/page.tsx` | 重写 | Design Token 面板 |
| `specs/design-system/spec.md` | 修改 | 更新规格 |
