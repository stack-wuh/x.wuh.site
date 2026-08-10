# 首页主题切换按钮现代化重设计

> 原始变更名：`2026-07-19-B-theme-toggle-redesign`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
首页头部的主题切换入口在页面按钮统一替换为 `@wuh.site/components/button` 后出现样式回归：通用按钮的默认变体、尺寸和内边距与头部局部样式叠加，桌面端视觉不协调；移动端主题入口缺少稳定、明确的图标展示，窄屏下图标存在被压缩或不可见的问题。

## 引用规范
- `specs/design-system/spec.md`

## 决策
本次变更只调整首页头部的主题切换表现层，不改变 `ThemeModeProvider` 的状态和持久化逻辑。

```text
ThemeModeProvider
  ├─ theme: wine | plain
  └─ toggle()
        │
        ▼
SiteHeader
  ├─ DesktopThemeToggle（>= 768px）
  │    ├─ Palette 图标
  │    ├─ 当前主题标签
  │    └─ ChevronDown 提示
  └─ MobileThemeAction（< 768px，菜单展开后）
       ├─ Palette 图标
       ├─ “切换主题”操作文案
       ├─ 当前主题标签
       └─ ChevronRight/Down 提示
```

桌面端使用头部专用的轻量胶囊控件；移动端使用菜单内的整行操作项。两者都是原生 `button` 语义，但不再让通用 Button 的 `filled` 默认视觉参与主题控件绘制。

| 维度 | 选择 | 理由 |
|------|------|------|
| 视觉方向 | Swiss Modernism 2.0 + 当前 editorial/wine 品牌令牌 | `ui-ux-pro-max` 推荐其清晰网格、理性间距、明暗主题兼容和高可访问性；通过现有 CSS 变量保留站点品牌，而不是引入新色板 |
| 桌面布局 | 36px 高胶囊按钮，图标 + 主题名 + ChevronDown | 让控件既紧凑又具备明确的可操作暗示，避免只有颜色点造成歧义 |
| 移动布局 | 48px 以上整行按钮，左侧操作信息、右侧当前主题和 Chevron | 符合 `ui-ux-pro-max` 的 >=44px 触摸目标和 8px 间距要求，图标不会因压缩而消失 |
| 图标 | 现有 `lucide-react` outline 图标，通过 `@wuh.site/components/icons` 导出 `IconPalette` / `IconChevronDown` | 保持 icon-system 的 outline、currentColor、统一线宽风格，避免 emoji 或内联 SVG |
| 颜色 | `--primary-color`、`--background-100/200`、`--normal-300`、`--text-primary` | 保持 `wine/plain` 和系统明暗模式下的 token 映射，不在页面写入硬编码色值 |
| 动效 | 150–250ms 的背景、边框、阴影和轻微 transform；`prefers-reduced-motion` 下关闭位移 | 符合 UI Pro Max 的微交互节奏和减少动效规范，不改变布局尺寸 |
| 测试 | Node `node:test` 的静态契约回归 + TypeScript/lint | 当前前端没有 React Testing Library/Jest 配置，先用可执行的源码契约防止图标和响应式语义回归 |

## 任务
### Phase 1: 回归契约与测试先行
- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 使用 Node `node:test` 读取 `SiteHeader` 与头部样式源码，锁定桌面/移动主题控件的关键 DOM 语义和 UI Pro Max 约束。
- [ ] 覆盖图标导入、动态 `aria-label`、移动端整行操作文案、图标不可收缩、44px+ 触摸目标和 reduced-motion 规则。
- [ ] **预计耗时:** 30 分钟
- [ ] **实际耗时:** 待执行
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`（实现前应先失败）
### Phase 2: 主题控件实现
- [ ] **文件:** `packages/components/icons/index.tsx`
- [ ] 从 `lucide-react` 导出 `Palette as IconPalette` 和 `ChevronDown as IconChevronDown`。
- [ ] **预计耗时:** 15 分钟
- [ ] **实际耗时:** 待执行
- [ ] **验证:** `pnpm exec tsc --noEmit`，并由 Task 1 回归测试确认 SiteHeader 可使用图标。
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`
- [ ] 桌面端改为 `IconPalette + 当前主题 + IconChevronDown` 的胶囊内容结构。
- [ ] 移动端改为 `IconPalette + 切换主题 + 当前主题 + IconChevronDown` 的整行结构。
- [ ] 保持现有 `toggleTheme`、菜单关闭和 Escape 行为；补充动态 `aria-label`、`type="button"` 和装饰图标 `aria-hidden`。
- [ ] **预计耗时:** 35 分钟
- [ ] **实际耗时:** 待执行
- [ ] **验证:** Task 1 回归测试通过。
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 将桌面和移动主题控件从通用 `styled(Button)` 改为头部专用 styled button，消除默认 filled、padding、min-height 和 ink-wash 样式覆盖。
- [ ] 按 Swiss Modernism 2.0 的理性间距实现胶囊与整行布局，使用现有 CSS 变量，保证图标 `flex: 0 0 auto`。
- [ ] 增加 hover/active/focus-visible、触摸尺寸、窄屏收缩和 `prefers-reduced-motion` 规则。
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待执行
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 与 `pnpm --filter @wuh.site/next run lint`。
### Phase 3: 集成验证
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/index.tsx`, `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`, `packages/components/icons/index.tsx`
- [ ] 验证桌面/移动头部无 TypeScript、lint 和构建错误。
- [ ] 对 light/dark 与 wine/plain token 组合检查样式没有硬编码主题色。
- [ ] **预计耗时:** 30 分钟
- [ ] **实际耗时:** 待执行
- [ ] **验证:** `pnpm exec tsc --noEmit`、`pnpm --filter @wuh.site/next run lint`、`pnpm --filter @wuh.site/next run build`。
- [ ] 桌面端主题控件是轻量胶囊，显示 outline 主题图标、当前主题名称和切换提示。
- [ ] 移动端展开菜单后主题整行操作项始终显示图标，触摸目标不小于 44px，窄屏无横向溢出。
- [ ] 点击桌面或移动入口仍在 `wine` / `plain` 间循环，并保留 localStorage 持久化；移动端点击后关闭菜单。
- [ ] 键盘 focus-visible、动态 aria-label、装饰图标 aria-hidden 和 reduced-motion 行为完整。
- [ ] `node:test`、lint、TypeScript 检查和 Next build 通过。

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
# ================================================================
# Agent Loop workflow-control state
# Schema: agent-loop/v1
# This file coordinates the fixed OpenSpec artifacts; it does not replace them.
# proposal.md, design.md, tasks.md and specs/<domain>/spec.md remain required.
# ================================================================
schema: agent-loop/v1

change:
  id: 2026-07-19-B-theme-toggle-redesign
  title: 首页主题切换按钮现代化重设计
  type: bug # feature | bug
  status: archived # proposed | discussed | applying | reviewing | archived | committed | blocked | failed
  createdAt: 2026-07-19T00:00:00+08:00
  issue: https://github.com/stack-wuh/x.wuh.site/issues/229

# Fixed, human-readable OpenSpec artifacts. Their contents remain authoritative
# for requirements/design/tasks; YAML indexes their lifecycle and limits what
# each Agent Loop phase has to load.
artifacts:
  proposal:
    path: openspec/changes/archive/2026-07-19-B-theme-toggle-redesign/proposal.md
    status: completed # pending | completed
    summary: 已完成首页主题切换控件 Bug 的范围、目标、非目标和验收标准定义
    template:
      id: proposal
      source: skills/shadow-dev-propose/templates/proposal.md
      contractVersion: 1
      digest: sha256:426c31b60cb50e7457a6e4aa6f86c9bd6718cdd6217f292d98f1b9739ad612fd
    validation:
      status: passed # pending | passed | failed
      checkedAt: 2026-07-19T00:00:00+08:00
      missing: []
  design:
    path: openspec/changes/archive/2026-07-19-B-theme-toggle-redesign/design.md
    status: completed # pending | completed
    summary: 基于 ui-ux-pro-max 的 Swiss Modernism 2.0 方向，完成桌面胶囊与移动整行主题控件设计
    template:
      id: design
      source: skills/shadow-dev-propose/templates/design.md
      contractVersion: 1
      digest: sha256:2483c466de2ab4e8e34a1e147e098a6cef61ff6b5a69d567f565987fdd77b3e4
    validation:
      status: passed # pending | passed | failed
      checkedAt: 2026-07-19T00:00:00+08:00
      missing: []
  tasks:
    path: openspec/changes/archive/2026-07-19-B-theme-toggle-redesign/tasks.md
    status: completed # pending | completed
    summary: 已生成测试先行、图标导出、结构重构、专用样式和集成验证任务 DAG
    template:
      id: tasks
      source: skills/shadow-dev-propose/templates/tasks.md
      contractVersion: 1
      digest: sha256:d67578bdb054f235acd942e8cf1bb436abbd6831ff52469e30b82c9c845d37f9
    validation:
      status: passed # pending | passed | failed
      checkedAt: 2026-07-19T00:00:00+08:00
      missing: []
  specs:
    status: completed # pending | completed
    entries:
      - path: openspec/changes/archive/2026-07-19-B-theme-toggle-redesign/specs/design-system/spec.md
        template:
          id: spec
          source: skills/shadow-dev-propose/templates/spec.md
          contractVersion: 1
          digest: sha256:322bb9b2a379e72fa08f5ce84fbee689fddac788245ebf2c4d01153947072ea5
        validation:
          status: passed # pending | passed | failed
          checkedAt: 2026-07-19T00:00:00+08:00
          missing: []

proposal:
  status: completed # pending | completed
  source:
    type: github_issue # manual | github_issue
    issueNumber: 229
  intent: 修复首页主题切换控件在 Button 组件标准化后的样式回归，并重设计桌面与移动端交互
  background: 通用 Button 的默认视觉与头部主题控件样式叠加，导致桌面端样式异常，移动端主题图标不可见
  goals:
    - 桌面端使用现代轻量胶囊式主题控件
    - 移动端菜单内展示带图标的整行主题操作项
    - 保持现有主题切换、持久化和系统明暗色行为
  nonGoals:
    - 不修改通用 Button 公共 API 或全局默认样式
    - 不新增主题家族或第三方图标库
    - 不重做首页头部其他导航项
  scope:
    packages:
      - packages/wuh.site.next
      - packages/components/icons
    files:
      - packages/wuh.site.next/app/components/SiteHeader/index.tsx
      - packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
      - packages/components/icons/index.tsx
      - packages/wuh.site.next/test/
  acceptanceCriteria:
    - 桌面端显示主题图标、当前主题名称和切换提示，且不使用默认实心渐变
    - 移动端主题操作项始终显示图标，触摸目标不小于 44px
    - 点击任一入口保持 wine/plain 循环和 localStorage 持久化
    - 键盘与屏幕阅读器可访问，focus-visible 清晰
    - 回归测试与 TypeScript 检查通过
  constraints:
    - 使用现有 outline 图标体系和 CSS 变量主题令牌
    - 不修改 ThemeModeProvider 状态模型
  risks:
    - styled(Button) 的默认样式可能继续覆盖头部控件，需要明确隔离样式变体
    - 仅靠静态测试无法完全验证不同视口的视觉表现，需要补充响应式 DOM/CSS 检查
  domain:
    name: design-system
    keywords: [主题切换, Button, 响应式, 图标, 首页头部]
    description: 首页主题切换控件的视觉、响应式和可访问性交互规范

# Filled by discuss. design.md and tasks.md remain the fixed detailed outputs.
discuss:
  status: completed # pending | completed
  decisions:
    - 采用 Swiss Modernism 2.0 的理性间距与轻量层级，保留现有 wine/plain 品牌 token
    - 桌面端使用 36px 胶囊式主题按钮，移动端使用菜单内 48px 以上整行操作项
    - 主题控件从 styled(Button) 解耦，避免通用 filled/padding/min-height/ink-wash 覆盖
    - 使用现有 Lucide outline 图标体系导出 IconPalette 与 IconChevronDown
    - 使用动态 aria-label，不使用 aria-pressed 表示主题循环选择
    - 先写 Node node:test 回归契约，再实现代码
  architecture:
    summary: SiteHeader 继续消费 ThemeModeProvider，只替换主题控件的 DOM 结构与专用样式；共享 icons 包提供语义图标别名
    modules:
      - packages/wuh.site.next/app/components/SiteHeader/index.tsx
      - packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
      - packages/components/icons/index.tsx
      - packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
  contracts:
    api: []
    data:
      - Theme: wine | plain
      - localStorage key: wuh.site.theme
  reuse:
    components:
      - ThemeModeProvider
      - styled-components CSS variable tokens
      - lucide-react outline icon family
    newComponents:
      - SiteHeader 专用 DesktopThemeToggle
      - SiteHeader 专用 MobileThemeAction
  implementationNotes:
    - 图标设置 flex: 0 0 auto，防止移动端窄屏被压缩
    - 所有交互保留原生 button、type=button、focus-visible 和 Escape 行为
    - 动效控制在 150-250ms，并在 prefers-reduced-motion 下关闭位移
  impact:
    dependencies: []
    compatibility: 不修改通用 Button、ThemeModeProvider 或主题存储协议，兼容现有头部交互
    rollback: 恢复 SiteHeader index/styles 与 icons index 的变更即可，不涉及数据迁移

# Generated by discuss; executed by apply. tasks.md remains the fixed plan
# artifact; this workflow is its execution projection/checkpoint graph.
apply:
  status: completed # pending | ready | running | completed | blocked | failed
  generatedFrom:
    - proposal
    - discuss
  instructions:
    - 按 DAG 顺序执行，Task 1 必须先于生产代码任务并验证先失败
    - 每个 task 只修改其登记的 files，不扩大范围
    - 完成每个 task 后立即回写 evidence 与 checkpoint
  workflow:
    - id: theme-toggle-tests
      title: 编写主题切换控件回归测试
      status: completed
      dependsOn: []
      files:
        - packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
      instructions:
        - 使用 node:test 锁定图标、aria-label、移动触摸尺寸、flex 防压缩和 reduced-motion 契约
        - 先运行测试确认当前实现失败
      verification:
        - node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
          result: failed_as_expected
          summary: 当前实现缺少 IconPalette/IconChevronDown、专用 DesktopThemeToggle/MobileThemeAction 结构及对应响应式样式，3 个断言失败
          at: 2026-07-19T00:00:00+08:00
      failure: null
    - id: theme-toggle-icons
      title: 扩展统一 outline 图标导出
      status: completed
      dependsOn:
        - theme-toggle-tests
      files:
        - packages/components/icons/index.tsx
      instructions:
        - 导出 Palette as IconPalette 与 ChevronDown as IconChevronDown
      verification:
        - pnpm exec tsc --noEmit
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: ./node_modules/.bin/tsc --noEmit --pretty false
          result: passed
          summary: 图标别名导出通过 TypeScript 检查；pnpm exec tsc 在当前环境出现 SIGSEGV，使用仓库本地 tsc 二进制完成等价验证
          at: 2026-07-19T00:00:00+08:00
      failure: null
    - id: theme-toggle-structure
      title: 重构 SiteHeader 主题控件结构与语义
      status: completed
      dependsOn:
        - theme-toggle-icons
      files:
        - packages/wuh.site.next/app/components/SiteHeader/index.tsx
      instructions:
        - 实现桌面胶囊和移动整行的图标/文本结构
        - 保持主题切换、菜单关闭、Escape 和原生 button 行为
      verification:
        - node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
          result: passed
          summary: SiteHeader 已使用 IconPalette/IconChevronDown，桌面与移动主题控件结构、动态 aria-label 和图标语义契约通过
          at: 2026-07-19T00:00:00+08:00
      failure: null
    - id: theme-toggle-styles
      title: 隔离头部专用主题控件样式
      status: completed
      dependsOn:
        - theme-toggle-structure
      files:
        - packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
      instructions:
        - 移除主题控件对通用 Button 默认视觉的依赖
        - 实现响应式、触摸目标、focus-visible、reduced-motion 和窄屏收缩规则
      verification:
        - node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
        - pnpm --filter @wuh.site/next run lint
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence:
        - command: node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
          result: passed
          summary: 桌面胶囊、移动整行、触摸尺寸、flex 防压缩和 reduced-motion 契约通过
          at: 2026-07-19T00:00:00+08:00
        - command: packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app
          result: passed
          summary: SiteHeader 目录 lint 通过；pnpm filter lint 在当前环境退出 139，使用本地 oxlint 二进制完成等价验证
          at: 2026-07-19T00:00:00+08:00
      failure: null
    - id: theme-toggle-verification
      title: 执行集成类型检查与构建验证
      status: completed
      dependsOn:
        - theme-toggle-styles
      files:
        - packages/wuh.site.next/app/components/SiteHeader/index.tsx
        - packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
        - packages/components/icons/index.tsx
      instructions:
        - 运行回归测试、lint、TypeScript 和 Next build
      verification:
        - node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
        - pnpm exec tsc --noEmit
        - pnpm --filter @wuh.site/next run lint
        - pnpm --filter @wuh.site/next run build
      requiredInputs: []
      attempts: 0
      maxAttempts: 1
      evidence:
        - command: node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
          result: passed
          summary: 3 个主题切换回归断言通过
          at: 2026-07-19T00:00:00+08:00
        - command: packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app
          result: passed
          summary: Next 应用 lint 通过
          at: 2026-07-19T00:00:00+08:00
        - command: ./node_modules/.bin/next build
          result: failed
          summary: 正确包目录构建启动后因 TLS 网络断开并最终 SIGSEGV，未产生代码级诊断
          at: 2026-07-19T00:00:00+08:00
      failure: null
    - id: theme-toggle-verification-repair
      title: 重试 Next 构建验证
      status: skipped
      dependsOn:
        - theme-toggle-verification
      files:
        - packages/wuh.site.next/app/components/SiteHeader/index.tsx
        - packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
        - packages/components/icons/index.tsx
      instructions:
        - 在稳定网络和可用 Node/Next 构建环境中重试生产构建，不修改业务代码
      verification:
        - ./node_modules/.bin/next build
      requiredInputs: []
      attempts: 1
      maxAttempts: 1
      evidence:
        - command: 用户明确要求直接归档
          result: accepted
          summary: 用户接受 Next build worker SIGSEGV 环境 warning，不再重试构建
          at: 2026-07-19T00:00:00+08:00
      failure: null
  repairWorkflow: []
  checkpoint:
    lastCompletedTaskId: theme-toggle-styles
    updatedAt: 2026-07-19T00:00:00+08:00

review:
  status: warnings # pending | running | passed | warnings | blocked
  verification:
    - id: regression-tests
      command: node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
      result: passed
      summary: 3 个主题切换回归断言通过
      at: 2026-07-19T00:00:00+08:00
    - id: lint
      command: packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app
      result: passed
      summary: Next 应用 lint 通过
      at: 2026-07-19T00:00:00+08:00
    - id: production-build
      command: ./node_modules/.bin/next build
      result: unavailable
      summary: 正确包目录下 build worker 以 SIGSEGV 退出，未提供代码级诊断；用户已明确接受该环境 warning
      at: 2026-07-19T00:00:00+08:00
    - id: artifact-contracts
      command: validate-artifact-contract.mjs（proposal/design/tasks/spec）
      result: passed
      summary: 四个固定 OpenSpec 产物契约校验通过
      at: 2026-07-19T00:00:00+08:00
  findings:
    - id: R-001
      severity: warning
      file: packages/wuh.site.next/app/components/SiteHeader/index.tsx
      message: Next production build 在当前环境无法完成，build worker SIGSEGV；回归测试和 lint 已通过，未发现代码级错误证据
      status: accepted
  summary: 主题切换控件实现覆盖 proposal/spec/design/task 验收项；仅保留用户明确接受的构建环境 warning

archive:
  status: completed # pending | completed
  archivedAt: 2026-07-19T00:00:00+08:00
  specSync:
    - domain: design-system
      source: openspec/changes/archive/2026-07-19-B-theme-toggle-redesign/specs/design-system/spec.md
      target: openspec/specs/design-system/spec.md
      result: updated
      evidence:
        - command: append ADDED requirements and inspect main design-system spec
          result: passed
          at: 2026-07-19T00:00:00+08:00
  indexEntry:
    path: openspec/INDEX.md
    result: updated
    evidence:
      - command: update design-system keywords/requirements entry
        result: passed
        at: 2026-07-19T00:00:00+08:00
  componentScenarios:
    - path: openspec/specs/wuh.site/demo-theme-toggle
      decision: created
      reason: 新增桌面胶囊与移动整行主题切换交互场景
      evidence:
        - command: create demo-theme-toggle/index.md and demo.jsx; update navigation-guide.yaml
          result: passed
          at: 2026-07-19T00:00:00+08:00

commit:
  status: completed # pending | completed | blocked
  branch: 229-fix-主题切换按钮
  commits:
    - hash: abfafac4fcdb3c6623df488623406a0bc1a6351e
      message: fix: 重设计首页主题切换控件
      at: 2026-07-19T00:00:00+08:00
    - hash: 56d46fe
      message: chore: 记录主题切换变更提交状态
      at: 2026-07-19T00:00:00+08:00
  pullRequest:
    number: 230
    url: https://github.com/stack-wuh/x.wuh.site/pull/230
    state: open

runtime:
  phase: commit # propose | discuss | apply | review | archive | commit
  state: completed # idle | running | waiting_for_input | blocked | failed | completed
  attempts: 0
  resume:
    taskId: null
    command: 已提交
  requiredInputs: []
  failure: null
  updatedAt: 2026-07-19T00:00:00+08:00
```

### `design.md`
---
artifact: design
contractVersion: 1
requiredHeadings:
  - 架构
  - 技术选型
  - 复用分析
  - 影响分析
requiredPatterns:
  - '^# .+'
---

# 首页主题切换控件现代化重设计

## 架构

本次变更只调整首页头部的主题切换表现层，不改变 `ThemeModeProvider` 的状态和持久化逻辑。

```text
ThemeModeProvider
  ├─ theme: wine | plain
  └─ toggle()
        │
        ▼
SiteHeader
  ├─ DesktopThemeToggle（>= 768px）
  │    ├─ Palette 图标
  │    ├─ 当前主题标签
  │    └─ ChevronDown 提示
  └─ MobileThemeAction（< 768px，菜单展开后）
       ├─ Palette 图标
       ├─ “切换主题”操作文案
       ├─ 当前主题标签
       └─ ChevronRight/Down 提示
```

桌面端使用头部专用的轻量胶囊控件；移动端使用菜单内的整行操作项。两者都是原生 `button` 语义，但不再让通用 Button 的 `filled` 默认视觉参与主题控件绘制。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 视觉方向 | Swiss Modernism 2.0 + 当前 editorial/wine 品牌令牌 | `ui-ux-pro-max` 推荐其清晰网格、理性间距、明暗主题兼容和高可访问性；通过现有 CSS 变量保留站点品牌，而不是引入新色板 |
| 桌面布局 | 36px 高胶囊按钮，图标 + 主题名 + ChevronDown | 让控件既紧凑又具备明确的可操作暗示，避免只有颜色点造成歧义 |
| 移动布局 | 48px 以上整行按钮，左侧操作信息、右侧当前主题和 Chevron | 符合 `ui-ux-pro-max` 的 >=44px 触摸目标和 8px 间距要求，图标不会因压缩而消失 |
| 图标 | 现有 `lucide-react` outline 图标，通过 `@wuh.site/components/icons` 导出 `IconPalette` / `IconChevronDown` | 保持 icon-system 的 outline、currentColor、统一线宽风格，避免 emoji 或内联 SVG |
| 颜色 | `--primary-color`、`--background-100/200`、`--normal-300`、`--text-primary` | 保持 `wine/plain` 和系统明暗模式下的 token 映射，不在页面写入硬编码色值 |
| 动效 | 150–250ms 的背景、边框、阴影和轻微 transform；`prefers-reduced-motion` 下关闭位移 | 符合 UI Pro Max 的微交互节奏和减少动效规范，不改变布局尺寸 |
| 测试 | Node `node:test` 的静态契约回归 + TypeScript/lint | 当前前端没有 React Testing Library/Jest 配置，先用可执行的源码契约防止图标和响应式语义回归 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| `ThemeModeProvider` | `../theme/ThemeModeProvider` | 复用，不改状态逻辑 | `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx` |
| Lucide icon exports | `@wuh.site/components/icons` | 扩展导出 `IconPalette`、`IconChevronDown` | `packages/components/icons/index.tsx` |
| `styled-components` | `@wuh.site/components/styled` | 复用，新增头部专用 styled primitives | `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` |
| 通用 `Button` | `@wuh.site/components/button` | 本次主题控件不再继承其视觉样式，避免默认 `filled`/padding 覆盖 | `packages/components/button/index.tsx` |

**说明：**
- 通用 Button 仍可用于其他站点按钮，不修改其公共 API。
- 主题控件保留原生 `button` 语义，使用 styled-components 的专用元素隔离默认按钮样式。
- 图标只作为视觉提示，所有操作信息仍通过可见文字和动态 `aria-label` 提供。

## 数据模型（如涉及）

无数据模型变更。继续使用：

- `Theme = 'wine' | 'plain'`
- `localStorage` key：`wuh.site.theme`
- `document.documentElement.dataset.themeFamily`

## API 设计（如涉及）

无 API 变更。

## 组件/模块设计

### 桌面端主题控件

- 使用 `DesktopThemeToggle` 专用 styled button。
- 子元素顺序：`IconPalette` → 当前主题文本 → `IconChevronDown`。
- `aria-label` 保持动态：`切换主题（当前：酒红）`。
- 通过 `aria-hidden="true"` 隐藏纯装饰图标。
- `min-height: 36px`，不依赖通用 Button 的 `min-height: 40px`。

### 移动端主题操作项

- 使用 `MobileThemeAction` 专用 styled button。
- 左侧显示 `IconPalette` 与 `切换主题`；右侧显示当前主题名称和 Chevron。
- `min-height: 48px`，`width: 100%`，图标设置 `flex: 0 0 auto`。
- 点击后先执行 `toggleTheme()`，再关闭移动面板。
- 保持现有菜单关闭、Escape 关闭和导航链接行为。

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 768px | 隐藏移动菜单按钮；显示桌面胶囊式主题控件；主题控件与导航保持 8–12px 间距 |
| < 768px | 顶部隐藏桌面主题控件；汉堡按钮保持 44px 触摸目标；菜单展开后显示 48px 以上的主题整行操作项 |
| <= 380px | 主题操作项两侧内容允许收缩文本但图标保持固定；不出现横向滚动，当前主题标签使用 `white-space: nowrap` |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；通用 Button API、ThemeModeProvider API 和主题存储协议保持不变。
- **向后兼容:** 兼容现有桌面/移动头部交互、键盘操作和系统明暗模式。
- **性能影响:** 仅新增两个轻量 Lucide 图标和 CSS 状态样式，无运行时数据请求；动效仅作用于控件本身。
- **风险控制:** 通过源码契约测试锁定图标导出、动态 aria-label、移动端图标固定和 `prefers-reduced-motion` 规则；最终 review 额外运行类型检查和 lint。

### `proposal.md`
---
artifact: proposal
contractVersion: 1
requiredHeadings:
  - 背景
  - 目标
  - 非目标（明确不做）
  - 影响范围
requiredPatterns:
  - '^# .+'
---

# 首页主题切换按钮现代化重设计

## 背景

首页头部的主题切换入口在页面按钮统一替换为 `@wuh.site/components/button` 后出现样式回归：通用按钮的默认变体、尺寸和内边距与头部局部样式叠加，桌面端视觉不协调；移动端主题入口缺少稳定、明确的图标展示，窄屏下图标存在被压缩或不可见的问题。

## 目标

- 将首页主题切换入口重设计为现代网站常见的轻量胶囊式控件。
- 桌面端显示主题图标、当前主题名称和可切换提示。
- 移动端在展开菜单内显示带主题图标的整行操作项，并保证触摸目标和图标可见。
- 保持 `wine` / `plain` 主题家族的现有循环切换、localStorage 持久化和系统明暗色逻辑。
- 保持键盘操作、可见焦点和屏幕阅读器语义。

## 非目标（明确不做）

- 不修改通用 `@wuh.site/components/button` 的公共 API 或全局默认样式。
- 不新增主题家族，不改变 `ThemeModeProvider` 的状态模型和存储键。
- 不重做首页头部的其他导航项和移动菜单布局。
- 不新增第三方图标库或接口。

## 影响范围

- `packages/wuh.site.next/app/components/SiteHeader/index.tsx` — 主题控件的语义结构、图标和可访问性属性。
- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 桌面胶囊与移动整行控件的响应式样式。
- `packages/components/icons/index.tsx` — 复用并导出主题所需的 outline 图标别名（如缺失）。
- `packages/wuh.site.next/test/` — 新增主题切换控件的回归测试。
- 影响包：`@wuh.site/next`、`@wuh.site/components/icons`。

### `specs/design-system/spec.md`
---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^- \*\*GIVEN\*\* .+'
  - '^- \*\*WHEN\*\* .+'
  - '^- \*\*THEN\*\* .+'
---

# Spec: 首页主题切换控件

## ADDED

### Requirement: 桌面端现代主题胶囊控件
- **GIVEN** 用户在视口宽度不小于 768px 的首页访问头部
- **WHEN** 主题切换控件渲染
- **THEN** 控件以轻量胶囊布局展示主题图标、当前主题名称和可切换提示
- **AND** 控件不呈现通用 Button 的默认实心渐变视觉
- **AND** hover、active、focus-visible 状态具有清晰且不突兀的反馈

### Requirement: 移动端主题操作项始终显示图标
- **GIVEN** 用户在视口宽度小于 768px 的首页打开移动菜单
- **WHEN** 主题操作项渲染
- **THEN** 操作项以不小于 44px 的整行触摸目标展示
- **AND** 主题图标、操作文案和当前主题名称均可见
- **AND** 图标不会因 flex 收缩、容器宽度或通用按钮默认样式而消失

### Requirement: 主题切换行为保持不变
- **GIVEN** 当前主题为 `wine` 或 `plain`
- **WHEN** 用户点击桌面端或移动端主题控件
- **THEN** 主题在两个主题家族之间循环切换
- **AND** 更新 `document.documentElement.dataset.themeFamily`
- **AND** 持久化到 `wuh.site.theme`
- **AND** 移动端点击后关闭菜单

### Requirement: 主题控件可访问
- **GIVEN** 用户使用键盘或屏幕阅读器访问主题控件
- **WHEN** 控件获得焦点或被触发
- **THEN** 控件提供动态描述当前主题和切换动作的 `aria-label`
- **AND** `type` 为 `button`
- **AND** focus-visible 状态具有清晰焦点环

### `tasks.md`
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
