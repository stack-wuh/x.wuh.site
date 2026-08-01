# 主题色跟随系统

> 原始变更名：`20260627_P_theme_follow_system`

## 元数据
- 日期：2026-06-27
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
当前主题切换按钮同时控制酒红/素雅（ThemeFamily）和明亮/暗黑（ColorScheme）两个维度，4 态循环。用户认为暗黑模式应该跟随操作系统偏好，手动切换只需控制酒红/素雅。

## 引用规范
- `specs/design-system/spec.md`

## 决策
# 技术方案

## 数据模型

```ts
export type Theme = ThemeFamily  // 'wine' | 'plain'
```

ColorScheme 不再纳入 Theme 类型，由 matchMedia 独立管理。

## 核心改动

### ThemeModeProvider
- Theme 类型改为 ThemeFamily
- THEME_CYCLE: `['wine', 'plain']`
- 新增 matchMedia('(prefers-color-scheme: dark)') 监听
- toggle() 只切换 data-theme-family

### SiteHeader
- THEME_LABELS: `{ wine: '酒红', plain: '素雅' }`

### system-color 调试面板
- 预览芯片缩减为 2 个
- 不再手动操作 data-color-scheme

## 不改动的文件

- tokens.ts / generator-color.ts / cssVariableProvider.tsx — CSS 层不动

## 任务
### Phase 1: 核心逻辑
- [x] **Task 1: 重写 ThemeModeProvider** — `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx` — 预估: 15min | 实际: 10min
### Phase 2: UI 同步
- [x] **Task 2: 更新 SiteHeader** — `packages/wuh.site.next/app/components/SiteHeader/index.tsx` — 预估: 5min | 实际: 3min
- [x] **Task 3: 更新 system-color 调试面板** — `packages/wuh.site.next/app/design/system-color/page.tsx` — 预估: 5min | 实际: 5min
### Phase 3: 规范
- [x] **Task 4: 更新 design-system spec** — `openspec/specs/design-system/spec.md` — 预估: 5min | 实际: 3min

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: theme-follow-system
date: 2026-06-27
type: P
status: applied
```

### `design.md`
# 技术方案

## 数据模型

```ts
export type Theme = ThemeFamily  // 'wine' | 'plain'
```

ColorScheme 不再纳入 Theme 类型，由 matchMedia 独立管理。

## 核心改动

### ThemeModeProvider
- Theme 类型改为 ThemeFamily
- THEME_CYCLE: `['wine', 'plain']`
- 新增 matchMedia('(prefers-color-scheme: dark)') 监听
- toggle() 只切换 data-theme-family

### SiteHeader
- THEME_LABELS: `{ wine: '酒红', plain: '素雅' }`

### system-color 调试面板
- 预览芯片缩减为 2 个
- 不再手动操作 data-color-scheme

## 不改动的文件

- tokens.ts / generator-color.ts / cssVariableProvider.tsx — CSS 层不动

### `proposal.md`
# 主题色跟随系统

## 动机

当前主题切换按钮同时控制酒红/素雅（ThemeFamily）和明亮/暗黑（ColorScheme）两个维度，4 态循环。用户认为暗黑模式应该跟随操作系统偏好，手动切换只需控制酒红/素雅。

## 变更范围

- Theme 类型从 `'wine-light' | 'wine-dark' | 'plain-light' | 'plain-dark'` 缩减为 `'wine' | 'plain'`
- ColorScheme 由 `matchMedia('(prefers-color-scheme: dark)')` 驱动，实时响应系统切换
- 切换按钮从 4 态循环改为 2 态（酒红 ↔ 素雅）
- 调试面板同步简化

## 影响

- 前端: `ThemeModeProvider`, `SiteHeader`, `/design/system-color`
- 后端: 无影响

### `specs/design-system/spec.md`
# Design System

## MODIFIED: 主题系统 v2.1

### Requirement: 双维度主题模型
- **GIVEN** 主题系统支持 ThemeFamily 和 ColorScheme 两个正交维度
- **WHEN** 用户切换主题
- **THEN** data-theme-family 取值为 wine (酒红) 或 plain (素雅)
- **AND** data-color-scheme 自动跟随系统 prefers-color-scheme，取值为 light (明亮) 或 dark (暗黑)
- **AND** Theme = 'wine' | 'plain'，存储于 localStorage key wuh.site.theme
- **AND** 页面加载时通过 matchMedia('(prefers-color-scheme: dark)') 初始化并监听变化

### `tasks.md`
# 任务清单

## Phase 1: 核心逻辑

- [x] **Task 1: 重写 ThemeModeProvider** — `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx` — 预估: 15min | 实际: 10min

## Phase 2: UI 同步

- [x] **Task 2: 更新 SiteHeader** — `packages/wuh.site.next/app/components/SiteHeader/index.tsx` — 预估: 5min | 实际: 3min
- [x] **Task 3: 更新 system-color 调试面板** — `packages/wuh.site.next/app/design/system-color/page.tsx` — 预估: 5min | 实际: 5min

## Phase 3: 规范

- [x] **Task 4: 更新 design-system spec** — `openspec/specs/design-system/spec.md` — 预估: 5min | 实际: 3min
