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
- **GIVEN** `<head>` 脚本执行完毕
- **WHEN** 页面首次渲染
- **THEN** `<html>` 元素带有 `data-no-transition` 属性
- **AND** 所有元素的 `transition` 被禁用，防止颜色从默认值过渡到目标值产生反向闪动
- **AND** React hydration 后 `ThemeModeProvider` 移除 `data-no-transition`

### Requirement: 全局主题色过渡动画
- **GIVEN** 系统或用户切换亮暗主题
- **WHEN** `data-color-scheme` 或 `data-theme-family` 属性值变化
- **THEN** 所有元素的 background-color、color、border-color、box-shadow 以 0.3s ease 平滑过渡
- **AND** 过渡覆盖所有元素及其伪元素
