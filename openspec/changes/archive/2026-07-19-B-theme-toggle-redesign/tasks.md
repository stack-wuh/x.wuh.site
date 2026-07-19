---
artifact: tasks
contractVersion: 1
requiredHeadings:
  - 任务清单
  - 验收
requiredPatterns:
  - '^## Phase .+'
  - '^### Task .+'
  - '^- \[ \] \*\*文件:\*\* .+'
---

# 任务清单

## Phase 1: 回归契约与测试先行

### Task 1: 编写主题切换控件回归测试

- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 使用 Node `node:test` 读取 `SiteHeader` 与头部样式源码，锁定桌面/移动主题控件的关键 DOM 语义和 UI Pro Max 约束。
- [ ] 覆盖图标导入、动态 `aria-label`、移动端整行操作文案、图标不可收缩、44px+ 触摸目标和 reduced-motion 规则。
- [ ] **预计耗时:** 30 分钟
- [ ] **实际耗时:** 待执行
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`（实现前应先失败）

## Phase 2: 主题控件实现

### Task 2: 扩展统一 outline 图标导出

- [ ] **文件:** `packages/components/icons/index.tsx`
- [ ] 从 `lucide-react` 导出 `Palette as IconPalette` 和 `ChevronDown as IconChevronDown`。
- [ ] **预计耗时:** 15 分钟
- [ ] **实际耗时:** 待执行
- [ ] **验证:** `pnpm exec tsc --noEmit`，并由 Task 1 回归测试确认 SiteHeader 可使用图标。

### Task 3: 重构 SiteHeader 的主题控件结构与交互语义

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`
- [ ] 桌面端改为 `IconPalette + 当前主题 + IconChevronDown` 的胶囊内容结构。
- [ ] 移动端改为 `IconPalette + 切换主题 + 当前主题 + IconChevronDown` 的整行结构。
- [ ] 保持现有 `toggleTheme`、菜单关闭和 Escape 行为；补充动态 `aria-label`、`type="button"` 和装饰图标 `aria-hidden`。
- [ ] **预计耗时:** 35 分钟
- [ ] **实际耗时:** 待执行
- [ ] **验证:** Task 1 回归测试通过。

### Task 4: 隔离头部专用主题控件样式

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 将桌面和移动主题控件从通用 `styled(Button)` 改为头部专用 styled button，消除默认 filled、padding、min-height 和 ink-wash 样式覆盖。
- [ ] 按 Swiss Modernism 2.0 的理性间距实现胶囊与整行布局，使用现有 CSS 变量，保证图标 `flex: 0 0 auto`。
- [ ] 增加 hover/active/focus-visible、触摸尺寸、窄屏收缩和 `prefers-reduced-motion` 规则。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待执行
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 与 `pnpm --filter @wuh.site/next run lint`。

## Phase 3: 集成验证

### Task 5: 执行类型检查与构建级验证

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`, `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`, `packages/components/icons/index.tsx`
- [ ] 验证桌面/移动头部无 TypeScript、lint 和构建错误。
- [ ] 对 light/dark 与 wine/plain token 组合检查样式没有硬编码主题色。
- [ ] **预计耗时:** 30 分钟
- [ ] **实际耗时:** 待执行
- [ ] **验证:** `pnpm exec tsc --noEmit`、`pnpm --filter @wuh.site/next run lint`、`pnpm --filter @wuh.site/next run build`。

## 验收

- [ ] 桌面端主题控件是轻量胶囊，显示 outline 主题图标、当前主题名称和切换提示。
- [ ] 移动端展开菜单后主题整行操作项始终显示图标，触摸目标不小于 44px，窄屏无横向溢出。
- [ ] 点击桌面或移动入口仍在 `wine` / `plain` 间循环，并保留 localStorage 持久化；移动端点击后关闭菜单。
- [ ] 键盘 focus-visible、动态 aria-label、装饰图标 aria-hidden 和 reduced-motion 行为完整。
- [ ] `node:test`、lint、TypeScript 检查和 Next build 通过。
