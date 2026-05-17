# 实施任务

## Phase 1: CSS 变量基础设施

- [x] **Task 1.1: cssVariableProvider.tsx — 新增行高 token 渲染**
  - 涉及文件: `packages/components/themes/cssVariableProvider.tsx`
  - 在 `:root` 中新增 `--line-height-body` 和 `--line-height-heading` 的渲染逻辑
  - 实际耗时: 5min

- [x] **Task 1.2: cssVariableProvider.tsx — plain 主题覆写字号/行高**
  - 涉及文件: `packages/components/themes/cssVariableProvider.tsx`
  - 在 `:root[data-theme='plain']` 中覆写 `--font-size-*`、`--line-height-*`
  - 实际耗时: 5min

- [x] **Task 1.3: cssVariableProvider.tsx — 补全 plain dark 变量**
  - 涉及文件: `packages/components/themes/cssVariableProvider.tsx`
  - 在 `@media (prefers-color-scheme: dark)` 的 `:root[data-theme='plain']` 中补全缺失的 `--normal-*`、`--background-*` 和 `--primary-*` 变量
  - 实际耗时: 10min

## Phase 2: MarkdownBody 排版改造

- [x] **Task 2.1: MarkdownBody 标题改用 CSS 变量**
  - 涉及文件: `packages/wuh.site.next/app/post/styles/index.ts`
  - h1-h6 字号从 em 硬编码改为 `var(--font-size-*)` 引用
  - p 行高改为 `var(--line-height-body)`
  - 实际耗时: 5min

### Phase 3: 逐组合调色

- [x] **Task 3.1: 调色 — 酒红 light**
  - `--text-muted`: light['600'] → light['700']
  - 实际耗时: 2min

- [x] **Task 3.2: 调色 — 酒红 dark**
  - `--text-secondary`: dark['700'] → dark['600']
  - `--text-muted`: dark['800'] → dark['700']
  - 实际耗时: 2min

- [x] **Task 3.3: 调色 — 素雅 light**
  - 已在 Phase 1.2 中同步调整
  - 实际耗时: 0min（合并在 Phase 1）

- [x] **Task 3.4: 调色 — 素雅 dark**
  - 已在 Phase 1.3 中同步调整，补全完整色阶
  - 实际耗时: 0min（合并在 Phase 1）

总实际: 30min | 总预计: 140min
