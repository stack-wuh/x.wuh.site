## Alert 警示框

用于文章详情页展示“冗余信息”的信息块，包含更新时间、原文链接、项目链接、标签与分享入口。

### 基础用法

```tsx
import Alert, { type ShareItem } from '@wuh.site/components/alert'

const shareItems: ShareItem[] = [
  { type: 'twitter', href: 'https://twitter.com/intent/tweet?text=hello' },
  { type: 'link', title: '复制链接', onClick: () => navigator.clipboard.writeText(location.href) },
]

<Alert
  framed={false}
  title='文章补充信息'
  summary='用于说明来源、转载与项目归属。'
  updatedAt='2026-03-08T08:30:00.000Z'
  sourceLink={{ label: '查看原文', href: 'https://github.com/stack-wuh/blog/issues/1' }}
  projectLink={{ label: 'stack-wuh/blog', href: 'https://github.com/stack-wuh/blog' }}
  labels={[
    { name: 'React', color: '0969da', href: 'https://github.com/stack-wuh/blog/issues?q=label%3AReact' },
  ]}
  copyright='本文遵循 CC BY-NC-SA 4.0 协议，转载请注明出处。'
  shareItems={shareItems}
/>
```

### Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | 提示样式类型 |
| `framed` | `boolean` | `true` | 是否渲染 Alert 自带外框；嵌入 `Card` 时建议设为 `false` |
| `showHeader` | `boolean` | `true` | 是否展示头部（图标 + 标题 + 摘要） |
| `title` | `ReactNode` | `'冗余信息'` | 标题 |
| `summary` | `ReactNode` | `以下为文章补充说明...` | 标题下说明 |
| `updatedAt` | `string \| number \| Date` | `undefined` | 更新时间（组件内格式化到分钟） |
| `sourceLink` | `{ label: string; href: string }` | `undefined` | 文档原链接 |
| `projectLink` | `{ label: string; href: string }` | `undefined` | GitHub Project 链接 |
| `labels` | `{ name: string; color?: string; href: string }[]` | `undefined` | 可点击标签列表 |
| `copyright` | `ReactNode` | `undefined` | 版权说明 |
| `shareItems` | `ShareItem[]` | `undefined` | 分享项（透传给 `SharedLinkGroup`） |
| `shareLabel` | `string` | `'分享文章'` | 分享模块标题 |
| `closable` | `boolean` | `false` | 是否显示关闭按钮 |
| `onClose` | `() => void` | `undefined` | 关闭回调（`closable=true` 时生效） |
