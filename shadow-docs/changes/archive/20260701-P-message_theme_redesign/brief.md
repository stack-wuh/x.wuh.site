# Toast 提示框主题重新设计

> 原始变更名：`20260701_P_message_theme_redesign`

## 元数据
- 日期：2026-07-01
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
当前 Message/Toast 组件使用硬编码的 `--background-100` 和 `--normal-300` 颜色，未跟随主题（酒红/素雅）和亮暗模式变动。暗黑模式下使用 `color-mix` 混色做适配，但视觉上不够协调。

## 引用规范
- `specs/message/spec.md`

## 决策
历史记录未提供

## 任务
### Phase 1: Toast 主题重设计
- [ ] **文件:** `packages/components/message/styles/index.tsx`
- [ ] MessageItem 背景用 `--background-color`，文字用 `--text-color`
- [ ] MessageIcon 类型颜色保持不变（success/warning/error/loading/info）
- [ ] 暗黑模式下通过 `@media (prefers-color-scheme: dark)` 放大 box-shadow
- [ ] **预计耗时:** 15 min
- [ ] **验证:** 切换酒红/素雅 + 亮/暗，Toast 颜色跟随

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: message-theme-redesign
date: 2026-07-01
type: P
status: archived
```

### `proposal.md`
# Toast 提示框主题重新设计

## 背景

当前 Message/Toast 组件使用硬编码的 `--background-100` 和 `--normal-300` 颜色，未跟随主题（酒红/素雅）和亮暗模式变动。暗黑模式下使用 `color-mix` 混色做适配，但视觉上不够协调。

## 目标

- Toast 背景色跟随 `--background-color` 和 `--text-color` 主题令牌
- 各类型（success/warning/error/info/loading）的颜色更鲜明
- 暗黑模式下文字和背景对比度更清晰
- 边框颜色使用 `color-mix` 与主题令牌混合

## 影响范围

- `packages/components/message/styles/index.tsx` — 主题修改

### `specs/message/spec.md`
# Message Theme

## MODIFIED

### Requirement: Toast 主题色跟随
- **GIVEN** 用户切换酒红/素雅主题 或 亮暗模式
- **WHEN** Toast 提示框弹出
- **THEN** 背景色使用 `var(--background-color)` 主题令牌
- **AND** 文字色使用 `var(--text-color)` 主题令牌
- **AND** 边框色使用 `color-mix(in srgb, var(--text-color) 12%, transparent)`
- **AND** 暗黑模式下阴影更深，对比度更高

### `tasks.md`
# 任务清单

## Phase 1: Toast 主题重设计

### Task 1: 重写 Message 样式

- [ ] **文件:** `packages/components/message/styles/index.tsx`
- [ ] MessageItem 背景用 `--background-color`，文字用 `--text-color`
- [ ] MessageIcon 类型颜色保持不变（success/warning/error/loading/info）
- [ ] 暗黑模式下通过 `@media (prefers-color-scheme: dark)` 放大 box-shadow
- [ ] **预计耗时:** 15 min
- [ ] **验证:** 切换酒红/素雅 + 亮/暗，Toast 颜色跟随
