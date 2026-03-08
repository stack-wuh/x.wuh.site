# Tag 标签

以 GitHub 标签样式展示仓库/文章标签，自动根据传入的十六进制颜色计算前景色，并提供悬停互换效果。

## 使用示例

```tsx
import Tag from '@wuh.site/components/tag'

const labels = [
  { name: 'Next.js', color: '0f172a' },
  { name: 'Styled Components', color: 'd0d7de' },
  { name: 'Tooling' }, // 缺省颜色时使用默认配色
]

export default function TagList() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {labels.map(label => (
        <Tag key={label.name} label={label.name} color={label.color} />
      ))}
    </div>
  )
}
```

## Props

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `string` | 标签文案 |
| `color` | `string \| null` | GitHub API 返回的 6 位 HEX 颜色；缺省时回退默认灰色方案 |
| `className` | `string` | 允许通过 styled-components/emotion 等进一步定制 |

> 提示：组件内部根据颜色亮度自动计算文字颜色，hover 时会将文字与背景互换并伴随轻微上浮动画。
