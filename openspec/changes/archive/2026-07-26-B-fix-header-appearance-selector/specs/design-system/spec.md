# Spec: Header 外观选择器 Bug 修复

## MODIFIED

### Requirement: 主题风格色板预览使用固定主题色

- **GIVEN** 外观选择器已打开（桌面浮层或移动 Sheet）
- **WHEN** 主题风格色板渲染
- **THEN** 酒红色板预览使用固定渐变 `linear-gradient(135deg, #C94A44 0 48%, #FFFBF8 48% 100%)`
- **AND** 素雅色板预览使用固定渐变 `linear-gradient(135deg, #C89060 0 48%, #FFFDF9 48% 100%)`
- **AND** 两张色板预览不读取当前页面 `var(--primary-color)` 或 `var(--background-color)`
- **AND** 两张色板在浅色和深色模式下均显示各自固定主题色，不随当前已生效主题变化

### Requirement: 移动端外观设置在一级菜单内展开

- **GIVEN** 用户在视口宽度小于 768px 的页面打开移动菜单
- **WHEN** 用户触发「外观设置」
- **THEN** 主题风格与显示模式选项直接在当前移动菜单内展开
- **AND** 不打开独立 Bottom Sheet、遮罩或第二层弹窗
- **AND** 「外观设置」按钮通过 `aria-expanded` 和 `aria-controls` 描述折叠关系
- **WHEN** 用户选择主题风格或显示模式
- **THEN** 主题即时生效且移动菜单保持打开，便于连续比较
- **WHEN** 用户再次触发「外观设置」
- **THEN** 外观选项区域收起，导航菜单保持打开
- **WHEN** 用户点击汉堡关闭按钮、导航项或按 Escape
- **THEN** 整个移动菜单关闭并将外观展开状态重置为收起

### Requirement: 桌面端外观入口与导航风格统一

- **GIVEN** 用户在视口宽度不小于 768px 的页面访问 Header
- **WHEN** 外观入口渲染
- **THEN** 入口按钮与博客/关于导航链接共享相同的 padding（10px 12px）、圆角（非胶囊）、透明背景和文字颜色
- **AND** 静态使用淡主题色底（`color-mix(in oklab, var(--primary-color) 8%, transparent)`）和主题色图标作轻强调
- **AND** 不使用 999px 胶囊圆角、混合主题色边框、内阴影或显式 `translateY` 上浮动效
- **AND** 打开态通过背景加深、文字/图标颜色变化和箭头旋转表达
- **AND** hover、focus-visible 状态清晰且不造成布局位移

### Requirement: 外观选项控件共享

- **GIVEN** 桌面浮层和移动 Sheet 均需渲染主题色板和显示模式选项
- **WHEN** 任一容器渲染外观选项
- **THEN** 使用同一个共享 `AppearanceOptions` 组件
- **AND** 该组件接收 `themeFamily`、`colorSchemeMode`、`onThemeFamilyChange`、`onColorSchemeModeChange` 作为 props
- **AND** 两组选项的静态数据、文案、`aria-pressed` 行为和色板固定色值由该组件统一管理
- **AND** 该组件不管理任何弹层/菜单打开关闭状态
