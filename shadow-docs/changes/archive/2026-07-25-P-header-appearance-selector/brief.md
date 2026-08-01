# Header 外观选择器样式与交互优化

> 原始变更名：`2026-07-25-P-header-appearance-selector`

## 元数据
- 日期：2026-07-25
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
当前 Header 的主题入口是一个“调色盘图标 + 当前主题名称 + 下拉提示”的胶囊按钮，但点击后直接在 `wine`（酒红）与 `plain`（素雅）之间循环，并不会展开选择菜单。与此同时，页面的浅色/深色模式只能跟随系统，用户无法手动选择。按钮的视觉语义、下拉暗示与实际行为不一致，也不足以承载站点已有的“主题家族 + 显示模式”双维度主题能力。

本次属于现有 Header 与主题系统的 **chore 优化**：将主题入口升级为与博客编辑气质一致的“编辑部调色台”外观选择器。桌面端使用轻量浮层，移动端使用 Bottom Sheet，让用户分别选择主题风格和显示模式，并即时预览组合效果；不新增业务能力、后端接口或主题家族。

## 引用规范
- `specs/design-system/spec.md`

## 决策
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

## 任务
### Phase 1: 失败测试与状态协议
- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 将旧的一键主题循环契约更新为 `themeFamily`、`colorSchemeMode`、显式 setter 与两个持久化 key 的契约。
- [ ] 增加 `system` 跟随媒体查询、手动模式不被系统变化覆盖，以及非法存储值回退的断言。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 必须先因实现缺失而失败。
- [ ] **文件:** `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx`
- [ ] 增加 `ColorSchemeMode`、解析函数、显式 setter、resolved scheme 和条件式系统媒体查询同步。
- [ ] 保留 `wuh.site.theme` 并新增 `wuh.site.color-scheme-mode`，确保 localStorage 异常不阻断当前会话。
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** Task 1 中 Provider 状态协议相关测试通过。
- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] 在首屏渲染前恢复主题家族与显示模式，并在 `system` 下解析系统实际模式。
- [ ] 保持 `data-no-transition`、强制重排和属性写入顺序，避免首屏闪动。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 刷新酒红/素雅与 system/light/dark 组合时，首次可见帧与持久化选择一致。
### Phase 2: 桌面端编辑部调色台
- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 断言稳定的“外观”入口、展开语义、两组选择项、选中状态语义和 Escape/外部关闭契约。
- [ ] 删除只服务于旧“当前主题名称 + 一键循环”的断言。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 因新桌面结构尚未实现而失败。
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`
- [ ] 将一键主题按钮替换为“外观”触发器、主题色板和显示模式分段控件。
- [ ] 实现即时生效、保持打开、外部点击、Escape 关闭和焦点归还。
- [ ] 使用静态选项数据复用主题值与文案；避免新增不必要的通用抽象。
- [ ] **预计耗时:** 90 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** Task 4 测试通过；键盘可完整操作浮层。
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 使用现有主题变量实现纸张背景、色板、细边框、酒红强调、hover/pressed/focus-visible 状态。
- [ ] 保持触发器稳定宽度，浮层右对齐且不遮挡视口；所有状态不造成布局跳动。
- [ ] 加入 180–220ms 动效和 `prefers-reduced-motion` 降级。
- [ ] **预计耗时:** 75 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 在 768px、1024px、1440px 以及酒红/素雅的浅色/深色组合中检查视觉和对比度。
### Phase 3: 移动端 Bottom Sheet
- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 断言移动菜单入口、当前组合副文案、遮罩、Sheet 标题、关闭控件与两组复用选项。
- [ ] 断言最小触摸目标、减少动效、内部滚动和安全区样式契约。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 相关测试因新移动结构未实现而失败。
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`
- [ ] 将移动主题行改为“外观设置”入口，打开时关闭导航菜单并展示 Sheet。
- [ ] 实现遮罩、关闭按钮、Escape、向下关闭手势、焦点归还和页面滚动锁。
- [ ] 选项点击立即生效且 Sheet 保持打开；跨越响应式断点时清理状态。
- [ ] **预计耗时:** 105 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 在触摸、键盘和屏幕阅读器路径下验证打开、选择和关闭顺序。
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 实现遮罩、底部滑入、顶部拖拽指示条、`80dvh` 限高、内部滚动和安全区内边距。
- [ ] 保证 320px 宽度下没有横向滚动，所有操作目标不小于 44×44px。
- [ ] `prefers-reduced-motion` 下移除滑入、位移和回弹。
- [ ] **预计耗时:** 75 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 320px、375px、768px 视口及横屏小高度下结构完整、关闭操作可达。
### Phase 4: 图标与完整验收
- [ ] **文件:** `packages/components/icons/index.tsx`
- [ ] 仅在现有导出无法满足外观入口或 Sheet 关闭按钮时，从 Lucide 补充统一 outline 图标。
- [ ] 不新增图标库，不修改无关旧图标。
- [ ] **预计耗时:** 20 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 图标继承 `currentColor`，默认线宽与 icon-system 一致。
- [ ] **文件:** 本变更涉及的全部文件
- [ ] 运行 Header 相关测试、前端 lint、TypeScript 类型检查和构建。
- [ ] 在浏览器验证即时预览、刷新持久化、系统模式变化、手动模式稳定、键盘焦点、移动滚动锁和减少动效。
- [ ] 确认未更改 Header 导航结构、主题调色板或通用 Button API。
- [ ] **预计耗时:** 90 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 下列验收项全部通过。
- [ ] 桌面 Header 显示稳定的“外观”胶囊，打开右对齐的编辑部调色台浮层。
- [ ] 移动菜单显示“外观设置”入口，并打开可访问的 Bottom Sheet。
- [ ] 酒红/素雅与跟随系统/浅色/深色可独立选择、立即生效且选择器保持打开。
- [ ] 选择可跨刷新恢复；旧用户无新 key 时继续跟随系统。
- [ ] system 模式响应系统变化，light/dark 手动模式不被系统变化覆盖。
- [ ] 点击外部/遮罩、关闭按钮和 Escape 均按设计关闭，并正确归还焦点。
- [ ] 320px、768px、1024px、1440px 无横向滚动或控件遮挡。
- [ ] 键盘、屏幕阅读器、44px 触摸目标、对比度和 `prefers-reduced-motion` 要求通过。
- [ ] `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 通过。
- [ ] `pnpm exec tsc --noEmit` 零错误。
- [ ] `pnpm build:next` 成功。

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-25-P-header-appearance-selector
date: 2026-07-25
type: P
status: proposed
category: chore
issue: https://github.com/stack-wuh/x.wuh.site/issues/262
```

### `design.md`
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

### `proposal.md`
# Header 外观选择器样式与交互优化

## 背景

当前 Header 的主题入口是一个“调色盘图标 + 当前主题名称 + 下拉提示”的胶囊按钮，但点击后直接在 `wine`（酒红）与 `plain`（素雅）之间循环，并不会展开选择菜单。与此同时，页面的浅色/深色模式只能跟随系统，用户无法手动选择。按钮的视觉语义、下拉暗示与实际行为不一致，也不足以承载站点已有的“主题家族 + 显示模式”双维度主题能力。

本次属于现有 Header 与主题系统的 **chore 优化**：将主题入口升级为与博客编辑气质一致的“编辑部调色台”外观选择器。桌面端使用轻量浮层，移动端使用 Bottom Sheet，让用户分别选择主题风格和显示模式，并即时预览组合效果；不新增业务能力、后端接口或主题家族。

## 目标

- 将桌面 Header 入口设计为稳定宽度的“半明半暗图标 + 外观 + 下拉提示”胶囊按钮，并与 Header 的半透明纸张感、细边框和酒红强调色保持一致。
- 在桌面浮层中提供“酒红 / 素雅”主题色板，以及“跟随系统 / 浅色 / 深色”显示模式选择。
- 在移动菜单中提供“外观设置”入口，并通过 Bottom Sheet 呈现同一套选择能力。
- 选项点击后立即生效，选择器保持打开，允许用户连续调整并预览主题组合。
- 分别持久化主题家族和显示模式；选择“跟随系统”时继续响应系统配色变化。
- 满足键盘操作、焦点管理、屏幕阅读器语义、触摸目标与减少动效要求。

## 非目标（明确不做）

- 不调整 Header 的站点标识、导航信息架构、移动菜单导航项或 768px 响应式断点。
- 不新增 `wine`、`plain` 之外的主题家族，也不重做全站调色板和 CSS 变量架构。
- 不修改通用 Button 的公共 API 或全局默认样式。
- 不新增第三方弹层、动画或状态管理依赖。
- 不将外观设置同步到服务端或用户账户。
- 不在本次变更中扩展对比度、字体、字号等其他个性化设置。

## 影响范围

- `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx` — 将主题家族与显示模式作为独立状态暴露，处理持久化和系统模式监听。
- `packages/wuh.site.next/app/layout.tsx` — 首屏同步脚本恢复主题家族和显示模式，避免水合前闪动。
- `packages/wuh.site.next/app/components/SiteHeader/index.tsx` — 将一键循环按钮替换为桌面外观浮层入口与移动 Bottom Sheet 入口。
- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 增加“编辑部调色台”视觉、浮层、遮罩、Bottom Sheet、响应式和交互状态样式。
- `packages/components/icons/index.tsx` — 仅在现有导出不足时补充同一 Lucide outline 图标集中的外观与关闭图标。
- `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` — 以失败优先测试覆盖双维度状态、桌面/移动结构、持久化和无障碍契约。
- 影响包：`@wuh.site/next`；如需补充图标导出，则同时影响 `@wuh.site/components/icons`。

### `specs/design-system/spec.md`
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

### `tasks.md`
# 任务清单

> 所有任务的实际耗时在实施阶段完成后填写；未实施前记为 `—`。任务按顺序执行，除明确标注外不并行。

## Phase 1: 失败测试与状态协议

### Task 1: 为双维度外观状态编写失败测试

- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 将旧的一键主题循环契约更新为 `themeFamily`、`colorSchemeMode`、显式 setter 与两个持久化 key 的契约。
- [ ] 增加 `system` 跟随媒体查询、手动模式不被系统变化覆盖，以及非法存储值回退的断言。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 必须先因实现缺失而失败。

### Task 2: 实现 ThemeModeProvider 双维度状态

- [ ] **文件:** `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx`
- [ ] 增加 `ColorSchemeMode`、解析函数、显式 setter、resolved scheme 和条件式系统媒体查询同步。
- [ ] 保留 `wuh.site.theme` 并新增 `wuh.site.color-scheme-mode`，确保 localStorage 异常不阻断当前会话。
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** Task 1 中 Provider 状态协议相关测试通过。

### Task 3: 对齐首屏同步脚本

- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] 在首屏渲染前恢复主题家族与显示模式，并在 `system` 下解析系统实际模式。
- [ ] 保持 `data-no-transition`、强制重排和属性写入顺序，避免首屏闪动。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 刷新酒红/素雅与 system/light/dark 组合时，首次可见帧与持久化选择一致。

## Phase 2: 桌面端编辑部调色台

### Task 4: 为桌面外观入口和浮层编写失败测试

- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 断言稳定的“外观”入口、展开语义、两组选择项、选中状态语义和 Escape/外部关闭契约。
- [ ] 删除只服务于旧“当前主题名称 + 一键循环”的断言。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 因新桌面结构尚未实现而失败。

### Task 5: 实现桌面外观浮层结构与交互

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`
- [ ] 将一键主题按钮替换为“外观”触发器、主题色板和显示模式分段控件。
- [ ] 实现即时生效、保持打开、外部点击、Escape 关闭和焦点归还。
- [ ] 使用静态选项数据复用主题值与文案；避免新增不必要的通用抽象。
- [ ] **预计耗时:** 90 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** Task 4 测试通过；键盘可完整操作浮层。

### Task 6: 实现编辑部调色台视觉

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 使用现有主题变量实现纸张背景、色板、细边框、酒红强调、hover/pressed/focus-visible 状态。
- [ ] 保持触发器稳定宽度，浮层右对齐且不遮挡视口；所有状态不造成布局跳动。
- [ ] 加入 180–220ms 动效和 `prefers-reduced-motion` 降级。
- [ ] **预计耗时:** 75 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 在 768px、1024px、1440px 以及酒红/素雅的浅色/深色组合中检查视觉和对比度。

## Phase 3: 移动端 Bottom Sheet

### Task 7: 为移动外观入口与 Bottom Sheet 编写失败测试

- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 断言移动菜单入口、当前组合副文案、遮罩、Sheet 标题、关闭控件与两组复用选项。
- [ ] 断言最小触摸目标、减少动效、内部滚动和安全区样式契约。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 相关测试因新移动结构未实现而失败。

### Task 8: 实现移动 Bottom Sheet 行为

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`
- [ ] 将移动主题行改为“外观设置”入口，打开时关闭导航菜单并展示 Sheet。
- [ ] 实现遮罩、关闭按钮、Escape、向下关闭手势、焦点归还和页面滚动锁。
- [ ] 选项点击立即生效且 Sheet 保持打开；跨越响应式断点时清理状态。
- [ ] **预计耗时:** 105 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 在触摸、键盘和屏幕阅读器路径下验证打开、选择和关闭顺序。

### Task 9: 实现移动 Sheet 视觉与响应式

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 实现遮罩、底部滑入、顶部拖拽指示条、`80dvh` 限高、内部滚动和安全区内边距。
- [ ] 保证 320px 宽度下没有横向滚动，所有操作目标不小于 44×44px。
- [ ] `prefers-reduced-motion` 下移除滑入、位移和回弹。
- [ ] **预计耗时:** 75 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 320px、375px、768px 视口及横屏小高度下结构完整、关闭操作可达。

## Phase 4: 图标与完整验收

### Task 10: 补充必要图标导出

- [ ] **文件:** `packages/components/icons/index.tsx`
- [ ] 仅在现有导出无法满足外观入口或 Sheet 关闭按钮时，从 Lucide 补充统一 outline 图标。
- [ ] 不新增图标库，不修改无关旧图标。
- [ ] **预计耗时:** 20 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 图标继承 `currentColor`，默认线宽与 icon-system 一致。

### Task 11: 运行完整验证并修复回归

- [ ] **文件:** 本变更涉及的全部文件
- [ ] 运行 Header 相关测试、前端 lint、TypeScript 类型检查和构建。
- [ ] 在浏览器验证即时预览、刷新持久化、系统模式变化、手动模式稳定、键盘焦点、移动滚动锁和减少动效。
- [ ] 确认未更改 Header 导航结构、主题调色板或通用 Button API。
- [ ] **预计耗时:** 90 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** 下列验收项全部通过。

## 验收

- [ ] 桌面 Header 显示稳定的“外观”胶囊，打开右对齐的编辑部调色台浮层。
- [ ] 移动菜单显示“外观设置”入口，并打开可访问的 Bottom Sheet。
- [ ] 酒红/素雅与跟随系统/浅色/深色可独立选择、立即生效且选择器保持打开。
- [ ] 选择可跨刷新恢复；旧用户无新 key 时继续跟随系统。
- [ ] system 模式响应系统变化，light/dark 手动模式不被系统变化覆盖。
- [ ] 点击外部/遮罩、关闭按钮和 Escape 均按设计关闭，并正确归还焦点。
- [ ] 320px、768px、1024px、1440px 无横向滚动或控件遮挡。
- [ ] 键盘、屏幕阅读器、44px 触摸目标、对比度和 `prefers-reduced-motion` 要求通过。
- [ ] `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 通过。
- [ ] `pnpm exec tsc --noEmit` 零错误。
- [ ] `pnpm build:next` 成功。
