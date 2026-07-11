---
component: Card
keywords:
  - Card
  - card
  - 卡片
  - blog
  - article
  - post
  - feed
  - list
  - 博客
  - 文章
  - 列表
  - cover
  - thumbnail
  - image
  - summary
  - excerpt
  - tag
  - 封面
  - 缩略图
  - 摘要
  - 标签
  - navigate
  - click
  - href
  - link
  - 跳转
  - 导航
  - 点击
  - display
  - show
  - present
  - 展示
  - 呈现
  - 渲染
  - homepage
  - blogPage
  - archive
  - 首页
  - 归档
related: [demo-tag-display, demo-pagination-blog]
hooks: []
---

## 博客列表中的文章卡片

在博客列表页 / 首页文章 feed 中展示每篇文章的概览。

`Card` 是复合组件，Card.Content 放置文章内容。

### 使用方式

```tsx
import Card from '@wuh.site/components/card'
```

### 注意事项

- 封面图缺失时不传 `image`，组件内部无图片位置占用
- `summary` 过长时组件内部处理截断，无需外部处理
- `tags` 为空数组时不渲染标签区域
- 典型用法是 Card + Card.Content 组合，Content 内自由编排
