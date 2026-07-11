# 设计文档

## 架构

当前 Dialog header 渲染结构：

```
DialogHeader (flex row, align-items: center, justify-content: space-between)
├── DialogTitle (h3) ← title prop
└── CloseButton
```

改后：

```
DialogHeader (flex row, align-items: flex-start, justify-content: space-between)
├── DialogHeaderContent (flex column)
│   ├── DialogTitle (h3) ← title prop
│   └── DialogSubtitle (p) ← subtitle prop (新增)
└── CloseButton
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| subtitle 类型 | `ReactNode` | 与 title 一致，灵活支持文本/富文本 |
| 样式实现 | styled-components | 与现有 Dialog 样式体系一致 |
| DialogHeader 对齐 | `flex-start` | 适配 subtitle 多行时 close button 顶部对齐 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| Dialog | @wuh.site/components/dialog | 扩展（新增 subtitle prop） | wuh.site/demo-dialog-confirm |

## 组件/模块设计

### Dialog 组件

新增 props:

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `subtitle` | `ReactNode` | 无 | 标题下方副文本，小字 muted 颜色 |

新增样式组件 `DialogSubtitle`:

```tsx
export const DialogSubtitle = styled.p`
  margin: 0;
  font-size: var(--font-size-sm, 14px);
  color: var(--text-muted);
  font-weight: 400;
  line-height: 1.5;
`
```

### GuestbookBarrageDialog

- title: `"留言板"`
- subtitle: `"声无哀乐"`
- DialogBody 顶部新增引导短语: `"萍水楚客，路远情长"`

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无（subtitle 为可选 prop）
- **向后兼容:** 兼容，不传 subtitle 时表现与原来完全一致
- **性能影响:** 无

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 640px | header title + subtitle 垂直排列 |
| < 640px | header 内边距自动缩小 |
