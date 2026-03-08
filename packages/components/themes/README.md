# Themes 主题系统

`@wuh.site/components/themes` 提供了组件库统一的主题变量、Token 类型定义及 Provider，确保在 Next/React 应用中可以共享颜色与尺寸体系。

## 目录结构

- `tokens.ts`：导出 token 类型（颜色、空间、字号等）以及 `Tokens` 接口。
- `cssVariableProvider.tsx` / `themeProvider.tsx`：注入 CSS 变量并提供 React Context。
- `global.tsx`：全局样式与 reset。
- `generator-color.ts`：根据基础色生成不同明暗层级。

## 快速使用

```tsx
import ThemeProvider from '@wuh.site/components/themes/themeProvider'
import GlobalStyle from '@wuh.site/components/themes/global'

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  )
}
```

## 获取 Token

结合 `packages/hooks/useTokens` 可以在组件中读取当前主题值：

```tsx
import { useTokens } from '@/packages/hooks/useTokens'

const primary500 = useTokens('primary', '500') // => '#2563eb'
```

> 所有 UI 组件在实现时需尽量使用这些 token 或 CSS 变量（如 `--primary-color`、`--space-md`），以便支持暗色模式与主题定制。
