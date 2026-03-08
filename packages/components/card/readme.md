# Card 卡片

基于 styled-components 的 Material 风格卡片容器，支持 `elevation` 阴影层级、`outlined/filled` 变体，以及 `Card.Header / Card.Content / Card.Actions` 复合结构。

## 使用示例

```tsx
import Card from '@wuh.site/components/card'
import Button from '@wuh.site/components/button'

export default function DemoCard() {
  return (
    <Card variant='elevated' elevation={2} interactive fullWidth>
      <Card.Header divider>
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Card 标题</h3>
        <span style={{ color: 'var(--text-muted)' }}>状态：草稿</span>
      </Card.Header>

      <Card.Content>
        这里是正文内容。Card 默认会使用主题变量（如 `--background-100`、`--text-primary`）适配浅色/深色模式。
      </Card.Content>

      <Card.Actions>
        <Button variant='text'>取消</Button>
        <Button>提交</Button>
      </Card.Actions>
    </Card>
  )
}
```

## Card Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'elevated' \| 'outlined' \| 'filled'` | `'elevated'` | 卡片视觉风格 |
| `elevation` | `0 \| 1 \| 2 \| 3 \| 4 \| 5` | `1` | 阴影层级（数值越大阴影越明显） |
| `interactive` | `boolean` | `false` | 开启 hover/active 交互态 |
| `fullWidth` | `boolean` | `false` | 宽度占满父容器 |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 根容器内边距 |

支持透传原生 `article` 的 HTML 属性（`className`、`style`、`aria-*`、`onClick` 等）。

## 子组件 Props

### `Card.Header`

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `divider` | `boolean` | `false` | 是否显示底部分割线 |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 头部内边距 |

### `Card.Content`

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `divider` | `boolean` | `false` | 是否显示顶部分割线 |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 内容区内边距 |

### `Card.Actions`

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `divider` | `boolean` | `true` | 是否显示顶部分割线 |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 操作区内边距 |
| `align` | `'start' \| 'center' \| 'end' \| 'between'` | `'end'` | 操作项水平对齐 |
| `wrap` | `boolean` | `false` | 操作项是否允许换行 |
