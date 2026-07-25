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
