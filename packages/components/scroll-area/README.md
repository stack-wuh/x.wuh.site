# ScrollArea

主题化滚动区域，移植自 shadcn ScrollArea（`@radix-ui/react-scroll-area` 封装）。

- 滚动条为独立 DOM 渲染：Firefox / WebKit 行为一致，hover 或滚动中浮现（`data-state` 控制 opacity），键盘访问与触控适配由 Radix 提供
- 信笺风主题化：thumb 中性暖棕半透明，hover 加深带主色调；四主题（wine/plain × light/dark）自动适配
- 不虚拟化：全量渲染子内容。大列表场景请使用分页，不使用虚拟滚动

## 用法

```tsx
import ScrollArea from '@wuh.site/components/scroll-area'

const viewportRef = useRef<HTMLDivElement>(null)

<ScrollArea viewportRef={viewportRef} className="feed">
  {/* 全量渲染的消息列表 */}
</ScrollArea>

// 程序化滚动：viewportRef.current?.scrollTo({ top: ..., behavior: 'smooth' })
// 监听滚动：viewportRef.current?.addEventListener('scroll', handler)
```

## API

| Prop | 说明 |
|------|------|
| `viewportRef` | 视口元素引用，用于外部监听滚动或程序化滚动 |
| `type` | 滚动条出现方式：`scroll`（可滚动时渲染，默认）/ `always` / `hover` |
| `scrollHideDelay` | `type='hover'` 时隐藏延迟（毫秒，默认 500） |
| `className` | 根节点样式（高度需由消费方给定） |
