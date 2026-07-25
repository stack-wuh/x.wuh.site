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
