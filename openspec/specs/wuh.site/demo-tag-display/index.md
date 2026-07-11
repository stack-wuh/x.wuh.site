---
component: Tag
keywords:
  - Tag
  - tag
  - 标签
  - label
  - badge
  - 徽标
  - category
  - chip
  - 分类
  - display
  - show
  - read-only
  - 展示
  - 只读
  - 呈现
  - metadata
  - 元信息
  - article
  - post
  - 文章
  - 博客
related: [demo-blog-list, demo-post-meta]
hooks: []
---

## 只读展示标签

在文章详情、列表卡片、信息面板中展示标签，仅用于标识，不支持交互。

Tag 渲染为纯展示元素，不支持点击事件。如需点击跳转，在外面包裹 `<a>`。

### 使用方式

```tsx
import Tag from '@wuh.site/components/tag'
```

### Props 说明

| Prop | 类型 | 说明 |
| --- | --- | --- |
| `label` | `string` | 标签文字 |
| `color` | `string \| null` | 标签颜色（hex），不传则默认 #8B7355 |
| `className` | `string` | 自定义类名 |

### 注意事项

- `color` 传 hex 色值（如 `#E06C75`），会自动从颜色衍生出背景和装饰线
- Tag 本身无点击/交互能力，如需可点击，外层封装 `<a>` 或 styled-component
- 同一页面大量标签时使用 `Row` + `gap` 排列
