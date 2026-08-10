# 暗黑模式切换闪动修复 + 过渡动画

> 原始变更名：`20260627_P_dark_mode_flash_fix`

## 元数据
- 日期：2026-06-28
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
当前主题系统 `data-color-scheme` 在客户端 `useEffect` 中设置，晚于 React hydration 执行。表现为：

- 页面默认用明亮样式渲染首屏
- JS 执行后检测到系统暗黑偏好才切换到暗色
- 用户看到明显的亮→暗"闪动"

此外，切换过程没有过渡动画，明暗切换太直接。

## 引用规范
- `specs/design-system/spec.md`

## 决策
```
浏览器解析 HTML
    │
    ▼
<head> 同步脚本执行（无依赖，纯 DOM API）
    ├── 读 prefers-color-scheme → 设 data-color-scheme
    ├── 读 localStorage → 设 data-theme-family
    └── 设 data-no-transition（阻止首屏过渡）
    │
    ▼
CSS 匹配正确的选择器 → 首屏无闪动（且无过渡动画）
    │
    ▼
React hydration
    │
    ▼
ThemeModeProvider useEffect
    ├── 注册系统主题变化监听
    └── 移除 data-no-transition → 后续切换有过渡动画
```

| 维度 | 选择 | 理由 |
|------|------|------|
| 脚本位置 | `<head>` 同步 `<script>` | 浏览器在脚本执行完之前不渲染任何像素 |
| data 属性 | dataset API | 与现有 ThemeModeProvider 保持一致 |
| 过渡方式 | 全局 `*` 选择器 CSS transition | 覆盖面完整，零侵入组件代码 |
| 首屏过渡禁用 | `data-no-transition` attribute guard | 脚本→hydration 间禁止过渡，hydration 后移除 |

## 任务
### Phase 1: 核心修复
- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] 在 `<head>` 中插入同步 `<script>`，读取 `prefers-color-scheme` 和 `localStorage`，设置 `data-color-scheme`、`data-theme-family`、`data-no-transition`
- [ ] **预计耗时:** 15 min
- [ ] **验证:** 页面首次加载不闪动
- [ ] **文件:** `packages/components/themes/cssVariableProvider.tsx`
- [ ] 在 Layer 3 之后追加 `data-no-transition` guard 和全局 `*` transition 规则
- [ ] **预计耗时:** 10 min
- [ ] **验证:** 手动切换系统亮暗 → 0.3s 平滑过渡
- [ ] **文件:** `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx`
- [ ] 在 useEffect 末尾调用 `document.documentElement.removeAttribute('data-no-transition')`
- [ ] **预计耗时:** 5 min
- [ ] **验证:** hydration 后无 data-no-transition，过渡正常工作
### Phase 2: 验证
- [ ] 启动 `pnpm dev:next`
- [ ] 系统设为暗色 → 首次加载无闪动
- [ ] 系统设为亮色 → 首次加载无闪动
- [ ] 系统亮→暗切换 → 0.3s 平滑过渡
- [ ] 系统暗→亮切换 → 0.3s 平滑过渡
- [ ] 手动切换酒红/素雅 → 过渡正常
- [ ] **预计耗时:** 10 min
- [ ] 首次加载零闪动
- [ ] 主题切换有 0.3s 全局平滑过渡
- [ ] `npx tsc --noEmit` 零错误
- [ ] 移动端和桌面端行为一致

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: dark-mode-flash-fix
date: 2026-06-28
type: P
status: proposed
```

### `design.md`
# 设计文档

## 架构

```
浏览器解析 HTML
    │
    ▼
<head> 同步脚本执行（无依赖，纯 DOM API）
    ├── 读 prefers-color-scheme → 设 data-color-scheme
    ├── 读 localStorage → 设 data-theme-family
    └── 设 data-no-transition（阻止首屏过渡）
    │
    ▼
CSS 匹配正确的选择器 → 首屏无闪动（且无过渡动画）
    │
    ▼
React hydration
    │
    ▼
ThemeModeProvider useEffect
    ├── 注册系统主题变化监听
    └── 移除 data-no-transition → 后续切换有过渡动画
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 脚本位置 | `<head>` 同步 `<script>` | 浏览器在脚本执行完之前不渲染任何像素 |
| data 属性 | dataset API | 与现有 ThemeModeProvider 保持一致 |
| 过渡方式 | 全局 `*` 选择器 CSS transition | 覆盖面完整，零侵入组件代码 |
| 首屏过渡禁用 | `data-no-transition` attribute guard | 脚本→hydration 间禁止过渡，hydration 后移除 |

## 细节

### `<head>` 脚本

- 用 IIFE 包裹避免变量污染
- 无需任何外部依赖，纯 DOM API
- 执行顺序：先 colorScheme（系统级）→ 再 themeFamily（用户偏好，可覆盖默认）

### 全局过渡 CSS

```css
html[data-no-transition] *,
html[data-no-transition] *::before,
html[data-no-transition] *::after {
  transition: none !important;
}

*, *::before, *::after {
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}
```

### ThemeModeProvider 改动

在第一个 `useEffect` 末尾追加一行移除 `data-no-transition`：

```ts
document.documentElement.removeAttribute('data-no-transition')
```

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 完全兼容，脚本只设置已有 data 属性
- **性能影响:** `<head>` 脚本 < 1KB，同步执行 < 1ms，无网络请求

### `proposal.md`
# 暗黑模式切换闪动修复 + 过渡动画

## 背景

当前主题系统 `data-color-scheme` 在客户端 `useEffect` 中设置，晚于 React hydration 执行。表现为：

- 页面默认用明亮样式渲染首屏
- JS 执行后检测到系统暗黑偏好才切换到暗色
- 用户看到明显的亮→暗"闪动"

此外，切换过程没有过渡动画，明暗切换太直接。

## 目标

- 首屏渲染前（`<head>` 同步脚本）即设置 `data-color-scheme` 和 `data-theme-family`，消除闪动
- 主题切换时有全局 0.3s 平滑过渡动画
- 首屏禁用过渡以防反向闪动（元素从默认值过渡到目标值）

## 非目标（明确不做）

- 不改变双维度主题模型架构
- 不改变 CSS 变量结构
- 不改用户手动切换主题的逻辑

## 影响范围

- `packages/wuh.site.next/app/layout.tsx` — 添加 `<head>` 阻塞脚本
- `packages/components/themes/cssVariableProvider.tsx` — 添加全局过渡 CSS + 无过渡 guard
- `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx` — hydration 后移除 `data-no-transition`

### `specs/design-system/spec.md`
# Design System

## ADDED

### Requirement: 首屏主题无闪动
- **GIVEN** 用户首次访问页面或刷新页面
- **WHEN** 浏览器解析 HTML
- **THEN** `<head>` 中的同步脚本在首次渲染前设置 `data-color-scheme` 和 `data-theme-family`
- **AND** 页面首次渲染时 CSS 选择器匹配正确的主题色
- **AND** 不出现亮→暗或暗→亮的视觉闪烁

### Requirement: 首屏禁用过渡动画
- **GIVEN** `<head>` 脚本执行完毕
- **WHEN** 页面首次渲染
- **THEN** `<html>` 元素带有 `data-no-transition` 属性
- **AND** 所有元素的 `transition` 被禁用，防止颜色从默认值过渡到目标值产生反向闪动
- **AND** React hydration 后 `ThemeModeProvider` 移除 `data-no-transition`

### Requirement: 全局主题色过渡动画
- **GIVEN** 系统或用户切换亮暗主题
- **WHEN** `data-color-scheme` 或 `data-theme-family` 属性值变化
- **THEN** 所有元素的 background-color、color、border-color、box-shadow 以 0.3s ease 平滑过渡
- **AND** 过渡覆盖所有元素及其伪元素

### `tasks.md`
# 任务清单

## Phase 1: 核心修复

### Task 1: layout.tsx 添加 <head> 阻塞脚本

- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] 在 `<head>` 中插入同步 `<script>`，读取 `prefers-color-scheme` 和 `localStorage`，设置 `data-color-scheme`、`data-theme-family`、`data-no-transition`
- [ ] **预计耗时:** 15 min
- [ ] **验证:** 页面首次加载不闪动

### Task 2: CssVariableStyles 添加过渡规则

- [ ] **文件:** `packages/components/themes/cssVariableProvider.tsx`
- [ ] 在 Layer 3 之后追加 `data-no-transition` guard 和全局 `*` transition 规则
- [ ] **预计耗时:** 10 min
- [ ] **验证:** 手动切换系统亮暗 → 0.3s 平滑过渡

### Task 3: ThemeModeProvider 移除 no-transition guard

- [ ] **文件:** `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx`
- [ ] 在 useEffect 末尾调用 `document.documentElement.removeAttribute('data-no-transition')`
- [ ] **预计耗时:** 5 min
- [ ] **验证:** hydration 后无 data-no-transition，过渡正常工作

## Phase 2: 验证

### Task 4: 端到端验证

- [ ] 启动 `pnpm dev:next`
- [ ] 系统设为暗色 → 首次加载无闪动
- [ ] 系统设为亮色 → 首次加载无闪动
- [ ] 系统亮→暗切换 → 0.3s 平滑过渡
- [ ] 系统暗→亮切换 → 0.3s 平滑过渡
- [ ] 手动切换酒红/素雅 → 过渡正常
- [ ] **预计耗时:** 10 min

## 验收

- [ ] 首次加载零闪动
- [ ] 主题切换有 0.3s 全局平滑过渡
- [ ] `npx tsc --noEmit` 零错误
- [ ] 移动端和桌面端行为一致
