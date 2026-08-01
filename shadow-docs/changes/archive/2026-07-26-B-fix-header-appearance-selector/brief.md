# 修复 Header 外观选择器三项 Bug

> 原始变更名：`2026-07-26-B-fix-header-appearance-selector`

## 元数据
- 日期：2026-07-26
- 类型：B
- 状态：proposed
- Issue：历史记录未提供

## 动机
2026-07-25 上线的 Header 外观选择器（`2026-07-25-P-header-appearance-selector`）引入三个缺陷：

1. **酒红与素雅色板预览颜色相同** — 两张 `SwatchPreview` 的渐变背景都读取当前页面已生效的 `var(--primary-color)` 和 `var(--background-color)`，无论选中哪个选项都显示同一套当前主题色，色板无法区分两个主题家族。
2. **移动端二级主题选择打开后无法关闭一级菜单** — `openMobileAppearance` 调用 `close()` 卸载一级菜单入口，但二级 Sheet 关闭时 `closeMobileAppearance` 试图将焦点归还到 `mobileAppearanceTriggerRef`（已随一级菜单隐藏/卸载），且关闭二级后没有恢复一级菜单显示。用户只能通过页面刷新恢复。
3. **桌面端外观按钮风格不协调** — `AppearanceTrigger` 使用了 999px 胶囊、混合主题色边框、内阴影和显式上浮动效，与 Header 博客/关于导航链接的轻量文字风格不一致。

这三个问题应在「外科式修复 + 抽取共享选项组件」的范围内解决，不重新设计整体架构。

## 引用规范
- `specs/design-system/spec.md`

## 决策
本次在现有 Header 外观选择器基础上做外科式修复，不改变 `ThemeModeProvider`、首屏脚本、CSS 变量路由或持久化 key。

```text
SiteHeader (状态管理层)
├─ 管理 open / appearanceOpen / mobileMenuOpen / mobileAppearanceOpen
├─ 桌面: AppearanceTrigger（导航同款）→ DesktopAppearancePopover
├─ 移动: MobileToggle → MobilePanel（一级菜单）
│         └─ 外观设置入口 → MobileAppearanceOverlay + Sheet（二级）
│             关闭二级 → 恢复一级菜单 + 焦点归还入口
└─ AppearanceOptions（共享选择组件）
     ├─ ThemeSwatches（固定色板预览）
     └─ SchemeOptions（三态显示模式）
```

桌面浮层与移动 Sheet 通过 `AppearanceOptions` 共享选择控件。SiteHeader 继续管理各自容器的打开/关闭状态和焦点策略，不把桌面与移动端不同的弹层行为混在一起。

| 维度 | 选择 | 理由 |
|------|------|------|
| 修复范围 | 外科式修复 + 抽取共享选项组件 | 不改 Provider/首屏脚本/CSS 变量；最小化回归风险 |
| 色板预览 | 固定主题家族色值（hardcoded palette） | 消除对当前页面 `--primary-color` 的依赖，两张色板各自独立 |
| 移动端交互 | 一级菜单内联折叠 | 从架构上移除双层弹窗、遮罩、滚动锁和焦点归还耦合；关闭入口唯一且可靠 |
| 桌面入口 | 导航同款按钮 + 淡主题色强调 | 用户已选择 B 方案；与博客/关于链接保持一致的尺寸、圆角和交互节奏 |
| 共享组件边界 | 仅抽取选项控件，不抽象弹层容器 | 桌面 popover 和移动 Sheet 的焦点/关闭策略差异大，强行统一会增加复杂度 |
| 测试 | 失败测试优先覆盖运行时行为 | 现有测试仅检查源码字符串，无法发现色板同色和移动端焦点归还这类运行时缺陷 |

## 任务
### Phase 1: 失败测试
- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 新增「色板预览使用固定色值」断言：酒红 `SwatchPreview` 引用酒红主色/背景色，素雅引用素雅主色/背景色，两者不读取 `var(--primary-color)`。
- [ ] 新增「移动端二级关闭恢复一级菜单」断言：二级 Sheet 关闭后一级菜单恢复可见；焦点归还到一级菜单内的外观入口按钮。
- [ ] 新增「桌面入口无厚重胶囊」断言：`AppearanceTrigger` 不再使用 999px 胶囊、混合主题色边框、内阴影或显式上浮动效。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 因修复未实施而失败。
### Phase 2: 共享选项组件
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/AppearanceOptions.tsx`（新增）
- [ ] 抽取现有 `THEME_OPTIONS`、`SCHEME_OPTIONS` 静态数据和选择控件渲染逻辑。
- [ ] 酒红 `SwatchPreview` 使用固定渐变 `linear-gradient(135deg, #C94A44 0 48%, #FFFBF8 48% 100%)`。
- [ ] 素雅 `SwatchPreview` 使用固定渐变 `linear-gradient(135deg, #C89060 0 48%, #FFFDF9 48% 100%)`。
- [ ] 统一 `aria-pressed` 行为，接收 `themeFamily`/`colorSchemeMode` 和 onChange 回调。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** Task 1 色板相关测试通过。
### Phase 3: 移动端交互重设计
- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`
- [x] 先更新失败测试，要求移动端使用 `mobileAppearanceExpanded` 折叠状态，并禁止渲染 Overlay、Sheet、滚动锁和下滑关闭逻辑。
- [x] 删除移动端 `mobileAppearanceOpen`、`mobileAppearanceTriggerRef`、触摸手势和二级弹层关闭回调。
- [x] 在 `MobileAppearanceAction` 后直接渲染共享 `AppearanceOptions`，由 `aria-expanded`、`aria-controls` 和稳定 id 建立折叠关系。
- [x] 主题选择后保持菜单打开；再次点击外观按钮仅收起选项。
- [x] 汉堡关闭、导航项点击和 Escape 关闭整个菜单时，将外观展开状态重置为 `false`。
- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [x] 删除 `MobileAppearanceOverlay`、`MobileAppearanceSheet`、`SheetHandle`、`SheetHeader`、`SheetTitle`、`SheetCurrent`、`SheetClose` 样式。
- [x] 新增菜单内折叠内容样式；限制移动菜单最大高度并允许内部纵向滚动。
- [x] **预计耗时:** 60 分钟
- [x] **实际耗时:** 15 分钟
- [x] **验证:** Header 回归测试 21/21 通过；移动菜单打开/展开/选择/收起/整体关闭状态符合规格。
### Phase 4: 桌面入口视觉修复
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 重写 `AppearanceTrigger`：移除 999px 胶囊、混合主题色边框、内阴影和 `translateY` hover。
- [ ] 改为与 `NavLink` 一致的 padding（10px 12px）、圆角（非胶囊）、透明背景、导航文字颜色。
- [ ] 静态使用淡主题色底（`color-mix(in oklab, var(--primary-color) 8%, transparent)`）和主题色图标。
- [ ] 打开态通过背景加深、文字/图标颜色变化和箭头旋转表达。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** Task 1 桌面入口相关测试通过；在 768px、1024px、1440px 以及酒红/素雅的浅色/深色组合中检查视觉一致性。
- [ ] 酒红色板预览显示酒红主色 + 暖纸背景色，素雅色板预览显示棕米主色 + 米白背景色，两者明显不同。
- [ ] 移动端：点击「外观设置」后选项直接在一级菜单内展开，不出现独立 Bottom Sheet 或遮罩。
- [ ] 移动端：主题选择后菜单保持打开；再次点击外观按钮仅收起选项。
- [ ] 移动端：汉堡关闭按钮、导航项或 Escape 关闭整个菜单，并重置外观展开状态。
- [ ] 桌面端外观入口与博客/关于导航链接视觉上属于同一体系（尺寸、圆角、交互节奏一致）。
- [ ] 桌面端外部点击/Escape 关闭浮层并归还焦点。
- [ ] 主题即时生效、刷新持久化、system/light/dark 模式切换不受影响。
- [ ] 320px 窄屏无横向滚动，所有触控目标 ≥ 44px。
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
change: fix-header-appearance-selector
date: 2026-07-26
type: B
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/272
```

### `design.md`
# 设计文档

## 架构

本次在现有 Header 外观选择器基础上做外科式修复，不改变 `ThemeModeProvider`、首屏脚本、CSS 变量路由或持久化 key。

```text
SiteHeader (状态管理层)
├─ 管理 open / appearanceOpen / mobileMenuOpen / mobileAppearanceOpen
├─ 桌面: AppearanceTrigger（导航同款）→ DesktopAppearancePopover
├─ 移动: MobileToggle → MobilePanel（一级菜单）
│         └─ 外观设置入口 → MobileAppearanceOverlay + Sheet（二级）
│             关闭二级 → 恢复一级菜单 + 焦点归还入口
└─ AppearanceOptions（共享选择组件）
     ├─ ThemeSwatches（固定色板预览）
     └─ SchemeOptions（三态显示模式）
```

桌面浮层与移动 Sheet 通过 `AppearanceOptions` 共享选择控件。SiteHeader 继续管理各自容器的打开/关闭状态和焦点策略，不把桌面与移动端不同的弹层行为混在一起。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 修复范围 | 外科式修复 + 抽取共享选项组件 | 不改 Provider/首屏脚本/CSS 变量；最小化回归风险 |
| 色板预览 | 固定主题家族色值（hardcoded palette） | 消除对当前页面 `--primary-color` 的依赖，两张色板各自独立 |
| 移动端交互 | 一级菜单内联折叠 | 从架构上移除双层弹窗、遮罩、滚动锁和焦点归还耦合；关闭入口唯一且可靠 |
| 桌面入口 | 导航同款按钮 + 淡主题色强调 | 用户已选择 B 方案；与博客/关于链接保持一致的尺寸、圆角和交互节奏 |
| 共享组件边界 | 仅抽取选项控件，不抽象弹层容器 | 桌面 popover 和移动 Sheet 的焦点/关闭策略差异大，强行统一会增加复杂度 |
| 测试 | 失败测试优先覆盖运行时行为 | 现有测试仅检查源码字符串，无法发现色板同色和移动端焦点归还这类运行时缺陷 |

## 组件/模块设计

### AppearanceOptions（新增共享组件）

**职责:** 渲染「主题风格」色板组与「显示模式」分段控件组，接收当前值和 onChange 回调。不管理任何弹层/菜单状态。

**Props:**

```ts
interface AppearanceOptionsProps {
  themeFamily: ThemeFamily
  colorSchemeMode: ColorSchemeMode
  onThemeFamilyChange: (family: ThemeFamily) => void
  onColorSchemeModeChange: (mode: ColorSchemeMode) => void
}
```

- 色板预览使用固定色值：
  - 酒红：主色 `#C94A44`、背景 `#FFFBF8`
  - 素雅：主色 `#C89060`、背景 `#FFFDF9`
- 两组选项的 `aria-pressed`、文案和交互行为完全由该组件统一，桌面和移动复用。

### SiteHeader 移动端交互重设计

移动端不再使用「一级菜单 + 二级 Bottom Sheet」。`AppearanceOptions` 直接作为可折叠区域渲染在一级移动菜单内。

```text
移动菜单关闭
  → 点击汉堡按钮
移动菜单打开（导航项 + 外观设置折叠按钮）
  → 点击「外观设置」
外观选项在当前菜单内展开
  → 选择主题风格或显示模式：即时生效，菜单保持打开
  → 再次点击「外观设置」：收起选项
  → 点击汉堡按钮、导航项或 Escape：关闭整个菜单并重置展开状态
```

状态收敛为两个布尔值：

- `open`：整个移动菜单是否打开。
- `mobileAppearanceExpanded`：菜单内外观选项是否展开。

删除移动端独立弹层所需的 `mobileAppearanceOpen`、遮罩、Sheet、`body` 滚动锁、下滑手势、二级 Escape 监听和二级焦点归还逻辑。`MobileAppearanceAction` 使用 `aria-expanded` 与 `aria-controls` 描述折叠关系；展开内容拥有稳定 id，并位于触发按钮之后。

关闭整个移动菜单时必须同时将 `mobileAppearanceExpanded` 重置为 `false`，确保下次打开菜单时回到紧凑导航状态。

**桌面入口样式:**

- 移除 `AppearanceTrigger` 的 999px 胶囊、混合主题色边框、内阴影和显式 `translateY` hover。
- 改为与 `NavLink` 一致的：无边框、透明背景、导航文字颜色、相同 padding 和圆角、hover 微提亮。
- 静态使用淡主题色背景（`color-mix(in oklab, var(--primary-color) 8%, transparent)`）和主题色图标作轻强调。
- 打开态通过背景加深、文字/图标颜色变化和箭头旋转表达。

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 768px | 桌面导航同款外观入口 + 右对齐浮层 |
| < 768px | 一级菜单内「外观设置」折叠按钮；选项直接在当前菜单中展开 |
| <= 380px | 菜单内部允许纵向滚动；色板保持双列，模式段控件使用紧凑字号但不断行 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无。`AppearanceOptions` 为新增组件，SiteHeader 接口不变。
- **向后兼容:** 色板预览值由固定色值替代 CSS 变量引用，视觉效果改变但主题切换行为不变。
- **性能影响:** 仅调整现有 DOM 显隐和样式，无新增持续监听或数据请求。
- **风险:** 内联展开会增加移动菜单高度，需限制菜单最大高度并允许内部纵向滚动；320px 窄屏必须验证无横向溢出。

### `proposal.md`
# 修复 Header 外观选择器三项 Bug

## 背景

2026-07-25 上线的 Header 外观选择器（`2026-07-25-P-header-appearance-selector`）引入三个缺陷：

1. **酒红与素雅色板预览颜色相同** — 两张 `SwatchPreview` 的渐变背景都读取当前页面已生效的 `var(--primary-color)` 和 `var(--background-color)`，无论选中哪个选项都显示同一套当前主题色，色板无法区分两个主题家族。
2. **移动端二级主题选择打开后无法关闭一级菜单** — `openMobileAppearance` 调用 `close()` 卸载一级菜单入口，但二级 Sheet 关闭时 `closeMobileAppearance` 试图将焦点归还到 `mobileAppearanceTriggerRef`（已随一级菜单隐藏/卸载），且关闭二级后没有恢复一级菜单显示。用户只能通过页面刷新恢复。
3. **桌面端外观按钮风格不协调** — `AppearanceTrigger` 使用了 999px 胶囊、混合主题色边框、内阴影和显式上浮动效，与 Header 博客/关于导航链接的轻量文字风格不一致。

这三个问题应在「外科式修复 + 抽取共享选项组件」的范围内解决，不重新设计整体架构。

## 目标

- 酒红与素雅的色板预览分别使用各自主题家族的**固定主色与背景色**，不再读取当前页面 CSS 变量。
- 移动端：一级菜单与二级外观 Sheet 形成可逆的层级状态。打开二级时一级菜单视觉保留入口以便返回；关闭二级后恢复一级菜单显示并将焦点归还外观入口；只有点击一级菜单关闭按钮或导航项时才关闭全部菜单。
- 桌面端外观入口采用导航同款轻量按钮形态（静态淡主题色底 + 主题色图标），移除厚重胶囊视觉。
- 抽取仅负责两组选择控件的共享组件，桌面浮层和移动 Sheet 复用同一数据、文案和 `aria-pressed` 行为。
- 先补失败测试覆盖根因，再做最小实现并通过回归。

## 非目标（明确不做）

- 不新增 `wine`、`plain` 之外的主题家族。
- 不调整 Header 的站点标识、导航信息架构、移动菜单导航项或 768px 响应式断点。
- 不修改通用 Button 的公共 API 或全局默认样式。
- 不引入第三方弹层、动画或状态管理依赖。

## 影响范围

- `packages/wuh.site.next/app/components/SiteHeader/index.tsx` — 修复移动端层级状态与焦点归还；替换桌面入口样式；引入共享选项组件。
- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 桌面入口改为导航同款轻量按钮；色板预览改用固定色值；移除厚重胶囊样式。
- `packages/wuh.site.next/app/components/SiteHeader/AppearanceOptions.tsx` — **新增**共享选项组件，负责主题色板与显示模式两组选择控件。
- `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` — 新增失败测试：色板固定预览值、移动端二级关闭恢复一级菜单及焦点、桌面入口无厚重胶囊视觉。

### `specs/design-system/spec.md`
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

### `tasks.md`
# 任务清单

> 所有任务的实际耗时在实施阶段完成后填写；未实施前记为 `—`。任务按顺序执行。

## Phase 1: 失败测试

### Task 1: 为三项 Bug 编写失败测试

- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 新增「色板预览使用固定色值」断言：酒红 `SwatchPreview` 引用酒红主色/背景色，素雅引用素雅主色/背景色，两者不读取 `var(--primary-color)`。
- [ ] 新增「移动端二级关闭恢复一级菜单」断言：二级 Sheet 关闭后一级菜单恢复可见；焦点归还到一级菜单内的外观入口按钮。
- [ ] 新增「桌面入口无厚重胶囊」断言：`AppearanceTrigger` 不再使用 999px 胶囊、混合主题色边框、内阴影或显式上浮动效。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 因修复未实施而失败。

## Phase 2: 共享选项组件

### Task 2: 实现 AppearanceOptions 共享组件

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/AppearanceOptions.tsx`（新增）
- [ ] 抽取现有 `THEME_OPTIONS`、`SCHEME_OPTIONS` 静态数据和选择控件渲染逻辑。
- [ ] 酒红 `SwatchPreview` 使用固定渐变 `linear-gradient(135deg, #C94A44 0 48%, #FFFBF8 48% 100%)`。
- [ ] 素雅 `SwatchPreview` 使用固定渐变 `linear-gradient(135deg, #C89060 0 48%, #FFFDF9 48% 100%)`。
- [ ] 统一 `aria-pressed` 行为，接收 `themeFamily`/`colorSchemeMode` 和 onChange 回调。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** Task 1 色板相关测试通过。

## Phase 3: 移动端交互重设计

### Task 3: 将移动端外观设置改为一级菜单内联展开

- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`
- [x] 先更新失败测试，要求移动端使用 `mobileAppearanceExpanded` 折叠状态，并禁止渲染 Overlay、Sheet、滚动锁和下滑关闭逻辑。
- [x] 删除移动端 `mobileAppearanceOpen`、`mobileAppearanceTriggerRef`、触摸手势和二级弹层关闭回调。
- [x] 在 `MobileAppearanceAction` 后直接渲染共享 `AppearanceOptions`，由 `aria-expanded`、`aria-controls` 和稳定 id 建立折叠关系。
- [x] 主题选择后保持菜单打开；再次点击外观按钮仅收起选项。
- [x] 汉堡关闭、导航项点击和 Escape 关闭整个菜单时，将外观展开状态重置为 `false`。
- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [x] 删除 `MobileAppearanceOverlay`、`MobileAppearanceSheet`、`SheetHandle`、`SheetHeader`、`SheetTitle`、`SheetCurrent`、`SheetClose` 样式。
- [x] 新增菜单内折叠内容样式；限制移动菜单最大高度并允许内部纵向滚动。
- [x] **预计耗时:** 60 分钟
- [x] **实际耗时:** 15 分钟
- [x] **验证:** Header 回归测试 21/21 通过；移动菜单打开/展开/选择/收起/整体关闭状态符合规格。

## Phase 4: 桌面入口视觉修复

### Task 4: 桌面外观入口改为导航同款轻量按钮

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 重写 `AppearanceTrigger`：移除 999px 胶囊、混合主题色边框、内阴影和 `translateY` hover。
- [ ] 改为与 `NavLink` 一致的 padding（10px 12px）、圆角（非胶囊）、透明背景、导航文字颜色。
- [ ] 静态使用淡主题色底（`color-mix(in oklab, var(--primary-color) 8%, transparent)`）和主题色图标。
- [ ] 打开态通过背景加深、文字/图标颜色变化和箭头旋转表达。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** —
- [ ] **验证:** Task 1 桌面入口相关测试通过；在 768px、1024px、1440px 以及酒红/素雅的浅色/深色组合中检查视觉一致性。

## 验收

- [ ] 酒红色板预览显示酒红主色 + 暖纸背景色，素雅色板预览显示棕米主色 + 米白背景色，两者明显不同。
- [ ] 移动端：点击「外观设置」后选项直接在一级菜单内展开，不出现独立 Bottom Sheet 或遮罩。
- [ ] 移动端：主题选择后菜单保持打开；再次点击外观按钮仅收起选项。
- [ ] 移动端：汉堡关闭按钮、导航项或 Escape 关闭整个菜单，并重置外观展开状态。
- [ ] 桌面端外观入口与博客/关于导航链接视觉上属于同一体系（尺寸、圆角、交互节奏一致）。
- [ ] 桌面端外部点击/Escape 关闭浮层并归还焦点。
- [ ] 主题即时生效、刷新持久化、system/light/dark 模式切换不受影响。
- [ ] 320px 窄屏无横向滚动，所有触控目标 ≥ 44px。
- [ ] `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 通过。
- [ ] `pnpm exec tsc --noEmit` 零错误。
- [ ] `pnpm build:next` 成功。
