## Empty 空状态展示

用于展示“暂无内容 / 预留区域 / 读取失败”等空状态信息，样式基于全局 token（`--space-*`、`--font-size-*`、`--normal-*`、`--background-*`、`--text-*`）。

### 使用示例

```tsx
import Empty from '@wuh.site/components/empty'

<Empty
  title='留言系统预留区域'
  description='评论功能正在开发中，欢迎稍后回来留言交流。'
/>
```

### Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `'空空如也'` | 主标题 |
| `description` | `ReactNode` | `undefined` | 描述内容；未传时回退 `children` |
| `icon` | `ReactNode` | 默认空态图标 | 顶部图标 |

其余属性透传到根节点 `section`（例如 `className`、`style`、`aria-*` 等）。
