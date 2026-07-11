---
component: Result
keywords:
  - Result
  - result
  - 结果页
  - error
  - 错误
  - 404
  - not found
  - 找不到
  - 500
  - server error
  - 服务异常
  - page error
  - 页面错误
  - status
  - 状态
  - link
  - 链接
  - redirect
  - 跳转
  - info
  - 信息
related: [demo-empty-state]
hooks: []
---

## 错误结果页

404 找不到、500 服务异常等全页错误展示。卡片式布局，左侧图标区 + 右侧内容区。

Result 会覆盖 70vh 高度，适用于独立错误页面。

### 使用方式

```tsx
import Result from '@wuh.site/components/result'
```

### Props 说明

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `status` | `404 \| 500 \| info \| error` | 状态，默认 info |
| `title` | `ReactNode` | 大标题，各 status 有默认值 |
| `description` | `ReactNode` | 描述文字 |
| `icon` | `ReactNode` | 自定义图标 |
| `links` | `{ label, href?, target?, rel? }[]` | 推荐链接组 |
| `extra` | `ReactNode` | 额外操作区域 |

### 注意事项

- `status="404"` 和 `"500"` 有内置默认标题和描述
- `links` 中的链接有 href 时渲染为可点击链接，无 href 时为纯文字
- 适合独立页面使用，不适合内嵌在卡片/面板中
