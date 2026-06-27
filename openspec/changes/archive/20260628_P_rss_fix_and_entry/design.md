# 设计文档

## rss.service.ts 修复

```ts
// 修复前
link: `https://wuh.site/posts/${content.metadata?.slug || content.number}`

// 修复后
link: `https://wuh.site/post/${content.number}-${toSlug(content.title)}`

// 新增 state 过滤
state: 'open'
```

## layout.tsx <head> RSS link

```tsx
<link rel="alternate" type="application/rss+xml" title="wuh.site RSS" href="https://wuh.site/v2/rss.xml" />
```

## footer.tsx RSS 入口

在页脚加 RSS 订阅链接。

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 旧 RSS URL 不变
