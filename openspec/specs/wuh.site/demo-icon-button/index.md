---
component: Button
keywords:
  - Button
  - button
  - 按钮
  - icon
  - 图标
  - icon-only
  - toolbar
  - 工具栏
  - ghost
  - text variant
  - action
  - compact
  - 紧凑
  - small
  - 小尺寸
  - action bar
  - 操作栏
related: [demo-primary-action]
hooks: []
---

## 纯图标按钮

在工具栏、操作栏、紧凑空间中仅展示图标，不展示文字标签。

使用 `variant="text"` + `size="small"` + 只传 `icon` 不传 children 实现。

### 使用方式

```tsx
import Button from '@wuh.site/components/button'
```

### 注意事项

- 不传 children 时按钮仅显示图标
- 建议配合 `variant="text"` 或 `variant="outlined"` 使用，避免过重
- 如需无障碍标签，使用 `aria-label` 属性
