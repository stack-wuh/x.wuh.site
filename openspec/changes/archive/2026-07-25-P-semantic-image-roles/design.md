# 全站图片语义角色设计

## 架构

本次将共享 Image 从“统一默认视觉 + 页面局部覆盖”调整为“语义角色预设 + 显式属性覆盖 + 兼容默认值”。

```text
Image 调用
  ├─ role 语义角色
  │    ├─ Wrapper: radius / background / border / overflow
  │    ├─ Skeleton: 继承 Wrapper 形状
  │    ├─ Fallback: 继承角色尺寸与密度
  │    └─ Img: object-fit / filter / transform
  ├─ 显式属性覆盖
  │    ├─ borderRadius
  │    ├─ appearance
  │    ├─ variant
  │    ├─ imageClassName
  │    └─ imageStyle
  └─ 未传 role
       ├─ 保持当前兼容行为
       └─ 开发环境输出迁移提示
```

视觉属性优先级：

```text
调用方显式属性 > role 预设 > 兼容默认值
```

所有角色均由共享 Image 的 Wrapper 单点负责可见外轮廓。页面不再通过只作用于内部 `<img>` 的 inline style 修补圆角或背景。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| API | `role?: ImageRole` | 直接表达图片语义，避免页面重复组合圆角、背景和 fit |
| 兼容策略 | 无 role 时保持旧行为，并仅在开发环境提示 | 完成仓库内迁移的同时避免破坏未知组件库消费者 |
| 角色范围 | avatar/book-cover/content/cover/thumbnail/logo/qr | 均来自仓库真实调用，不创建未使用角色 |
| 书封圆角 | 2px | 小尺寸书封更接近实体书轮廓，避免 4–16px 过度圆润 |
| 头像背景 | transparent | 透明区域直接显示页面背景，不出现黑底或额外底盘 |
| 内容图 | 8px + 内容底色 + 轻边框 | 与现有 Markdown 编辑式视觉一致，并稳定承载透明 PNG |
| Logo | 0px + plain + contain | 避免透明 SVG 被默认背景、边框和裁切污染 |
| QR | 2px + white + contain | 保留扫码静区与亮暗主题下的高对比度 |
| 内部样式通道 | `imageClassName` / `imageStyle` | 修复当前 class 只落在 Wrapper、Logo filter 无法稳定应用的问题 |
| HTML 图片 | CSS normalization | dangerouslySetInnerHTML 链路无法直接使用 React Image，但可共享视觉规范 |
| 测试 | 组件契约测试 + 页面源码契约 + 浏览器视觉验收 | 覆盖 API、迁移完整性、亮暗主题与加载/错误状态 |

## 复用分析

| 现有能力 | 决策 |
|----------|------|
| `ImageProps.variant` | 保留，作为 role 默认 object-fit 的显式覆盖 |
| `ImageProps.appearance` | 保留，作为 role 背景/边框的显式覆盖 |
| `ImageProps.borderRadius` | 保留，优先级高于 role 预设 |
| Skeleton / errorFallback | 复用状态机，按 role 改变形状和密度 |
| `styled(Image)` | 继续支持 Wrapper 尺寸与布局；不再用于假定控制内部图片 |
| ImagePreview | 保留专用 `<img>`，因其依赖 transform、手势与按钮内图片动画 |
| Markdown/评论/足迹 HTML | 保留 HTML 链路，补齐 role 对应的 CSS 规范 |

## 数据模型

```ts
export type ImageRole =
  | 'avatar'
  | 'book-cover'
  | 'content'
  | 'cover'
  | 'thumbnail'
  | 'logo'
  | 'qr'

export interface ImageProps {
  role?: ImageRole
  imageClassName?: string
  imageStyle?: React.CSSProperties
  // 现有 props 保持不变
}
```

角色预设只提供默认值，不锁死调用方尺寸。`priority`、`width`、`height`、`ratio` 和 `sizes` 仍由具体页面根据布局和首屏位置决定。

## API 设计

无后端 API 变更。

### 角色默认值

| Role | Wrapper radius | Wrapper background | Border | Variant | Skeleton/Fallback |
|------|----------------|--------------------|--------|---------|-------------------|
| `avatar` | `50%` | transparent | none | cover | 圆形、紧凑 |
| `book-cover` | `2px` | 中性纸张色 | 极弱边线 | contain | 同书封形状 |
| `content` | `8px` | `--background-100` | 轻边框 | contain | 常规内容态 |
| `cover` | 可由上下文覆盖 | 中性加载底 | none | cover | 宽幅加载态 |
| `thumbnail` | `8px` | 中性底 | none | cover | 紧凑，无大段文字 |
| `logo` | `0` | transparent | none | contain | 默认关闭 Skeleton |
| `qr` | `2px` | `#fff` | 白色静区 | contain | 紧凑且保留白底 |

### 内部图片样式

- `className` 继续落在 Wrapper。
- `imageClassName` 仅落在内部 Next Image / `<img>`。
- `imageStyle` 仅落在内部图片。
- `style` 不再依赖未声明的透传行为；Wrapper 样式继续通过 styled-components 或正式 Wrapper style API 管理。

## 组件/模块设计

### Image role resolver

- 集中保存角色默认值，禁止在 JSX 中散落多层条件。
- 解析时先取 role 预设，再应用显式 `variant`、`appearance`、`borderRadius`。
- 未传 role 时保留当前默认 `cover`、默认 appearance 和默认圆角。
- 开发环境每个调用点或每个 role-less 实例发出可控提示；生产环境不输出日志。

### Wrapper 与状态层

- Wrapper 始终持有最终圆角、背景、边框和 `overflow:hidden`。
- Skeleton 和 fallback 使用 `inset:0`，自然继承 Wrapper 外轮廓。
- `avatar` fallback 不显示方形大文本；优先使用紧凑图标或调用方首字母 fallback。
- `thumbnail`、`qr` 等小尺寸角色不显示“图片加载失败”长文案。
- `prefers-reduced-motion` 下关闭 shimmer 和 opacity transition。

### 页面迁移

#### Avatar

- About GitHub 头像移除内部 `style={{ borderRadius: '50%' }}`，改为 `role='avatar'`。
- 文章作者头像迁移并保留现有 accent ring；ring 由外部容器或 Wrapper 扩展样式负责。
- 评论头像迁移时保留无图片首字母 fallback，不改变评论身份展示逻辑。

#### Book cover

- 首页与微信读书页统一 `role='book-cover'`。
- 删除页面重复的 appearance、variant 和 4px 圆角；尺寸、flex 和局部阴影强度可留在页面。
- 中性纸张底色同时适配酒红/素雅和浅色/深色主题。

#### Cover

- 文章头图改为 `role='cover'`。
- 桌面圆角与移动端 0 圆角必须落在 Image Wrapper，不允许父 12px、子 16px 双重裁切。
- 保留首屏 priority、16:9 和移动端 edge-to-edge 行为。

#### Logo

- 首页和 ContactCard Logo 改为 `role='logo'`。
- 使用 `imageClassName` 或 `imageStyle` 应用暗色 filter，移除当前无效的内部选择器假设。

#### Thumbnail

- 足迹照片迁移到 `role='thumbnail'`，保留点击预览与 1:1 比例。
- ImagePreview 内部 ThumbnailRail 明确保留专用实现。

#### QR

- ContactCard 二维码迁移到 `role='qr'`，使用 contain 和白色静区。
- 微信分享 popup 原生 QR 保持不变。

### HTML 内容图片规范

Markdown 正文、评论 HTML 与足迹正文中的图片统一：

- `max-width: 100%`
- `height: auto`
- 8px 圆角
- `--background-100` 背景
- 轻边框
- 透明图可读
- 不产生横向滚动

这些规则与 `content` role 视觉一致，但不伪装成 React Image 迁移。

## 响应式策略

| 场景 | 行为 |
|------|------|
| 书封 | 保持调用方固定小尺寸，2px 圆角不随断点放大 |
| 头像 | 保持 1:1 圆形，不因 flex 收缩变形 |
| 内容图 | 宽度不超过内容容器，高度按源比例自适应 |
| 文章封面 | 桌面保留页面圆角；移动端 Wrapper 圆角明确为 0 并 edge-to-edge |
| 缩略图 | 维持既定 ratio 与 cover，不挤压相邻文本 |
| Logo | 保持 intrinsic ratio，不裁切透明边缘 |
| QR | 保持 1:1 和白色静区，不被窄屏压缩到不可扫描尺寸 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；role 为可选，现有属性保留。
- **向后兼容:** 未传 role 的消费者保持当前行为；开发环境提示后续迁移。
- **性能影响:** 仅增加轻量角色解析；不新增请求。更多原生图片迁移到 Next Image 后可获得既有优化能力。
- **视觉风险:** 迁移面较广，需逐角色在酒红/素雅、浅色/深色、桌面/移动端检查。
- **可维护性:** 圆角、背景和加载态从页面零散声明收敛到角色预设，减少双层 Wrapper 冲突。
- **明确例外:** ImagePreview 主图/缩略图、popup QR、地图 SDK 资源保持专用实现。
