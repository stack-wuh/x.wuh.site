# Empty

空状态组件，用于列表、结果页或数据为空时展示提示和操作入口。

## 用法

```tsx
<Empty title='暂无内容' description='暂时没有可展示的数据' actions={[{ label: '返回首页', href: '/' }]} />
```

## 关键 Props

- `title`：空状态标题，默认 `空空如也`。
- `description`：描述内容；未传时使用 `children`。
- `icon`：自定义图标，默认使用 `IconEmpty`。
- `actions`：按钮操作列表。
