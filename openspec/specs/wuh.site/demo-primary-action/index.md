---
component: Button
keywords:
  - Button
  - button
  - 按钮
  - action
  - submit
  - 操作
  - 提交
  - link
  - href
  - 链接
  - cta
  - call-to-action
  - primary
  - filled
  - 实心
  - color
  - variant
  - loading
  - disabled
  - 禁用
  - form
  - 表单
  - click
  - 点击
related: [demo-icon-button]
hooks: []
---

## 主操作按钮

表单提交、页面主 CTA、关键操作入口。

Button 支持 `filled/outlined/text` 三种 variant，`primary/secondary/success/warning/danger` 五种色彩，可渲染为 `<a>` 链接。

### 使用方式

```tsx
import Button from '@wuh.site/components/button'
```

### Props 说明

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `variant` | `filled \| outlined \| text` | 视觉变体，默认 filled |
| `color` | `primary \| secondary \| success \| warning \| danger` | 色彩，默认 primary |
| `size` | `small \| medium \| large` | 尺寸，默认 medium |
| `icon` | `ReactNode` | 图标（lucide icon 或元素） |
| `iconPosition` | `left \| right` | 图标位置，默认 left |
| `href` | `string` | 传入则渲染为 `<a>` 链接 |
| `fullWidth` | `boolean` | 撑满父容器宽度 |
| `disabled` | `boolean` | 禁用状态 |

### 注意事项

- `href` 传值时渲染为 `<a>`，此时 `disabled` 无效
- variant 为 `filled` + color 为 `primary` 时自动应用渐变色背景
- icon 建议用 lucide-react 图标
