---
component: Flex
keywords:
  - Flex
  - flex
  - 弹性布局
  - Row
  - row
  - 行
  - Column
  - column
  - 列
  - Center
  - center
  - 居中
  - SpaceBetween
  - space between
  - 两端对齐
  - SpaceAround
  - Wrap
  - wrap
  - 换行
  - layout
  - 布局
  - gap
  - 间距
  - padding
  - margin
  - align
  - justify
  - page layout
  - 页面布局
  - container
related: [demo-blog-list, demo-post-meta]
hooks: []
---

## 页面布局

使用 Flex / Row / Column / Center 等便捷变体快速搭建页面结构。

Flex 组件支持便捷变体：`Row`（水平）、`Column`（垂直）、`Center`（居中）、`SpaceBetween`（两端对齐）、`Wrap`（换行）等。

### 使用方式

```tsx
import { Flex, Row, Column, Center, SpaceBetween, Wrap } from '@wuh.site/components/flex'
```

### Props 说明

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `direction` | `row \| column` | 主轴方向 |
| `justifyContent` | 标准 CSS | 主轴对齐 |
| `alignItems` | 标准 CSS | 交叉轴对齐 |
| `gap` | `string \| [row, col]` | 间距，支持主题 Token |
| `padding` | `string \| [t, r, b, l]` | 内边距 |
| `margin` | `string \| [t, r, b, l]` | 外边距 |
| `wrap` | `boolean` | 是否换行 |
| `fullWidth` | `boolean` | 宽度 100% |

### 注意事项

- `gap` 和 `padding` 支持主题 spacing token（如 `"md"`、`"lg"`、`"2xl"`）
- 数组写法 `[row, column]` 或 `[top, right, bottom, left]`
- 便捷变体是预配置的 styled(Flex) 组件，可直接使用
