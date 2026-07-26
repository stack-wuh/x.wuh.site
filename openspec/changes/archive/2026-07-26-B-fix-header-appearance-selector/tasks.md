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
