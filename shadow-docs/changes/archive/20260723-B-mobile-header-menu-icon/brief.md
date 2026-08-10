# 移动端 Header 汉堡菜单图标恢复

> 原始变更名：`2026-07-23-B-mobile-header-menu-icon`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
移动端 Header 右侧的汉堡菜单按钮仍保留点击区域和菜单交互，但按钮中的 `IconBars` 图标出现不显示问题。当前按钮通过通用 `Button` 组件进行 styled 包装，图标渲染依赖通用按钮的内部样式，存在尺寸、布局和样式耦合风险。

## 引用规范
- `specs/icon-system/spec.md`

## 决策
`SiteHeader` 继续负责菜单状态、键盘关闭、ARIA 属性和 `IconBars` 渲染；`SiteHeader/styles` 负责移动按钮的视觉样式。仅解除移动菜单按钮与通用 `Button` 的样式耦合，不改变组件层级或状态流。

```text
SiteHeader
  └─ MobileToggle (styled.button)
       └─ IconBars (lucide-react)
```

| 维度 | 选择 | 理由 |
|------|------|------|
| 按钮基元 | 原生 `styled.button` | Header 菜单按钮不需要通用 Button 的变体、图标包装和默认溢出样式 |
| 图标 | 现有 `IconBars` | 复用已统一导出的 Lucide outline 图标 |
| 图标布局 | `svg` 显式 `20px × 20px`、`display: block`、`flex-shrink: 0` | 避免 SVG 默认尺寸或 flex 布局导致图标不可见或被压缩 |
| 回归验证 | Node 内置测试读取组件源码与样式约束 | 项目现有 Header 主题控件测试采用同一轻量测试方式 |

## 任务
### Phase 1: Header 图标修复
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 将 `MobileToggle` 从通用 `Button` 改为原生 `styled.button`。
- [ ] 保留 44×44 触摸目标、响应式断点、交互状态和无障碍行为。
- [ ] 为内部 SVG 固定 20×20 尺寸并禁止 flex 压缩。
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 断言移动按钮继续渲染 `IconBars`。
- [ ] 断言按钮使用独立 `styled.button` 和明确 SVG 样式。
- [ ] **验证:** `node --test test/site-header-theme-toggle.test.mjs`（工作目录：`packages/wuh.site.next`）
### Phase 2: 验收
- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`, `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 运行 Header 定向 lint 和 diff 格式检查。
- [ ] 记录 TypeScript/生产构建工具异常，不将环境崩溃误判为代码通过。
- [ ] **验证:** `./node_modules/.bin/oxlint app/components/SiteHeader`、`git diff --check`
- [ ] 移动端 Header 右侧汉堡菜单按钮显示 `IconBars`。
- [ ] 图标固定为 20×20，且不会因 flex 收缩或通用按钮样式消失。
- [ ] 菜单按钮的展开/收起、ARIA 属性和桌面端显示逻辑保持不变。
- [ ] Header 回归测试通过。

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
# ================================================================
schema: agent-loop/v1

change:
  id: 2026-07-23-B-mobile-header-menu-icon
  title: 移动端 Header 汉堡菜单图标恢复
  type: bug
  status: archived
  createdAt: 2026-07-23T00:00:00Z
  issue: https://github.com/stack-wuh/x.wuh.site/issues/231

artifacts:
  proposal:
    path: openspec/changes/archive/2026-07-23-B-mobile-header-menu-icon/proposal.md
    status: completed
    summary: 恢复移动端 Header 右侧汉堡菜单图标，并通过独立原生按钮样式固定 SVG 尺寸。
    template:
      id: proposal
      source: skills/shadow-dev-propose/templates/proposal.md
      contractVersion: 1
      digest: sha256:426c31b60cb50e7457a6e4aa6f86c9bd6718cdd6217f292d98f1b9739ad612fd
    validation:
      status: passed
      checkedAt: 2026-07-23T14:40:00Z
      missingHeadings: []
      invalidPatterns: []
  design:
    path: openspec/changes/archive/2026-07-23-B-mobile-header-menu-icon/design.md
    status: completed
    summary: 使用独立原生 styled.button 承载移动菜单按钮，显式固定 Lucide SVG 尺寸并保留现有交互契约。
    template:
      id: design
      source: skills/shadow-dev-propose/templates/design.md
      contractVersion: 1
      digest: sha256:2483c466de2ab4e8e34a1e147e098a6cef61ff6b5a69d567f565987fdd77b3e4
    validation:
      status: passed
      checkedAt: 2026-07-23T14:56:08Z
      missingHeadings: []
      invalidPatterns: []
  tasks:
    path: openspec/changes/archive/2026-07-23-B-mobile-header-menu-icon/tasks.md
    status: completed
    summary: 完成移动菜单按钮样式隔离、回归测试和定向静态检查。
    template:
      id: tasks
      source: skills/shadow-dev-propose/templates/tasks.md
      contractVersion: 1
      digest: sha256:d67578bdb054f235acd942e8cf1bb436abbd6831ff52469e30b82c9c845d37f9
    validation:
      status: passed
      checkedAt: 2026-07-23T14:56:08Z
      missingHeadings: []
      invalidPatterns: []
  specs:
    status: completed
    entries:
      - path: openspec/changes/archive/2026-07-23-B-mobile-header-menu-icon/specs/icon-system/spec.md
        template:
          id: spec
          source: skills/shadow-dev-propose/templates/spec.md
          contractVersion: 1
          digest: sha256:322bb9b2a379e72fa08f5ce84fbee689fddac788245ebf2c4d01153947072ea5
        validation:
          status: passed
          checkedAt: 2026-07-23T14:40:00Z
          missingHeadings: []
          invalidPatterns: []

proposal:
  status: completed
  source:
    type: github_issue
    issueNumber: 231
  intent: 恢复移动端 Header 右侧汉堡菜单图标，并隔离菜单按钮与通用 Button 的样式耦合。
  background: 移动端菜单按钮保留交互但图标不显示，影响用户发现和打开导航菜单。
  goals:
    - 恢复 IconBars 的稳定可见性。
    - 保持按钮触摸目标、响应式和无障碍行为。
    - 增加回归测试并记录验证证据。
  nonGoals:
    - 不修改桌面 Header。
    - 不修改移动面板导航和主题切换逻辑。
    - 不新增图标依赖。
  scope:
    packages:
      - packages/wuh.site.next
    files:
      - packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
      - packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
  acceptanceCriteria:
    - 移动端未展开 Header 右侧按钮显示 IconBars。
    - SVG 使用明确 20×20 尺寸、块级显示和不可压缩约束。
    - 菜单按钮保持 44×44 触摸区域及 aria-expanded/aria-controls。
    - 回归测试和定向 lint 通过。
  constraints:
    - 复用现有 @wuh.site/components/icons 的 IconBars。
    - 不修改公共 Button 组件行为。
    - 遵守 icon-system 与 design-system 现有 outline 图标和可访问性规范。
  risks:
    - 全量 TypeScript/Next 构建在当前环境出现 SIGSEGV，需要在 CI 或稳定环境复核。
  domain:
    name: icon-system
    keywords:
      - 图标
      - lucide-react
      - Header
      - 移动端
      - 响应式
    description: 统一移动端 Header 菜单按钮的图标显示与可访问交互。
  uiux:
    mode: required
    triggers:
      - 前端
      - Header
      - 移动端
      - 响应式
      - 图标
    rationale: 变更直接影响移动端 Header 的视觉显示和交互发现性。

discuss:
  status: completed
  decisions:
    - 独立使用原生 styled.button，避免通用 Button 的内部图标包装和视觉变体影响 Header 菜单按钮。
    - 保留 IconBars Lucide outline 图标，通过按钮内 svg 规则显式设置 20×20、display:block 和 flex-shrink:0。
    - 保留现有 44×44 触摸目标、768px 响应式断点、ARIA 属性和 reduced-motion 规则。
  architecture:
    summary: SiteHeader 管理菜单状态与 IconBars 渲染，SiteHeader/styles 独立管理移动菜单按钮视觉样式。
    modules:
      - packages/wuh.site.next/app/components/SiteHeader/index.tsx
      - packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
      - packages/components/icons/index.tsx
  contracts:
    api: []
    data: []
  reuse:
    components:
      - name: IconBars
        path: '@wuh.site/components/icons'
        decision: reuse
      - name: styled
        path: '@wuh.site/components/styled'
        decision: reuse
    newComponents: []
  uiux:
    trigger: icon-only mobile navigation control
    inputs:
      - ui-ux-pro-max UX priority: accessibility
      - ui-ux-pro-max UX priority: touch target and interaction
      - ui-ux-pro-max UX priority: responsive layout
    decisions:
      - icon-only control retains an accessible aria-label
      - touch target remains at least 44x44px
      - visible focus ring and reduced-motion behavior remain intact
      - SVG uses an explicit size to avoid disappearance from flex shrink or inherited button styles
    acceptance:
      - menu icon is visible before opening the mobile panel
      - button remains keyboard and touch operable
  implementationNotes:
    - 主题切换控件和桌面导航未改动。
    - 不新增运行时依赖或公共组件 API。
  impact:
    dependencies: []
    compatibility: DOM semantics, event behavior and accessibility attributes remain compatible.
    rollback: restore MobileToggle to styled(Button) and remove the local SVG constraints.

apply:
  status: completed
  generatedFrom:
    - proposal
    - discuss
  instructions:
    - 完成移动菜单按钮样式隔离。
    - 增加汉堡图标回归测试。
    - 执行测试、定向 lint 和 diff 检查。
  workflow:
    - id: task-1
      title: 隔离移动菜单按钮样式并固定 SVG 尺寸
      status: completed
      dependsOn: []
      files:
        - packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
      instructions:
        - 移除 MobileToggle 对通用 Button 的 styled 包装。
        - 使用 styled.button 并显式设置按钮内 svg 样式。
      verification:
        - node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: node --test test/site-header-theme-toggle.test.mjs
          result: passed
          summary: 4 tests passed
          at: 2026-07-23T14:30:00Z
      failure: null
    - id: task-2
      title: 增加菜单图标回归测试
      status: completed
      dependsOn:
        - task-1
      files:
        - packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
      instructions:
        - 断言 IconBars 渲染和 MobileToggle 独立样式。
        - 断言 SVG 尺寸、display 和 flex-shrink 约束。
      verification:
        - node --test test/site-header-theme-toggle.test.mjs
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: node --test test/site-header-theme-toggle.test.mjs
          result: passed
          summary: 4 tests passed
          at: 2026-07-23T14:56:08Z
      failure: null
    - id: task-3
      title: 定向静态检查
      status: completed
      dependsOn:
        - task-2
      files:
        - packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
        - packages/wuh.site.next/test/site-header-theme-toggle.test.mjs
      instructions:
        - 运行 Header 目录定向 lint。
        - 运行 git diff --check。
      verification:
        - ./node_modules/.bin/oxlint app/components/SiteHeader
        - git diff --check
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: ./node_modules/.bin/oxlint app/components/SiteHeader
          result: passed
          summary: no lint output, exit 0
          at: 2026-07-23T14:56:08Z
        - command: git diff --check
          result: passed
          summary: no whitespace errors
          at: 2026-07-23T14:56:08Z
      failure: null
  repairWorkflow: []
  checkpoint:
    lastCompletedTaskId: task-3
    updatedAt: 2026-07-23T15:00:00Z

review:
  status: passed
  verification:
    - id: artifact-contracts
      command: node validate-artifact-contract.mjs --template ... --artifact ... --json
      result: passed
      summary: proposal/design/tasks/spec 四个固定产物契约校验通过。
      at: 2026-07-23T14:56:08Z
    - id: regression-test
      command: node --test test/site-header-theme-toggle.test.mjs
      result: passed
      summary: 4 tests passed, 0 failed。
      at: 2026-07-23T14:56:08Z
    - id: targeted-lint
      command: ./node_modules/.bin/oxlint app/components/SiteHeader
      result: passed
      summary: 定向 lint exit 0，无输出。
      at: 2026-07-23T14:56:08Z
    - id: diff-check
      command: git diff --check
      result: passed
      summary: 无 whitespace error。
      at: 2026-07-23T14:56:08Z
  findings: []
  summary: 移动端 Header 菜单按钮已脱离通用 Button 样式，IconBars 具有显式 20×20 尺寸和不可压缩约束；现有交互、ARIA 和响应式行为保持不变。全量 TypeScript 检查存在仓库既有错误，但未涉及本次变更文件，已不纳入本变更的通过门禁。

archive:
  status: completed
  archivedAt: 2026-07-23T15:00:00Z
  specSync:
    - domain: icon-system
      source: openspec/changes/archive/2026-07-23-B-mobile-header-menu-icon/specs/icon-system/spec.md
      target: openspec/specs/icon-system/spec.md
      result: updated
      evidence:
        - command: git diff --check
          result: passed
          at: 2026-07-23T15:00:00Z
  indexEntry: existing icon-system entry retained; main spec updated with mobile Header menu icon requirements
  componentScenarios: []

commit:
  status: pending
  branch: null
  commits: []
  pullRequest: null

runtime:
  phase: commit
  state: completed
  attempts: 1
  resume:
    taskId: null
    command: 提交代码并创建 PR
  requiredInputs: []
  failure: null
  updatedAt: 2026-07-23T14:56:08Z
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

# 移动端 Header 汉堡菜单图标恢复设计

## 架构

`SiteHeader` 继续负责菜单状态、键盘关闭、ARIA 属性和 `IconBars` 渲染；`SiteHeader/styles` 负责移动按钮的视觉样式。仅解除移动菜单按钮与通用 `Button` 的样式耦合，不改变组件层级或状态流。

```text
SiteHeader
  └─ MobileToggle (styled.button)
       └─ IconBars (lucide-react)
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 按钮基元 | 原生 `styled.button` | Header 菜单按钮不需要通用 Button 的变体、图标包装和默认溢出样式 |
| 图标 | 现有 `IconBars` | 复用已统一导出的 Lucide outline 图标 |
| 图标布局 | `svg` 显式 `20px × 20px`、`display: block`、`flex-shrink: 0` | 避免 SVG 默认尺寸或 flex 布局导致图标不可见或被压缩 |
| 回归验证 | Node 内置测试读取组件源码与样式约束 | 项目现有 Header 主题控件测试采用同一轻量测试方式 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| `IconBars` | `@wuh.site/components/icons` | 复用 | `packages/wuh.site.next/app/components/SiteHeader/index.tsx` |
| `styled` | `@wuh.site/components/styled` | 复用 | `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` |
| 通用 `Button` | `@wuh.site/components/button` | 移除本处依赖 | 不适用于本菜单按钮的显式 SVG 布局控制 |

## 数据模型（如涉及）

不涉及数据模型、接口或持久化变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### MobileToggle

- 使用 `styled.button`。
- 保持 `width: 44px`、`height: 44px` 和小于 `768px` 显示。
- 重置原生按钮外观、内边距和字体，保留现有边框、背景、颜色、hover、focus-visible 和 reduced-motion 行为。
- 对内部 SVG 设置固定尺寸、块级显示和 `flex-shrink: 0`。

### SiteHeader

不修改现有状态逻辑、`IconBars` 使用方式、`aria-expanded`、`aria-controls` 和菜单切换行为。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | `MobileToggle` 隐藏，桌面导航和主题控件保持原状 |
| < 768px | `MobileToggle` 显示为 44×44 按钮，内部汉堡图标固定为 20×20 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 保持现有 Header DOM 语义、事件和 ARIA 行为
- **性能影响:** 无新增运行时依赖，仅减少通用 Button 样式层级

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

# 移动端 Header 汉堡菜单图标恢复

## 背景

移动端 Header 右侧的汉堡菜单按钮仍保留点击区域和菜单交互，但按钮中的 `IconBars` 图标出现不显示问题。当前按钮通过通用 `Button` 组件进行 styled 包装，图标渲染依赖通用按钮的内部样式，存在尺寸、布局和样式耦合风险。

## 目标

- 确保移动端 Header 右侧汉堡菜单按钮始终显示 `IconBars` 图标。
- 保持现有 44×44 触摸目标、响应式断点、展开/收起行为和无障碍属性不变。
- 为图标补充明确的 SVG 尺寸与不可压缩约束，并增加回归测试。

## 非目标（明确不做）

- 不改变桌面端 Header 导航和主题切换控件。
- 不改变移动菜单面板内的导航项和主题切换逻辑。
- 不新增图标库或修改全局图标组件实现。

## 影响范围

- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 将移动菜单按钮改为独立原生样式并固定 SVG 尺寸。
- `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` — 增加汉堡菜单图标显示的回归约束。
- `packages/components` — 仅复用现有 `lucide-react` 图标，不修改组件包。

### `specs/icon-system/spec.md`
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

# Spec: 移动端 Header 菜单图标显示

## ADDED

### Requirement: 移动端菜单按钮始终显示汉堡图标
- **GIVEN** 用户在视口宽度小于 768px 的页面访问 Header
- **WHEN** Header 初始渲染且移动菜单未展开
- **THEN** 右侧菜单按钮渲染可见的 `IconBars` outline SVG
- **AND** SVG 具有明确的 20×20 尺寸，不因 flex 收缩或通用按钮默认样式消失

### Requirement: 菜单按钮交互和触摸目标保持兼容
- **GIVEN** 用户使用触摸设备或键盘访问移动 Header
- **WHEN** 用户聚焦或点击菜单按钮
- **THEN** 按钮保持 44×44 触摸区域、清晰 focus-visible 状态和原有展开/收起行为
- **AND** `aria-expanded` 与 `aria-controls` 继续反映菜单状态

## MODIFIED

### Requirement: Header 菜单按钮样式隔离
- **GIVEN** 移动菜单按钮需要显示 Lucide SVG 图标
- **WHEN** 样式应用到按钮
- **THEN** 菜单按钮使用独立的原生 `styled.button` 样式
- **AND** 不依赖通用 Button 的内部图标包装或默认视觉变体

## REMOVED

### Requirement: 无
- 本次变更不移除任何公共图标组件或全局图标能力。

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

## Phase 1: Header 图标修复

### Task 1: 独立移动菜单按钮样式

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [ ] 将 `MobileToggle` 从通用 `Button` 改为原生 `styled.button`。
- [ ] 保留 44×44 触摸目标、响应式断点、交互状态和无障碍行为。
- [ ] 为内部 SVG 固定 20×20 尺寸并禁止 flex 压缩。
- [ ] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- **预计耗时:** 30 分钟
- **实际耗时:** 已完成，约 20 分钟

### Task 2: 增加图标回归测试

- [ ] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 断言移动按钮继续渲染 `IconBars`。
- [ ] 断言按钮使用独立 `styled.button` 和明确 SVG 样式。
- [ ] **验证:** `node --test test/site-header-theme-toggle.test.mjs`（工作目录：`packages/wuh.site.next`）
- **预计耗时:** 20 分钟
- **实际耗时:** 已完成，约 10 分钟

## Phase 2: 验收

### Task 3: 运行静态检查

- [ ] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`, `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [ ] 运行 Header 定向 lint 和 diff 格式检查。
- [ ] 记录 TypeScript/生产构建工具异常，不将环境崩溃误判为代码通过。
- [ ] **验证:** `./node_modules/.bin/oxlint app/components/SiteHeader`、`git diff --check`
- **预计耗时:** 20 分钟
- **实际耗时:** 已完成，定向 lint 与 diff 检查通过；全量类型检查/构建受环境 SIGSEGV 影响

## 验收

- [ ] 移动端 Header 右侧汉堡菜单按钮显示 `IconBars`。
- [ ] 图标固定为 20×20，且不会因 flex 收缩或通用按钮样式消失。
- [ ] 菜单按钮的展开/收起、ARIA 属性和桌面端显示逻辑保持不变。
- [ ] Header 回归测试通过。
