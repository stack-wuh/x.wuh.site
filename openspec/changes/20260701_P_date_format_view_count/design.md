# 设计文档

## 智能日期格式化

```ts
function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr)
  const now = Date.now()
  const diff = now - d.getTime()
  const hours = diff / 3600000
  const days = diff / 86400000

  if (hours < 24) return `${Math.floor(hours)}小时前发布`
  if (days < 7) return `${Math.floor(days)}天前发布`
  if (days < 30) return `${d.getMonth() + 1}月${d.getDate()}日`
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}
```

## 首页/列表页日期

```ts
function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
```

## PostListItem 字段变更

```
comments: number  →  views: number
```

前端映射时 `views: 0`（占位），后续可接入真实计数。

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** PostListItem 字段 rename，需确认无其他消费者
- **向后兼容:** 不影响后端 API
