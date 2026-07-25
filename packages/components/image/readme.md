## Image 图片组件

基于 Next.js `next/image` 的 UI 包装，统一加载骨架、错误兜底、宽高比与语义化图片外观。

### 语义角色

优先通过 `role` 表达用途，组件会统一处理 Wrapper 圆角、背景、边框、裁切和状态外观。

| Role | 圆角 | 背景 | object-fit | 用途 |
| --- | --- | --- | --- | --- |
| `avatar` | 50% | 透明 | cover | 人物头像 |
| `book-cover` | 2px | 中性纸张色 | contain | 小尺寸书封 |
| `content` | 8px | 内容背景 | contain | 正文图片 |
| `cover` | 12px，可覆盖 | 中性加载底 | cover | 文章/页面封面 |
| `thumbnail` | 8px | 中性底 | cover | 媒体缩略图 |
| `logo` | 0 | 透明 | contain | Logo 与透明 SVG |
| `qr` | 2px | 白色静区 | contain | 二维码 |

```tsx
<Image role='avatar' src={avatarUrl} alt='用户头像' width={56} height={56} />
<Image role='book-cover' src={coverUrl} alt='书名' width={40} height={54} />
<Image role='logo' imageClassName='brand-logo' src='/logo.svg' alt='wuh.site' width={64} height={38} />
```

属性优先级：

```text
显式 borderRadius / appearance / variant > role 预设 > 兼容默认值
```

未传 `role` 时暂时保持原默认行为，开发环境会提示迁移。

### Wrapper 与内部图片

- `className` 作用于 Wrapper，适合尺寸、布局、圆角和阴影。
- `imageClassName`、`imageStyle` 只作用于内部 Next Image，适合 filter、transform 等像素样式。
- Skeleton 和 fallback 继承 Wrapper 外轮廓。
- ImagePreview 主图/缩略图、独立 popup 图片和地图 SDK 资源保留专用实现。

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `role` | `ImageRole` | `undefined` | 图片语义角色 |
| `variant` | `'cover' \| 'contain' \| 'fill'` | role 或 `'cover'` | `object-fit` |
| `ratio` | `number \| \`${number}:${number}\`` | `undefined` | 宽高比，设置后使用 fill 布局 |
| `borderRadius` | `string \| number` | role 或 16px | Wrapper 圆角 |
| `showSkeleton` | `boolean` | role 或 `true` | 是否显示加载骨架 |
| `skeleton` | `ReactNode` | - | 自定义骨架 |
| `errorFallback` | `ReactNode` | 默认兜底 | 自定义错误内容 |
| `inline` | `boolean` | `false` | Wrapper 使用 inline-block |
| `appearance` | `'default' \| 'plain' \| 'qr'` | role 或 `default` | Wrapper 背景与边框 |
| `imageClassName` | `string` | - | 内部图片 class |
| `imageStyle` | `CSSProperties` | - | 内部图片样式 |
| `lazy` | `boolean` | `true` | 是否启用 IntersectionObserver 懒加载 |
| `rootMargin` | `string` | `200px` | 懒加载提前量 |
| `onStatusChange` | `(status) => void` | - | 状态变化回调 |

其余属性透传给 `next/image`，包括 `src`、`alt`、`width`、`height`、`fill`、`sizes`、`loading` 和 `priority`。
