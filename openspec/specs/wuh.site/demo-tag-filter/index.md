---
component: Tag
keywords:
  - Tag
  - tag
  - 标签
  - filter
  - 筛选
  - select
  - toggle
  - 选择
  - 切换
  - active
  - 激活
  - click
  - interactive
  - 交互
  - 点击
  - blog
  - list
  - 博客
  - 列表
  - category
  - 分类
related: [demo-tag-display]
hooks: []
---

## 可点击筛选的标签

在筛选栏中作为标签选择器使用，点击切换选中状态。

Tag 本身不可点击，需要在外层封装可点击容器（`<button>` 或 styled-component），通过条件式传入不同 color 实现选中/未选中视觉。

### 使用方式

```tsx
import Tag from '@wuh.site/components/tag'
```

### 注意事项

- Tag 无内置选中状态，选中态通过改变 `color` 模拟
- 未选中时不传 `color`（默认色），选中时传高亮色
- 外层用 `<button>` 包裹以支持键盘和屏幕阅读器
