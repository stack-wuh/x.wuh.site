# 技术方案

## 数据模型

```ts
export type Theme = ThemeFamily  // 'wine' | 'plain'
```

ColorScheme 不再纳入 Theme 类型，由 matchMedia 独立管理。

## 核心改动

### ThemeModeProvider
- Theme 类型改为 ThemeFamily
- THEME_CYCLE: `['wine', 'plain']`
- 新增 matchMedia('(prefers-color-scheme: dark)') 监听
- toggle() 只切换 data-theme-family

### SiteHeader
- THEME_LABELS: `{ wine: '酒红', plain: '素雅' }`

### system-color 调试面板
- 预览芯片缩减为 2 个
- 不再手动操作 data-color-scheme

## 不改动的文件

- tokens.ts / generator-color.ts / cssVariableProvider.tsx — CSS 层不动
