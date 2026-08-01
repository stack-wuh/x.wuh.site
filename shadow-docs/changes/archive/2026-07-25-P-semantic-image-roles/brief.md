# 全站图片语义角色与展示规范优化

> 原始变更名：`2026-07-25-P-semantic-image-roles`

## 元数据
- 日期：2026-07-25
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
共享 `@wuh.site/components/image` 当前将统一的默认圆角、背景、边框、Skeleton 和错误态应用于所有图片 Wrapper。不同图片语义依赖页面级 `styled(Image)` 或内部 `style` 局部覆盖，导致 Wrapper 与内部图片的视觉职责混淆。

已确认的可见问题包括：

- 微信读书小尺寸封面受过大的通用圆角影响，实体书封轮廓被过度圆润。
- About 页 GitHub 头像只对内部图片设置圆形，外层 Wrapper 仍保留默认背景和圆角，透明区域或加载状态会露出黑色/深色方底。
- 文章头图、Logo、二维码、缩略图等场景存在双层圆角、透明背景不稳定或内部图片样式通道失效的问题。
- Markdown、评论和足迹正文中的 HTML 图片没有统一遵循共享图片的内容图视觉规则。

本次属于现有图片组件与页面展示的 **chore 优化**：一次性建立基于实际使用场景的图片角色体系，并迁移可安全治理的现有调用点。

## 引用规范
- `specs/components/spec.md`

## 决策
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

## 任务
### Phase 1: 共享 Image 角色基础
- [ ] **文件:** `packages/components/image/index.tsx`、`packages/components/image/styles/index.tsx`、相关测试
- [ ] 先增加失败测试，覆盖 `ImageRole`、角色默认值、显式属性优先级和兼容默认行为
- [ ] 增加 `imageClassName`、`imageStyle` 的失败测试，确认其只作用于内部图片
- [ ] 增加开发环境无 role 提示和生产环境静默的契约
- [ ] **预计耗时:** 1.5 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 相关测试先 RED，最小实现后 GREEN
- [ ] **文件:** `packages/components/image/index.tsx`、`packages/components/image/styles/index.tsx`
- [ ] 实现 avatar/book-cover/content/cover/thumbnail/logo/qr 默认配置
- [ ] 确保 Wrapper 单点负责圆角、背景、边框和裁切
- [ ] 让 Skeleton 和 fallback 继承角色形状，并为小尺寸角色提供紧凑错误态
- [ ] 保持显式 `borderRadius`、`appearance`、`variant` 高于 role
- [ ] 保留未传 role 的兼容默认值
- [ ] **预计耗时:** 2 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 组件测试通过；类型检查通过
- [ ] **文件:** `packages/components/image/readme.md`
- [ ] 记录角色表、属性优先级、Wrapper/内部图片职责和迁移示例
- [ ] 记录 ImagePreview、popup QR、地图 SDK 等例外
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 文档无 TBD/TODO；示例与类型一致
### Phase 2: 高优先级页面迁移
- [ ] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`、`app/about/styles.ts`、`app/post/components/PostHeader.tsx`、`app/post/styles/post-header.ts`、`app/post/components/PostComments.tsx`
- [ ] 先增加失败测试，锁定圆形 Wrapper、透明背景和首字母 fallback
- [ ] About 头像移除内部 inline 圆角修补，使用 `role='avatar'`
- [ ] 文章作者头像迁移并保留 accent ring
- [ ] 评论头像迁移并保留无图片首字母显示
- [ ] **预计耗时:** 1.5 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 头像在浅色/深色均无黑底，Skeleton/fallback 保持圆形
- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`、`app/styles/index.ts`、`app/weread/WereadView.tsx`
- [ ] 先增加失败测试，锁定 `book-cover`、2px 圆角、contain 和中性纸张底
- [ ] 两处书封删除重复的 4px 圆角、appearance 和 variant 配置
- [ ] 保留调用方尺寸、flex 和必要的局部阴影差异
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 首页与微信读书页封面视觉一致且无过大圆角
- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`、`app/styles/index.ts`、`app/components/ContactCard.tsx`
- [ ] 先增加失败测试，锁定 logo 0 圆角透明外观和 QR 白底静区
- [ ] 首页 Logo 使用 role 与正式 `imageClassName`/`imageStyle`
- [ ] ContactCard Logo 迁移到 logo role
- [ ] ContactCard QR 迁移到 qr role，使用 contain 而非 cover
- [ ] **预计耗时:** 1.25 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** Logo 暗色 filter 生效；二维码在两种显示模式下保持可扫描
### Phase 3: 封面、缩略图与 HTML 内容
- [ ] **文件:** `packages/wuh.site.next/app/post/components/PostCover.tsx`、`app/post/styles/post-header.ts`
- [ ] 先增加失败测试，复现移动端父容器 0 圆角但 Image Wrapper 仍有默认圆角的问题
- [ ] 使用 cover role，让桌面和移动圆角都落在 Wrapper
- [ ] 保留 priority、16:9、edge-to-edge 和加载失败隐藏行为
- [ ] **预计耗时:** 1.25 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 320px 移动端封面真实直角；桌面按页面规范显示圆角
- [ ] **文件:** `packages/components/footprint-map/`、`packages/wuh.site.next/app/footprint/page.tsx`
- [ ] 先增加失败测试，锁定 1:1、cover、8px 和点击预览行为
- [ ] 将可安全的足迹照片迁移到 thumbnail role
- [ ] 不改变地图容器或 SDK 资源
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 图片布局、点击预览和键盘行为保持不变
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-markdown.ts`、评论样式、`app/footprint/` 内容样式
- [ ] 增加源码/视觉契约，锁定 max-width、height:auto、8px、背景和轻边框
- [ ] 让 Markdown、评论 HTML 和足迹正文图片与 content role 视觉一致
- [ ] 防止窄屏横向滚动
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 含透明 PNG 和超宽图片的 HTML 内容在 320px 下可读
### Phase 4: 回归与视觉验收
- [ ] **文件:** 本次所有变更
- [ ] 运行 Image 组件与页面相关测试
- [ ] 运行 Oxlint
- [ ] 运行 Next TypeScript 检查
- [ ] 运行 Next 构建
- [ ] 运行 `git diff --check`
- [ ] **预计耗时:** 1.25 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 所有命令零错误；若环境阻塞需记录根因而非绕过
- [ ] **页面:** `/`、`/weread`、`/about`、文章详情、足迹页、Contact Dialog
- [ ] 检查酒红/素雅 × 跟随系统/浅色/深色
- [ ] 检查 320px、375px、768px、1280px
- [ ] 检查透明头像、书封、Logo、内容图、文章封面、缩略图和二维码
- [ ] 检查加载中、加载失败、减少动效和图片预览交互
- [ ] **预计耗时:** 1.5 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 无黑底、无双层圆角、无布局跳动、无横向滚动
- [ ] 微信读书首页与列表书封均使用 2px 圆角
- [ ] About、文章作者和评论头像透明区域不显示黑底
- [ ] 头像 Skeleton/fallback 始终为圆形
- [ ] 首页与 ContactCard Logo 为 0 圆角透明外观，内部 filter 稳定生效
- [ ] 文章封面移动端为真实直角，桌面圆角由 Wrapper 单点负责
- [ ] 足迹缩略图保持 1:1、cover 和点击预览
- [ ] 二维码在所有主题下保持白底、静区和可扫描性
- [ ] HTML 内容图片不超出容器且与 content role 视觉一致
- [ ] ImagePreview、popup QR、地图 SDK 专用实现未被误改
- [ ] 未传 role 的旧消费者继续运行，开发环境提示迁移
- [ ] 相关测试、Lint、TypeScript、构建与 `git diff --check` 全部通过

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: semantic-image-roles
date: 2026-07-25
type: P
status: proposed
category: chore
issue: https://github.com/stack-wuh/x.wuh.site/issues/266
```

### `design.md`
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

### `proposal.md`
# 全站图片语义角色与展示规范优化

## 背景

共享 `@wuh.site/components/image` 当前将统一的默认圆角、背景、边框、Skeleton 和错误态应用于所有图片 Wrapper。不同图片语义依赖页面级 `styled(Image)` 或内部 `style` 局部覆盖，导致 Wrapper 与内部图片的视觉职责混淆。

已确认的可见问题包括：

- 微信读书小尺寸封面受过大的通用圆角影响，实体书封轮廓被过度圆润。
- About 页 GitHub 头像只对内部图片设置圆形，外层 Wrapper 仍保留默认背景和圆角，透明区域或加载状态会露出黑色/深色方底。
- 文章头图、Logo、二维码、缩略图等场景存在双层圆角、透明背景不稳定或内部图片样式通道失效的问题。
- Markdown、评论和足迹正文中的 HTML 图片没有统一遵循共享图片的内容图视觉规则。

本次属于现有图片组件与页面展示的 **chore 优化**：一次性建立基于实际使用场景的图片角色体系，并迁移可安全治理的现有调用点。

## 目标

- 为共享 Image 增加 `avatar`、`book-cover`、`content`、`cover`、`thumbnail`、`logo`、`qr` 语义角色。
- 明确 Wrapper 负责圆角、背景、边框、裁切、Skeleton 和 fallback，内部图片负责 object-fit、filter 和 transform。
- 微信读书封面统一使用 2px 小圆角和中性纸张底色。
- 头像统一使用圆形透明 Wrapper，不添加黑色、品牌色或纸张色底板。
- Logo 使用 0 圆角透明外观，并提供稳定的内部图片 class/style 通道。
- 内容图、页面封面、缩略图和二维码分别使用符合语义的视觉规则。
- 一次性迁移现有可安全迁移的 React 图片调用，并规范 HTML 内容图片。
- 保留未传 `role` 的兼容默认行为，在开发环境提示迁移，避免破坏未知消费者。

## 非目标（明确不做）

- 不改变图片源地址、上传流程、GitHub/微信读书数据或后端接口。
- 不将 ImagePreview 主图和内部缩略图强制迁移到共享 Image。
- 不处理地图 SDK 内部瓦片、marker 或媒体资源。
- 不将微信分享独立 popup 文档中的原生二维码图片改为 React/Next Image。
- 不重写 Markdown、评论和足迹 HTML 的渲染架构；仅统一其图片 CSS 视觉规范。
- 不删除现有 `variant`、`appearance`、`borderRadius` 等覆盖属性。

## 影响范围

- `packages/components/image/index.tsx` — 增加语义角色解析、内部图片样式通道和兼容提示。
- `packages/components/image/styles/index.tsx` — 按角色定义 Wrapper、Skeleton、fallback 和内部图片视觉。
- `packages/components/image/readme.md` — 记录角色 API、覆盖优先级、迁移规则和例外。
- `packages/wuh.site.next/app/HomeView.tsx`、`app/styles/index.ts` — 首页 Logo 与书封迁移。
- `packages/wuh.site.next/app/weread/WereadView.tsx` — 微信读书封面迁移。
- `packages/wuh.site.next/app/about/AboutView.tsx`、`app/about/styles.ts` — About 头像迁移并移除内部 style 修补。
- `packages/wuh.site.next/app/post/components/`、`app/post/styles/` — 文章作者头像、评论头像、文章头图与内容 HTML 图片规范。
- `packages/wuh.site.next/app/components/ContactCard.tsx` — Logo 与二维码迁移。
- `packages/components/footprint-map/`、`packages/wuh.site.next/app/footprint/` — 足迹缩略图和内容 HTML 图片规范。
- `packages/components/image-preview/` — 仅记录明确例外，不改变专用交互实现。
- 影响包：`@wuh.site/components`、`@wuh.site/next`。

### `specs/components/spec.md`
# Spec: 图片语义角色体系

## ADDED

### Requirement: Image 支持语义角色
- **GIVEN** 消费者使用共享 Image 渲染具有明确用途的图片
- **WHEN** 传入 `avatar`、`book-cover`、`content`、`cover`、`thumbnail`、`logo` 或 `qr` role
- **THEN** Image 按角色应用对应的 Wrapper 圆角、背景、边框、裁切、Skeleton 和 fallback
- **AND** 内部图片按角色应用 object-fit
- **AND** 调用方显式 `borderRadius`、`appearance`、`variant` 高于 role 默认值

### Requirement: 图片外轮廓由 Wrapper 单点负责
- **GIVEN** Image 同时包含 Wrapper、Skeleton、内部图片和 fallback
- **WHEN** 任一状态渲染
- **THEN** 可见圆角、背景、边框和裁切均由 Wrapper 统一提供
- **AND** Skeleton 与 fallback 继承相同外轮廓
- **AND** 页面不需要通过内部图片 inline style 修补 Wrapper 圆角

### Requirement: 内部图片提供正式样式通道
- **GIVEN** Logo 或交互图片需要对内部像素应用 filter、transform 或专用样式
- **WHEN** 消费者传入 `imageClassName` 或 `imageStyle`
- **THEN** 属性只应用于内部 Next Image / `<img>`
- **AND** 顶层 `className` 继续应用于 Wrapper

### Requirement: 未传 role 时保持兼容
- **GIVEN** 现有消费者未传 `role`
- **WHEN** Image 渲染
- **THEN** 保持变更前的默认 variant、appearance、圆角和状态行为
- **AND** 开发环境提示该调用迁移到语义角色
- **AND** 生产环境不输出迁移提示

### Requirement: 头像角色使用圆形透明外观
- **GIVEN** Image role 为 `avatar`
- **WHEN** 头像、Skeleton 或 fallback 渲染
- **THEN** Wrapper 为 1:1 圆形并使用 cover
- **AND** Wrapper 背景透明且无默认黑色、品牌色或纸张色底板
- **AND** 透明像素直接显示页面背景
- **AND** flex 布局下头像不被压缩变形

### Requirement: 书封角色保持实体书轮廓
- **GIVEN** Image role 为 `book-cover`
- **WHEN** 小尺寸微信读书封面渲染
- **THEN** Wrapper 使用 2px 圆角和 contain
- **AND** 使用中性纸张底色承载透明边缘
- **AND** Skeleton 与加载失败状态保持书封形状
- **AND** 首页和微信读书页允许保留不同尺寸

### Requirement: 内容图片具有稳定阅读外观
- **GIVEN** Image role 为 `content` 或图片来自 Markdown、评论、足迹 HTML 内容
- **WHEN** 图片渲染
- **THEN** 图片最大宽度不超过内容容器且高度按比例自适应
- **AND** 使用 8px 圆角、内容背景和轻边框
- **AND** 透明 PNG 在浅色与深色主题下均可辨识
- **AND** 窄屏不产生横向滚动

### Requirement: 页面封面圆角由上下文明确控制
- **GIVEN** Image role 为 `cover`
- **WHEN** 文章封面在桌面或移动端渲染
- **THEN** 使用 cover fit 和中性加载底
- **AND** 桌面圆角直接应用于 Image Wrapper
- **AND** 移动端 edge-to-edge 场景可将 Wrapper 圆角设为 0
- **AND** 不存在父容器与内部 Wrapper 的双重冲突圆角

### Requirement: 缩略图使用紧凑状态
- **GIVEN** Image role 为 `thumbnail`
- **WHEN** 足迹或普通媒体缩略图渲染
- **THEN** 使用 cover、8px 圆角和调用方指定 ratio
- **AND** 加载失败时使用不撑开布局的紧凑 fallback
- **AND** 点击预览和键盘交互不因迁移改变

### Requirement: Logo 保持透明完整
- **GIVEN** Image role 为 `logo`
- **WHEN** SVG 或透明 Logo 渲染
- **THEN** Wrapper 使用 0 圆角、透明背景、无边框和 contain
- **AND** 默认关闭 Skeleton
- **AND** 不裁切透明边缘
- **AND** 暗色模式 filter 可通过内部图片样式通道稳定生效

### Requirement: 二维码保持可扫描性
- **GIVEN** Image role 为 `qr`
- **WHEN** 二维码在浅色或深色主题下渲染
- **THEN** 使用 1:1、contain、2px 圆角和白色背景
- **AND** 保留足够白色静区
- **AND** 不因 cover 裁切、透明背景或主题底色降低扫码对比度

### Requirement: 专用图片链路保持例外
- **GIVEN** 图片属于 ImagePreview 主图/内部缩略图、微信分享 popup 或地图 SDK 资源
- **WHEN** 本次图片角色迁移执行
- **THEN** 保留其专用原生图片实现
- **AND** 不引入会破坏缩放、旋转、拖动、按钮动画或 SDK 行为的共享 Wrapper

### `tasks.md`
# 任务清单

> 本清单仅描述后续实施工作。当前 propose 阶段不修改产品代码。

## Phase 1: 共享 Image 角色基础

### Task 1: 建立角色 API 与失败契约

- [ ] **文件:** `packages/components/image/index.tsx`、`packages/components/image/styles/index.tsx`、相关测试
- [ ] 先增加失败测试，覆盖 `ImageRole`、角色默认值、显式属性优先级和兼容默认行为
- [ ] 增加 `imageClassName`、`imageStyle` 的失败测试，确认其只作用于内部图片
- [ ] 增加开发环境无 role 提示和生产环境静默的契约
- [ ] **预计耗时:** 1.5 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 相关测试先 RED，最小实现后 GREEN

### Task 2: 实现角色 resolver 与状态视觉

- [ ] **文件:** `packages/components/image/index.tsx`、`packages/components/image/styles/index.tsx`
- [ ] 实现 avatar/book-cover/content/cover/thumbnail/logo/qr 默认配置
- [ ] 确保 Wrapper 单点负责圆角、背景、边框和裁切
- [ ] 让 Skeleton 和 fallback 继承角色形状，并为小尺寸角色提供紧凑错误态
- [ ] 保持显式 `borderRadius`、`appearance`、`variant` 高于 role
- [ ] 保留未传 role 的兼容默认值
- [ ] **预计耗时:** 2 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 组件测试通过；类型检查通过

### Task 3: 更新 Image 文档

- [ ] **文件:** `packages/components/image/readme.md`
- [ ] 记录角色表、属性优先级、Wrapper/内部图片职责和迁移示例
- [ ] 记录 ImagePreview、popup QR、地图 SDK 等例外
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 文档无 TBD/TODO；示例与类型一致

## Phase 2: 高优先级页面迁移

### Task 4: 迁移头像角色

- [ ] **文件:** `packages/wuh.site.next/app/about/AboutView.tsx`、`app/about/styles.ts`、`app/post/components/PostHeader.tsx`、`app/post/styles/post-header.ts`、`app/post/components/PostComments.tsx`
- [ ] 先增加失败测试，锁定圆形 Wrapper、透明背景和首字母 fallback
- [ ] About 头像移除内部 inline 圆角修补，使用 `role='avatar'`
- [ ] 文章作者头像迁移并保留 accent ring
- [ ] 评论头像迁移并保留无图片首字母显示
- [ ] **预计耗时:** 1.5 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 头像在浅色/深色均无黑底，Skeleton/fallback 保持圆形

### Task 5: 迁移书封角色

- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`、`app/styles/index.ts`、`app/weread/WereadView.tsx`
- [ ] 先增加失败测试，锁定 `book-cover`、2px 圆角、contain 和中性纸张底
- [ ] 两处书封删除重复的 4px 圆角、appearance 和 variant 配置
- [ ] 保留调用方尺寸、flex 和必要的局部阴影差异
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 首页与微信读书页封面视觉一致且无过大圆角

### Task 6: 迁移 Logo 与二维码

- [ ] **文件:** `packages/wuh.site.next/app/HomeView.tsx`、`app/styles/index.ts`、`app/components/ContactCard.tsx`
- [ ] 先增加失败测试，锁定 logo 0 圆角透明外观和 QR 白底静区
- [ ] 首页 Logo 使用 role 与正式 `imageClassName`/`imageStyle`
- [ ] ContactCard Logo 迁移到 logo role
- [ ] ContactCard QR 迁移到 qr role，使用 contain 而非 cover
- [ ] **预计耗时:** 1.25 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** Logo 暗色 filter 生效；二维码在两种显示模式下保持可扫描

## Phase 3: 封面、缩略图与 HTML 内容

### Task 7: 迁移文章封面

- [ ] **文件:** `packages/wuh.site.next/app/post/components/PostCover.tsx`、`app/post/styles/post-header.ts`
- [ ] 先增加失败测试，复现移动端父容器 0 圆角但 Image Wrapper 仍有默认圆角的问题
- [ ] 使用 cover role，让桌面和移动圆角都落在 Wrapper
- [ ] 保留 priority、16:9、edge-to-edge 和加载失败隐藏行为
- [ ] **预计耗时:** 1.25 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 320px 移动端封面真实直角；桌面按页面规范显示圆角

### Task 8: 迁移足迹缩略图

- [ ] **文件:** `packages/components/footprint-map/`、`packages/wuh.site.next/app/footprint/page.tsx`
- [ ] 先增加失败测试，锁定 1:1、cover、8px 和点击预览行为
- [ ] 将可安全的足迹照片迁移到 thumbnail role
- [ ] 不改变地图容器或 SDK 资源
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 图片布局、点击预览和键盘行为保持不变

### Task 9: 统一 HTML 内容图片 CSS

- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-markdown.ts`、评论样式、`app/footprint/` 内容样式
- [ ] 增加源码/视觉契约，锁定 max-width、height:auto、8px、背景和轻边框
- [ ] 让 Markdown、评论 HTML 和足迹正文图片与 content role 视觉一致
- [ ] 防止窄屏横向滚动
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 含透明 PNG 和超宽图片的 HTML 内容在 320px 下可读

## Phase 4: 回归与视觉验收

### Task 10: 完整质量门禁

- [ ] **文件:** 本次所有变更
- [ ] 运行 Image 组件与页面相关测试
- [ ] 运行 Oxlint
- [ ] 运行 Next TypeScript 检查
- [ ] 运行 Next 构建
- [ ] 运行 `git diff --check`
- [ ] **预计耗时:** 1.25 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 所有命令零错误；若环境阻塞需记录根因而非绕过

### Task 11: 浏览器矩阵验收

- [ ] **页面:** `/`、`/weread`、`/about`、文章详情、足迹页、Contact Dialog
- [ ] 检查酒红/素雅 × 跟随系统/浅色/深色
- [ ] 检查 320px、375px、768px、1280px
- [ ] 检查透明头像、书封、Logo、内容图、文章封面、缩略图和二维码
- [ ] 检查加载中、加载失败、减少动效和图片预览交互
- [ ] **预计耗时:** 1.5 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 无黑底、无双层圆角、无布局跳动、无横向滚动

## 验收

- [ ] 微信读书首页与列表书封均使用 2px 圆角
- [ ] About、文章作者和评论头像透明区域不显示黑底
- [ ] 头像 Skeleton/fallback 始终为圆形
- [ ] 首页与 ContactCard Logo 为 0 圆角透明外观，内部 filter 稳定生效
- [ ] 文章封面移动端为真实直角，桌面圆角由 Wrapper 单点负责
- [ ] 足迹缩略图保持 1:1、cover 和点击预览
- [ ] 二维码在所有主题下保持白底、静区和可扫描性
- [ ] HTML 内容图片不超出容器且与 content role 视觉一致
- [ ] ImagePreview、popup QR、地图 SDK 专用实现未被误改
- [ ] 未传 role 的旧消费者继续运行，开发环境提示迁移
- [ ] 相关测试、Lint、TypeScript、构建与 `git diff --check` 全部通过
