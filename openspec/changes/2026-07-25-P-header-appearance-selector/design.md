# 设计文档

## 架构

本次在现有双维度 CSS 变量架构之上补齐可控状态和选择界面，不改变 `data-theme-family` 与 `data-color-scheme` 的渲染协议。

```text
RootLayout 首屏同步脚本
  ├─ 读取 wuh.site.theme                  -> ThemeFamily
  ├─ 读取 wuh.site.color-scheme-mode      -> ColorSchemeMode
  └─ system 时读取 prefers-color-scheme   -> resolvedColorScheme
                    │
                    ▼
ThemeModeProvider
  ├─ themeFamily: wine | plain
  ├─ colorSchemeMode: system | light | dark
  ├─ resolvedColorScheme: light | dark
  ├─ setThemeFamily(family)
  └─ setColorSchemeMode(mode)
                    │
                    ▼
SiteHeader
  ├─ AppearanceTrigger（稳定文案“外观”）
  ├─ DesktopAppearancePopover（>= 768px）
  │    ├─ ThemeFamilySwatches
  │    └─ ColorSchemeSegmentedControl
  └─ MobileAppearanceSheet（< 768px）
       ├─ 遮罩、标题、关闭按钮、拖拽指示条
       ├─ ThemeFamilySwatches
       └─ ColorSchemeSegmentedControl
```

桌面端浮层锚定在 Header 外观按钮下方；移动端从移动菜单中的“外观设置”入口打开 Bottom Sheet。两端复用相同的选项数据和选择行为，但使用适合各自空间的容器。点击任一选项后立即更新页面，容器保持打开。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 视觉方向 | “编辑部调色台” | 使用纸张背景、细边框、酒红强调和主题色板预览，延续个人博客的 editorial 气质，而不是通用系统设置面板 |
| 桌面容器 | Header 内锚定 popover | 五个选项不需要 Dialog；浮层轻量、接近触发点且不挤占导航空间 |
| 移动容器 | 自包含 Bottom Sheet | 比窄屏 popover 更稳定，触控面积充足，并与现有联系弹窗的移动端底部弹出语言一致 |
| 状态模型 | `ThemeFamily` 与 `ColorSchemeMode` 正交 | 与现有 CSS 的双维度路由一致，避免组合枚举和重复样式 |
| 显示模式 | `system | light | dark` | 保留现有自动跟随行为，同时提供明确的手动浅色和深色选择 |
| 生效策略 | 立即生效且选择器保持打开 | 用户可连续调整两个维度并直接比较组合，无需临时草稿或“应用”按钮 |
| 持久化 | 保留 `wuh.site.theme`，新增 `wuh.site.color-scheme-mode` | 兼容已有主题家族数据，独立表达显示模式，迁移成本最低 |
| 图标 | `@wuh.site/components/icons` 中的 Lucide outline 图标 | 遵循现有 icon-system 的 `currentColor`、统一线宽和尺寸规范 |
| 动效 | 180–220ms ease-out；减少动效时关闭位移和滑入 | 反馈明确但不过度抢夺阅读内容注意力 |
| 依赖 | 原生 React、DOM 与 styled-components | 当前范围无需新增弹层、动画或状态管理依赖 |

## 数据模型（如涉及）

```ts
type ThemeFamily = 'wine' | 'plain'
type ColorScheme = 'light' | 'dark'
type ColorSchemeMode = 'system' | ColorScheme

type ThemeContextValue = {
  themeFamily: ThemeFamily
  colorSchemeMode: ColorSchemeMode
  resolvedColorScheme: ColorScheme
  setThemeFamily: (family: ThemeFamily) => void
  setColorSchemeMode: (mode: ColorSchemeMode) => void
}
```

持久化约定：

| 键 | 值 | 默认值 | 说明 |
|----|----|--------|------|
| `wuh.site.theme` | `wine | plain` | `wine` | 保留现有 key，避免破坏用户已有主题选择 |
| `wuh.site.color-scheme-mode` | `system | light | dark` | `system` | 新增显示模式偏好 |

解析存储值时必须进行白名单校验。localStorage 不可用或值非法时回退默认值，不阻断渲染。

## API 设计（如涉及）

无网络 API 或后端数据模型变更。所有状态保存在浏览器本地，并通过 HTML `data-*` 属性驱动现有 CSS 变量路由。

## 组件/模块设计

### ThemeModeProvider

- 以 `themeFamily`、`colorSchemeMode` 和 `resolvedColorScheme` 替代当前只暴露 `theme` 与 `toggle()` 的接口。
- `setThemeFamily()` 更新 `data-theme-family` 并写入 `wuh.site.theme`。
- `setColorSchemeMode()` 写入 `wuh.site.color-scheme-mode`：
  - `light` / `dark` 直接更新 `data-color-scheme`。
  - `system` 读取 `matchMedia('(prefers-color-scheme: dark)')` 的当前值。
- 始终保留系统媒体查询监听，但只有 `colorSchemeMode === 'system'` 时将系统变化应用到页面。
- 不保留一键循环作为主要 Header 交互；如无其他调用方，实施时仅删除由本次接口变化直接失效的 `toggle()`。

### RootLayout 首屏主题脚本

- 在 React 水合前先设置 `data-no-transition`，再读取两个持久化键。
- 主题家族非法或缺失时使用 `wine`。
- 显示模式非法或缺失时使用 `system`；`system` 根据 `prefers-color-scheme` 解析实际浅色/深色。
- 一次性写入 `data-theme-family` 与 `data-color-scheme` 后恢复过渡，保持现有首屏无闪动约束。

### AppearanceTrigger

- 使用原生 `button`，稳定显示半明半暗外观图标、“外观”文字和下拉提示。
- 不显示“酒红 · 自动”等动态组合，避免 Header 宽度随状态变化。
- 设置 `aria-haspopup='dialog'`、`aria-expanded` 和 `aria-controls`，`aria-label` 包含当前完整状态，例如“外观设置，当前酒红、跟随系统”。
- hover 仅轻微提高边框、背景和阴影；active 回落；focus-visible 使用清晰焦点环，不产生布局位移。

### DesktopAppearancePopover

- 位于触发器下方右对齐，使用接近不透明的纸张背景、细边框、柔和阴影和 16–20px 圆角。
- “主题风格”显示酒红和素雅两张色板卡；每张色板同时展示主色与背景色，而非仅以文字区分。
- “显示模式”使用三段选择器，完整可见文案为“跟随系统 / 浅色 / 深色”。
- 选中状态同时使用填充、边框、勾选图标或 `aria-pressed`，不只依赖颜色。
- 点击选项不关闭浮层；点击外部或按 `Escape` 关闭，并将焦点归还触发器。
- 打开后将焦点移入当前选项；Tab 在浮层交互元素内顺序移动，不强制循环焦点。

### MobileAppearanceSheet

- 移动菜单中的整行入口改为“外观设置”，副文案显示当前组合，例如“酒红 · 跟随系统”。
- 点击入口先关闭移动菜单，再打开 Bottom Sheet，避免两个交互层同时暴露。
- Sheet 包含遮罩、顶部拖拽指示条、标题、当前状态说明、关闭按钮及与桌面一致的两组选项。
- 点击遮罩、关闭按钮、按 `Escape` 或明确的向下关闭手势关闭；关闭后焦点返回移动端“外观设置”入口。
- 打开期间锁定页面滚动，内容高度不超过 `80dvh`，超出时内部滚动，并处理 iOS 安全区底部间距。
- 选项点击立即生效且 Sheet 保持打开。

### 选项数据与可访问语义

- 主题家族和显示模式选项定义为模块内静态数据，桌面和移动共用，避免文案和取值漂移。
- 每组使用带可访问名称的分组语义；选项使用原生 `button` + `aria-pressed`，不模拟原生 radio 键盘规则。
- 所有触摸选项最小尺寸为 44×44px；装饰图标 `aria-hidden='true'`。
- 状态变化依靠按钮自身的 `aria-pressed` 表达，不增加会重复播报的全局 live region。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | 显示“外观”胶囊和其锚定浮层；隐藏移动菜单按钮和 Bottom Sheet 入口 |
| < 768px | 隐藏桌面胶囊；移动菜单内显示“外观设置”整行入口；点击后打开 Bottom Sheet |
| <= 380px | Sheet 选项仍保持 44px 触摸目标；色板保持双列，模式段控件允许紧凑字号但不截断关键文案 |
| 横屏小高度 | Sheet 使用 `max-height: 80dvh` 和内部滚动，标题与关闭操作始终可达 |

## 动效与视觉状态

- 胶囊和选项 hover/focus/pressed 仅改变背景、边框、阴影及不超过 1px 的位移，不改变组件尺寸。
- 桌面浮层使用轻微透明度与纵向位移进入；移动 Sheet 使用底部滑入，遮罩同步淡入。
- 动效时长限制在 180–220ms，使用 ease-out；退出不超过进入时长。
- `prefers-reduced-motion: reduce` 时移除 transform、滑入和拖拽回弹，只保留必要的即时显隐或短透明度变化。
- 酒红与素雅、浅色与深色均只通过现有 CSS 变量生成最终颜色，组件样式不硬编码主题结果色；色板预览可引用对应 raw palette 变量。

## 错误与边界处理

- localStorage 读取或写入抛错时，当前会话状态仍正常工作，不显示错误提示。
- 系统媒体查询不可用时，`system` 回退为 `light`。
- 用户在选择器打开时切换主题导致容器颜色变化，容器保持打开且焦点不丢失。
- 视口跨过 768px 时关闭当前不适用的桌面浮层或移动 Sheet，避免隐藏交互层残留滚动锁或焦点状态。
- 组件卸载时清理媒体查询、外部点击、键盘和滚动锁相关监听。

## 测试与验证策略

实施必须遵循失败测试优先：

1. 先更新现有 Header 主题测试，使其针对新 Provider API、持久化 key、外观入口、桌面浮层和移动 Sheet 结构失败。
2. 再实现最小状态模型和界面，使相关测试通过。
3. 使用浏览器分别验证桌面与移动端的打开、选择、即时预览、关闭、焦点归还和刷新持久化。
4. 在系统模式下模拟系统浅色/深色变化；在手动模式下确认系统变化不会覆盖用户选择。
5. 验证 `prefers-reduced-motion`、键盘 Tab/Escape、320px 窄屏以及两套主题家族的浅色/深色组合。

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** `ThemeModeProvider` 的前端 Context API 从单一 `theme/toggle` 扩展为双维度显式 setter；当前已确认 Header 是主要调用方，实施时仍需检索并同步所有调用点。
- **向后兼容:** 保留 `wuh.site.theme` 与 `data-theme-family`；缺少新显示模式 key 的现有用户默认继续跟随系统，体验与当前一致。
- **规范调整:** 现有 design-system 中“点击即在两个主题家族循环”“移动点击后关闭菜单”的要求将被外观选择器需求替代；双维度模型中组合 `Theme` 与单 key 存储的旧描述同步改为两个正交状态与两个 key。
- **性能影响:** 仅增加本地状态、少量 DOM 和事件监听；选择器关闭时不执行持续动画或数据请求。
- **风险:** 首屏脚本与 Provider 对存储值的解析若不一致会产生水合后跳变，必须共享相同白名单语义并通过刷新验证。
