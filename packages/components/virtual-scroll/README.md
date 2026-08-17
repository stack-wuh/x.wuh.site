# VirtualScroll

基于 react-virtuoso 的虚拟滚动列表组件。

## 用法

```tsx
<VirtualScroll items={items} renderItem={(item, i) => <div key={i}>{item}</div>} />
```

## 关键 Props

- `items`：列表数据。
- `renderItem`：渲染单条数据。
- `followOutput`：追加条目时是否跟随到底部。
