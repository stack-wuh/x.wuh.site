# Design System

## MODIFIED: 主题系统 v2 架构

### Requirement: 双维度主题模型
- **GIVEN** 主题系统支持 `ThemeFamily` 和 `ColorScheme` 两个正交维度
- **WHEN** 用户切换主题
- **THEN** `data-theme-family` 取值为 `wine` (酒红) 或 `plain` (素雅)
- **AND** `data-color-scheme` 取值为 `light` (明亮) 或 `dark` (暗黑)
- **AND** Theme = `'wine-light' | 'wine-dark' | 'plain-light' | 'plain-dark'`
- **AND** 存储于 localStorage key `wuh.site.theme`

### Requirement: 三层 CSS 变量架构
- **GIVEN** `cssVariableProvider.tsx` 全局样式
- **WHEN** 浏览器加载页面
- **THEN** Layer 1: `:root` 注入所有 raw 调色板（`--_wl-primary-500` 等）
- **AND** Layer 2: 4 个 selector 路由映射到公开 CSS 变量（`:root`, `[data-theme-family="plain"]`, `[data-color-scheme="dark"]`, `[data-theme-family="plain"][data-color-scheme="dark"]`）
- **AND** Layer 3: 非颜色 tokens (spaces/fontSizes/borderRadius) 通过 theme props 注入

### Requirement: CSS 变量命名规范
- **GIVEN** 组件使用 CSS 变量
- **THEN** 颜色: `--primary-color`, `--primary-{100-900}`, `--normal-{100-900}`, `--background-{100-900}`
- **AND** 语义: `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-color`
- **AND** 排版: `--font-serif`, `--font-size-{scale}`, `--space-{scale}`
- **AND** 视觉: `--elevation-{soft|card|card-hover}`, `--radius-card`, `--page-bg`

## ADDED: TypewriterMotto 打字动画

### Requirement: 首页标语打字动画
- **GIVEN** 用户访问首页
- **WHEN** Motto 区域渲染
- **THEN** 标语以打字机效果逐字显示，尾部有闪烁光标
- **AND** 每个字符出现时溅出 2-3 个粒子光点
- **AND** 光标附近有 glow 模糊光晕
- **AND** 第一句打完停顿 3.5s 后逐字回删，切换第二句继续打字
- **AND** 两句循环："写作是抵抗遗忘的方式，代码是构建世界的语言。" / "不要停步不前，每一天都要做出改变。"

## MODIFIED: 首页组件

### Requirement: HomeView Motto 区域
- **GIVEN** 用户访问首页 `/`
- **WHEN** 页面渲染
- **THEN** 展示: 小 Hero (头像+引言) → TypewriterMotto 动画标语 → CTA 按钮组 → 社交链接 → 博客时间线 → 项目列表 → 页脚
- **AND** 装饰分隔线 (OrnamentDivider) 划分各 section
- **AND** 博客列表以单列时间线展示代替卡片网格
- **AND** Motto 使用 TypewriterMotto 动态组件代替静态 blockquote

## MODIFIED: 博客详情页

### Requirement: PostView 组件拆分
- **GIVEN** 用户访问博客详情 `/post/[number]`
- **WHEN** 页面渲染
- **THEN** 拆分独立子组件: PostHeader / MarkdownBody / ShareCard
- **AND** 样式使用文青纸张风排版（衬线字体、增大的行高和间距）

### Requirement: marked 前端解析 markdown
- **GIVEN** GitHub API 不再返回 `body_html`
- **WHEN** 获取到 issue body (原始 markdown)
- **THEN** 前端使用 `marked` 库解析为 HTML
- **AND** 通过 sanitize 处理 XSS 风险
- **AND** 渲染到 MarkdownBody 组件

### Requirement: MarkdownBody 排版细化
- **GIVEN** 解析后的 HTML 内容
- **WHEN** MarkdownBody 组件渲染
- **THEN** 标题使用衬线字体、适当字重
- **AND** 代码块使用暗色背景 + 圆角 + 复制按钮
- **AND** 表格有边框、斑马纹、溢出处理
- **AND** 引用块有左侧色条 + 斜体 + 背景色
- **AND** 链接使用虚线下划线，hover 变实线
- **AND** 图片有圆角 + 阴影 + 边框

## ADDED: 暗黑模式闪动修复

### Requirement: 首屏主题无闪动
- **GIVEN** 用户首次访问页面或刷新页面
- **WHEN** 浏览器解析 HTML
- **THEN** `<head>` 中的同步脚本在首次渲染前设置 `data-color-scheme` 和 `data-theme-family`
- **AND** 页面首次渲染时 CSS 选择器匹配正确的主题色
- **AND** 不出现亮→暗或暗→亮的视觉闪烁

### Requirement: 首屏禁用过渡动画
- **GIVEN** `<head>` 脚本开始执行
- **WHEN** 同步脚本设置主题数据属性之前
- **THEN** 脚本使用 `setAttribute('data-no-transition', '')` 设置属性（而非 dataset API）
- **AND** 脚本调用 `void document.documentElement.offsetHeight` 强制重排，确保浏览器已应用 `transition: none`
- **AND** 所有元素的 `transition` 被禁用后，脚本才设置 `data-colorScheme` 和 `data-themeFamily`
- **AND** 设置完毕后立即调用 `removeAttribute('data-no-transition')` 恢复过渡
- **AND** 整个流程在同一个同步块中完成，不依赖 React hydration

### Requirement: 全局主题色过渡动画
- **GIVEN** 系统或用户切换亮暗主题
- **WHEN** `data-color-scheme` 或 `data-theme-family` 属性值变化
- **THEN** 所有元素的 background-color、color、border-color、box-shadow 以 0.3s ease 平滑过渡
- **AND** 过渡覆盖所有元素及其伪元素

## ADDED: 首页主题切换控件

### Requirement: 桌面端现代主题胶囊控件
- **GIVEN** 用户在视口宽度不小于 768px 的首页访问头部
- **WHEN** 主题切换控件渲染
- **THEN** 控件以轻量胶囊布局展示主题图标、当前主题名称和可切换提示
- **AND** 控件不呈现通用 Button 的默认实心渐变视觉
- **AND** hover、active、focus-visible 状态具有清晰且不突兀的反馈

### Requirement: 移动端主题操作项始终显示图标
- **GIVEN** 用户在视口宽度小于 768px 的首页打开移动菜单
- **WHEN** 主题操作项渲染
- **THEN** 操作项以不小于 44px 的整行触摸目标展示
- **AND** 主题图标、操作文案和当前主题名称均可见
- **AND** 图标不会因 flex 收缩、容器宽度或通用按钮默认样式而消失

### Requirement: 主题切换行为保持不变
- **GIVEN** 当前主题为 `wine` 或 `plain`
- **WHEN** 用户点击桌面端或移动端主题控件
- **THEN** 主题在两个主题家族之间循环切换
- **AND** 更新 `document.documentElement.dataset.themeFamily`
- **AND** 持久化到 `wuh.site.theme`
- **AND** 移动端点击后关闭菜单

### Requirement: 主题控件可访问
- **GIVEN** 用户使用键盘或屏幕阅读器访问主题控件
- **WHEN** 控件获得焦点或被触发
- **THEN** 控件提供动态描述当前主题和切换动作的 `aria-label`
- **AND** `type` 为 `button`
- **AND** focus-visible 状态具有清晰焦点环

### Requirement: 主题风格色板预览使用固定主题色
- **GIVEN** 外观选择器已打开
- **WHEN** 主题风格色板渲染
- **THEN** 酒红色板预览使用固定渐变 `linear-gradient(135deg, #C94A44 0 48%, #FFFBF8 48% 100%)`
- **AND** 素雅色板预览使用固定渐变 `linear-gradient(135deg, #C89060 0 48%, #FFFDF9 48% 100%)`
- **AND** 两张色板预览不读取当前页面 `var(--primary-color)` 或 `var(--background-color)`

### Requirement: 移动端外观设置在一级菜单内展开
- **GIVEN** 用户在视口宽度小于 768px 的页面打开移动菜单
- **WHEN** 用户触发「外观设置」
- **THEN** 主题风格与显示模式选项直接在当前移动菜单内展开
- **AND** 不打开独立 Bottom Sheet、遮罩或第二层弹窗
- **AND** 「外观设置」按钮通过 `aria-expanded` 和 `aria-controls` 描述折叠关系
- **WHEN** 用户选择主题风格或显示模式
- **THEN** 主题即时生效且移动菜单保持打开，便于连续比较
- **WHEN** 用户点击汉堡关闭按钮、导航项或按 Escape
- **THEN** 整个移动菜单关闭并将外观展开状态重置为收起

### Requirement: 桌面端外观入口与导航风格统一
- **GIVEN** 用户在视口宽度不小于 768px 的页面访问 Header
- **WHEN** 外观入口渲染
- **THEN** 入口按钮使用导航同款的轻量尺寸、圆角和交互节奏
- **AND** 静态使用淡主题色底和主题色图标作轻强调
- **AND** 不使用厚重边框、内阴影、胶囊圆角或上浮动效

### Requirement: 外观选项控件共享
- **GIVEN** 桌面浮层和移动菜单均需渲染主题色板和显示模式选项
- **WHEN** 任一容器渲染外观选项
- **THEN** 使用同一个共享 `AppearanceOptions` 组件
- **AND** 两组选项的静态数据、文案、`aria-pressed` 行为和色板固定色值由该组件统一管理
- **AND** 该组件不管理容器的打开关闭状态

## ADDED: Header 桌面主导航

### Requirement: 桌面主导航使用渐隐装饰下划线
- **GIVEN** 用户在视口宽度不小于 768px 的页面访问 Header
- **WHEN** 指针悬停在“博客 / 关于 / 知识库”任一导航项，或该导航项获得 `focus-visible`
- **THEN** 导航文字下方显示 1px 高、两端透明且中段使用主题色的渐隐装饰线
- **AND** 导航项不显示悬停胶囊背景
- **AND** 导航项不产生上浮、滑入、缩放或其他几何位移动效

### Requirement: 桌面主导航保持可访问与稳定布局
- **GIVEN** 用户使用键盘、指针或屏幕阅读器访问桌面主导航
- **WHEN** 导航项处于默认、悬停、聚焦或点击状态
- **THEN** 链接文案、目标地址、语义和点击区域保持不变
- **AND** `focus-visible` 状态保留清晰的焦点轮廓
- **AND** 下划线不会引起 Header 或相邻导航项的布局偏移

### Requirement: 移动菜单不采用桌面下划线方案
- **GIVEN** 用户在视口宽度小于 768px 的页面打开移动菜单
- **WHEN** 移动导航项渲染或被操作
- **THEN** 移动导航项保持现有整行触摸反馈
- **AND** 本次桌面渐隐装饰下划线规则不改变移动菜单样式
