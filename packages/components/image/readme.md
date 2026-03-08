## Image 图片组件

基于 Next.js `next/image` 的 UI 包装，提供统一的加载骨架、错误兜底、宽高比、说明文案与 overlay 能力。

### 使用示例

```tsx
import Image from '@wuh.site/components/image'

export default function Demo() {
  return (
    <Image
      src="https://images.unsplash.com/photo-1503264116251-35a269479413"
      alt="Mountains"
      ratio="16:9"
      priority
      overlay={<span>© Unsplash</span>}
      caption="夏季山景，自动铺满容器且默认 lazy loading。"
    />
  )
}
```

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'cover' \| 'contain' \| 'fill' \| 'scale-down' \| 'none'` | `'cover'` | 控制 `object-fit` 行为 |
| `ratio` | `number \| \`\${number}:\${number}\`` | `undefined` | 设定宽高比（如 `16:9`），内部自动使用 `fill` 布局 |
| `borderRadius` | `string \| number` | `var(--border-radius-lg, 16px)` | 圆角 |
| `showSkeleton` | `boolean` | `true` | 是否展示加载骨架 |
| `skeleton` | `ReactNode` | - | 自定义骨架节点 |
| `errorFallback` | `ReactNode` | 默认插画 | 加载失败兜底内容 |
| `caption` | `ReactNode` | - | 图注文字，渲染在下方 |
| `overlay` | `ReactNode` | - | 覆盖在图片上的层，可用于显示版权/操作 |
| `disableTransition` | `boolean` | `false` | 关闭加载完成时的淡入/缩放动画 |
| `inline` | `boolean` | `false` | 以内联模式渲染，适用于按钮/文字内部 |
| `appearance` | `'default' \| 'plain'` | `default` | `plain` 将移除边框与背景，适合 Logo/图标场景 |
| `onStatusChange` | `(status: 'loading' \| 'loaded' \| 'error') => void` | - | 状态变化回调 |
| `wrapperStyle` / `imageStyle` | `CSSProperties` | - | 分别作用于外层 `figure` 与 Next Image |

其余 props 透传给 `next/image`，例如 `src`, `alt`, `width`, `height`, `fill`, `sizes`, `loading`, `priority` 等。
