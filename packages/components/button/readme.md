# Button 按钮

主题按钮组件，支持按钮和链接两种渲染形态。

## 用法

```tsx
import Button from '@wuh.site/components/button'

<Button variant='filled' color='primary'>确认</Button>
<Button href='/blog' variant='outlined'>查看博客</Button>
```

## 关键 Props

- `variant`：`filled`、`outlined`、`text`。
- `color`：`primary`、`secondary`、`success`、`warning`、`danger`。
- `size`：`small`、`medium`、`large`。
- `href`：存在且未禁用时渲染为链接（站内路径走软导航）。
- `icon` / `iconPosition`：图标内容与位置。
- `fullWidth` / `disabled`：整行宽 / 禁用。
- `type`：历史字段，旧 `type='primary'` 等自动映射为同名 `color`（见 `types.ts`）。

## 结构说明

- `index.tsx` — 唯一入口 + 实现，default export。
- `types.ts` — `ButtonProps` + `ButtonTransientProps`（`$` 前缀瞬态 props）类型契约，并 re-export `tokens` 的枚举类型。
- `styles/` — styled-components 样式块，经 transient props 消费令牌。
- `tokens.ts` — 跨区块复用的尺寸/间距令牌（`buttonTokens`），来源 M3 spec。
- `index.test.mjs` — 结构守卫：入口引用形态与样式导出断言。

本组件是 packages/components 的标杆参照实现，新增组件的结构组织以本目录为准（规范见 `shadow-docs/knowledge/component-standard.md`）。
