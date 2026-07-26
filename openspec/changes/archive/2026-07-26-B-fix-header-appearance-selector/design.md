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
