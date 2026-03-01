## Button 按钮

Material Design 3 风格的按钮组件，支持实心、描边、文字三种变体，与主题色联动。

### 变体 (variant)

| 值        | 说明           |
|-----------|----------------|
| `filled`  | 实心按钮，带阴影（默认） |
| `outlined`| 描边按钮，透明底     |
| `text`    | 文字按钮，无边框无底   |

### 色彩 (color)

使用主题 token：`primary` | `secondary` | `success` | `warning` | `danger`。

### 尺寸 (size)

`small`（32px）| `medium`（40px，默认）| `large`（48px）。

### 使用示例

```tsx
import Button from '@wuh.site/components/button'

// 主按钮（实心）
<Button variant="filled" color="primary">确定</Button>

// 描边按钮
<Button variant="outlined" color="primary">取消</Button>

// 文字按钮
<Button variant="text" color="primary">了解更多</Button>

// 链接形态
<Button href="/about" variant="outlined">关于</Button>

// 图标 + 文案
<Button icon={<Icon />} iconPosition="left" size="large">提交</Button>

// 兼容旧 API：type 映射为 color
<Button type="primary">主按钮</Button>
<Button type="danger">删除</Button>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | `'filled' \| 'outlined' \| 'text'` | `'filled'` | 变体 |
| color | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | 色彩 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| icon | ReactNode | - | 图标 |
| iconPosition | `'left' \| 'right'` | `'left'` | 图标位置 |
| href | string | - | 存在且非 disabled 时渲染为 `<a>` |
| disabled | boolean | false | 禁用 |
| fullWidth | boolean | false | 占满宽度 |
| type | string | `'button'` | 兼容 `primary` / `success` 等，或原生 `button` / `submit` / `reset` |

支持透传原生 `<button>` / `<a>` 的 HTML 属性（如 `className`、`style`、`onClick`、`aria-*` 等）。
