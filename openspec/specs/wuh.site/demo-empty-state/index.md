---
component: Empty
keywords:
  - Empty
  - empty
  - 空状态
  - no data
  - 无数据
  - nothing
  - placeholder
  - 占位
  - empty state
  - 空
  - result
  - 结果
  - no results
  - 无结果
  - fallback
  - 回退
related: [demo-blog-list, demo-pagination-blog, demo-result-error]
hooks: []
---

## 空状态占位

列表无数据、搜索无结果、内容为空时的友好提示展示。支持标题、描述、图标和操作按钮。

### 使用方式

```tsx
import Empty from '@wuh.site/components/empty'
```

### Props 说明

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | `ReactNode` | 标题，默认"空空如也" |
| `description` | `ReactNode` | 描述文字，不传时渲染 children |
| `icon` | `ReactNode` | 自定义图标，默认使用内置 EmptyIcon |
| `actions` | `ActionItem[]` | 操作按钮组，ActionItem = `{ label, href?, onClick?, variant?, color? }` |

### 注意事项

- `description` 不传时，children 作为描述渲染
- `actions` 自动渲染为 Button 组件列表
- 内置 role="status" aria-live="polite"
