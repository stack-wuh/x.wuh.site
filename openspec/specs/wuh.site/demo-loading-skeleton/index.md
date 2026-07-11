---
component: Skeleton
keywords:
  - Skeleton
  - skeleton
  - 骨架
  - loading
  - 加载
  - placeholder
  - shimmer
  - placeholder
  - 占位
  - text
  - rect
  - circle
  - variant
  - content loading
  - 内容加载中
  - suspense
  - fallback
  - 回退
related: [demo-blog-list, demo-image-cover]
hooks: []
---

## 加载骨架屏

数据加载时展示的骨架屏占位，支持文字(text)、矩形(rect)、圆形(circle)三种形态和 shimmer 闪烁动画。

### 使用方式

```tsx
import Skeleton from '@wuh.site/components/skeleton'
```

### Props 说明

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `variant` | `text \| rect \| circle` | 形态，默认 text |
| `width` | `number \| string` | 宽度，circle 默认等于高度 |
| `height` | `number \| string` | 高度，text 默认 12px |
| `radius` | `number \| string` | 圆角，text 默认 6px |
| `shimmer` | `boolean` | 闪烁动画，默认 true |

### 常见组合

| 场景 | variant | width | height |
| --- | --- | --- | --- |
| 标题占位 | text | 60% | 20px |
| 段落占位 | text | 100% | 12px |
| 头像占位 | circle | 40px | 40px |
| 图片占位 | rect | 100% | 200px |
