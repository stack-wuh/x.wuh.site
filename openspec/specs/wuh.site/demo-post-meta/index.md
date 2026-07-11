---
component: Alert
keywords:
  - Alert
  - alert
  - 提示
  - info
  - 信息
  - meta
  - 元信息
  - metadata
  - 文章元信息
  - post meta
  - source
  - 来源
  - 原文链接
  - license
  - 许可
  - copyright
  - 版权
  - share
  - 分享
  - updated at
  - 更新时间
  - label
  - tag
  - 标签
  - SharedLinkGroup
  - sharing
  - 分享链接
related: [demo-tag-display, demo-page-layout]
hooks: []
---

## 文章元信息面板

在文章详情底部展示完整元信息：更新时间、原文链接、所属项目、开源许可、标签、分享。

Alert 是信息聚合组件，整合了多种元信息展示区域。

### 使用方式

```tsx
import Alert from '@wuh.site/components/alert'
```

### Props 说明

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | `ReactNode` | 面板标题，默认"冗余信息" |
| `summary` | `ReactNode` | 面板摘要 |
| `updatedAt` | `string \| number \| Date` | 更新时间 |
| `updatedBy` | `string` | 更新者名称 |
| `updatedByLink` | `string` | 更新者链接 |
| `sourceLink` | `{ label, href }` | 原文链接 |
| `labels` | `{ name, color?, href }[]` | 标签列表，内部渲染为 Tag |
| `license` | `ReactNode` | 开源许可信息 |
| `shareItems` | `ShareItem[]` | 分享目标列表 |

### 注意事项

- `labels` 渲染为可点击的标签链接
- `shareItems` 渲染为 SharedLinkGroup
- `framed` 控制是否显示边框，默认 true
