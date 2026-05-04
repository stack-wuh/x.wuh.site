# Design System

## MODIFIED: 文青纸张风设计令牌

### Requirement: 暖纸色系色板
- **GIVEN** 设计令牌生成器 `generator-color.ts`
- **WHEN** 应用构建
- **THEN** primary 使用暖赭色系 (#C89060 + 9 级色阶)
- **AND** normal 使用深棕墨迹色系 (#2A2218 文本 / #9B8D78 辅助)
- **AND** background 使用象牙纸底色系 (#FFFDF9 卡片 / #F2EDE4 页面)
- **AND** 每个色系包含 light 和 dark 两套

### Requirement: 4 分支 CSS 变量
- **GIVEN** `cssVariableProvider.tsx` 全局样式
- **WHEN** 浏览器加载页面
- **THEN** `:root` 注入基础 (money 模式) light 变量
- **AND** `:root[data-theme='plain']` 注入文青纸风格 light 覆盖
- **AND** `@media (prefers-color-scheme: dark) :root` 注入 dark 变量
- **AND** `@media (prefers-color-scheme: dark) :root[data-theme='plain']` 注入 plain dark 覆盖

### Requirement: CSS 变量命名规范
- **GIVEN** 组件使用 CSS 变量
- **THEN** 颜色: `--primary-color`, `--primary-{100-900}`, `--normal-{100-900}`, `--background-{100-900}`
- **AND** 语义: `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-color`
- **AND** 排版: `--font-serif`, `--font-size-{scale}`, `--space-{scale}`
- **AND** 视觉: `--elevation-{soft|card|card-hover}`, `--radius-card`, `--page-bg`

## MODIFIED: 首页组件

### Requirement: HomeView 重设计
- **GIVEN** 用户访问首页 `/`
- **WHEN** 页面渲染
- **THEN** 展示: 小 Hero (头像+引言) → 格言区 → CTA 按钮组 → 社交链接 → 博客时间线 → 项目列表 → 页脚
- **AND** 装饰分隔线 (OrnamentDivider) 划分各 section
- **AND** 博客列表以单列时间线展示代替卡片网格

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
