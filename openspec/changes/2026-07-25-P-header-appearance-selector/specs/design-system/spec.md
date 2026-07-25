# Spec: Header 外观选择器

## ADDED

### Requirement: 桌面端编辑部调色台入口
- **GIVEN** 用户在视口宽度不小于 768px 的页面访问 Header
- **WHEN** Header 渲染
- **THEN** 显示带半明半暗外观图标、“外观”文字和展开提示的轻量胶囊按钮
- **AND** 按钮文案和宽度不随当前主题组合变化
- **AND** 按钮通过 `aria-expanded`、`aria-controls` 和可访问名称表达展开状态及当前外观组合
- **AND** hover、pressed、focus-visible 状态清晰且不造成布局位移

### Requirement: 桌面端外观浮层
- **GIVEN** 桌面端外观入口处于关闭状态
- **WHEN** 用户点击入口或通过键盘触发
- **THEN** 在入口下方右对齐打开纸张风外观浮层
- **AND** 浮层包含“主题风格”和“显示模式”两个可访问分组
- **AND** 点击外部或按 `Escape` 关闭浮层并将焦点归还入口

### Requirement: 主题风格色板选择
- **GIVEN** 外观选择器已打开
- **WHEN** 主题风格选项渲染
- **THEN** 用户可以通过两张色板选择 `wine`（酒红）或 `plain`（素雅）
- **AND** 色板同时展示主题主色与背景色预览
- **AND** 选中状态使用 `aria-pressed` 及非颜色视觉标记表达
- **AND** 点击后立即更新 `data-theme-family` 并保持选择器打开

### Requirement: 三态显示模式选择
- **GIVEN** 外观选择器已打开
- **WHEN** 显示模式选项渲染
- **THEN** 用户可以选择 `system`（跟随系统）、`light`（浅色）或 `dark`（深色）
- **AND** 点击后立即更新解析后的 `data-color-scheme` 并保持选择器打开
- **AND** 选中状态使用 `aria-pressed` 及非颜色视觉标记表达

### Requirement: 移动端外观 Bottom Sheet
- **GIVEN** 用户在视口宽度小于 768px 的页面打开移动菜单
- **WHEN** 移动菜单渲染
- **THEN** 显示“外观设置”整行入口及当前主题组合副文案
- **WHEN** 用户触发“外观设置”
- **THEN** 移动菜单关闭，并从底部打开包含同一套主题风格和显示模式选项的 Bottom Sheet
- **AND** Sheet 提供遮罩、标题、关闭按钮、拖拽指示条和不超过 `80dvh` 的内部滚动区域
- **AND** 点击遮罩、关闭按钮、向下关闭手势或按 `Escape` 可关闭 Sheet 并将焦点归还入口

### Requirement: 外观选择器触控与减少动效
- **GIVEN** 用户使用触摸设备或启用了减少动态效果
- **WHEN** 外观选择器渲染或切换状态
- **THEN** 所有可操作目标不小于 44×44px
- **AND** 常规动效时长为 180–220ms，不改变布局尺寸
- **AND** `prefers-reduced-motion: reduce` 时移除滑入、位移和回弹动效

### Requirement: 外观偏好独立持久化
- **GIVEN** 用户选择主题风格和显示模式
- **WHEN** 选择发生变化
- **THEN** 主题风格持久化到 `wuh.site.theme`
- **AND** 显示模式持久化到 `wuh.site.color-scheme-mode`
- **AND** localStorage 不可用时当前会话仍可正常切换
- **AND** 页面刷新后的首次可见帧使用已持久化的有效选择

### Requirement: 系统显示模式解析
- **GIVEN** 显示模式为 `system`
- **WHEN** 页面初始化或系统 `prefers-color-scheme` 发生变化
- **THEN** `data-color-scheme` 解析为系统当前的 `light` 或 `dark`
- **GIVEN** 显示模式为手动 `light` 或 `dark`
- **WHEN** 系统 `prefers-color-scheme` 发生变化
- **THEN** 用户手动选择保持不变

---

## MODIFIED

### Requirement: 双维度主题模型
- **GIVEN** 主题系统支持 `ThemeFamily` 和 `ColorSchemeMode` 两个正交偏好维度
- **WHEN** 应用外观设置
- **THEN** `data-theme-family` 取值为 `wine` 或 `plain`
- **AND** `ColorSchemeMode` 取值为 `system | light | dark`
- **AND** `data-color-scheme` 始终解析为实际生效的 `light` 或 `dark`
- **AND** 主题家族存储于 `wuh.site.theme`
- **AND** 显示模式存储于 `wuh.site.color-scheme-mode`

### Requirement: 首屏主题无闪动
- **GIVEN** 用户首次访问页面或刷新页面
- **WHEN** 浏览器解析 HTML
- **THEN** `<head>` 中的同步脚本在首次渲染前读取并校验主题家族与显示模式
- **AND** `system` 显示模式根据当前 `prefers-color-scheme` 解析实际浅色/深色
- **AND** 同步脚本在恢复过渡前设置 `data-theme-family` 和 `data-color-scheme`
- **AND** 页面不出现错误主题到目标主题的可见闪动

### Requirement: 主题控件可访问
- **GIVEN** 用户使用键盘或屏幕阅读器访问外观选择器
- **WHEN** 入口、浮层、Sheet 或选项获得焦点或被触发
- **THEN** 所有交互元素使用原生 button 语义并具有可见 focus-visible 状态
- **AND** 展开容器具有明确名称、关联关系和关闭方式
- **AND** 每个选项通过可见文案及 `aria-pressed` 表达当前选择
- **AND** 装饰性图标对辅助技术隐藏
- **AND** 关闭后焦点返回对应入口

---

## REMOVED

### Requirement: 主题切换行为保持不变
- 移除“点击 Header 控件即在 `wine` 与 `plain` 之间循环切换”的要求；外观选择器改为显式选择主题家族和显示模式。
- 移除“移动端点击主题操作后立即关闭全部交互界面”的要求；移动端改为关闭导航菜单并打开 Bottom Sheet，选择后 Sheet 保持打开以支持即时组合预览。
