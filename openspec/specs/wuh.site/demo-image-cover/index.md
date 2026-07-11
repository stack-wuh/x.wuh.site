---
component: Image
keywords:
  - Image
  - image
  - 图片
  - picture
  - photo
  - cover
  - 封面
  - thumbnail
  - 缩略图
  - next/image wrapper
  - lazy loading
  - 懒加载
  - fallback
  - skeleton
  - 骨架
  - placeholder
  - 占位
  - variant
  - cover
  - contain
  - aspect ratio
  - 宽高比
  - ratio
  - appearance
related: [demo-blog-list, demo-loading-skeleton, demo-image-gallery]
hooks: []
---

## 文章封面图

在文章卡片、详情页头部使用的封面图。基于 next/image 封装，提供骨架过渡、懒加载、宽高比控制。

### 使用方式

```tsx
import Image from '@wuh.site/components/image'
```

### Props 说明

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `src` | `string` | 图片 URL |
| `alt` | `string` | 替代文本 |
| `variant` | `cover \| contain` | object-fit，默认 cover |
| `ratio` | `number \| "16:9"` | 宽高比，传入时自动启用 fill |
| `lazy` | `boolean` | 懒加载，默认 true |
| `showSkeleton` | `boolean` | 加载中显示骨架，默认 true |
| `errorFallback` | `ReactNode` | 加载失败时的回退 UI |
| `borderRadius` | `string \| number` | 圆角 |
| `appearance` | `default \| polished` | 外观变体，polished 添加光影 |

### 注意事项

- `ratio` 传字符串如 `"16:9"` 或数字 `1.778`，组件自动推导宽高比
- 有 ratio 时组件使用 fill 模式，不传 ratio 时需传 width/height
- 图片加载失败自动展示 fallback，内置默认图标
