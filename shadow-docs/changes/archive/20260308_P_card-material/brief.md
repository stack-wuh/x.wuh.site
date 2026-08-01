# Card 组件

> 原始变更名：`20260308_P_card-material`

## 元数据
- 日期：2026-03-08
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：Card 组件

## 方案

### 1. 组件 API

```ts
interface CardProps {
  children: React.ReactNode
  variant?: 'elevated' | 'outlined' | 'filled'
  elevation?: 0 | 1 | 2 | 3
  onClick?: () => void
  className?: string
}
```

### 2. 样式

- 圆角: 16-20px
- 阴影: `0 2px 8px rgba(0,0,0,0.08)`（默认），hover 阴影增强
- 背景: CSS 变量 `--background-card`
- hover: `transform: translateY(-4px)` + 阴影加深
- transition: `180ms ease`
- 适配 prefers-reduced-motion（禁用位移，仅阴影变化）

## 依赖

- 零新依赖

## 任务
### Phase 1 — Card 组件实现
- [ ] T1: 实现 Card 样式与基础结构
- [ ] T2: 更新导出与 README
### Phase 2 — 验证
- [ ] T3: 验证样式与兼容性

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: Card组件
change: card-material
date: 2026-03-08
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/5
```

### `design.md`
# 设计：Card 组件

## 方案

### 1. 组件 API

```ts
interface CardProps {
  children: React.ReactNode
  variant?: 'elevated' | 'outlined' | 'filled'
  elevation?: 0 | 1 | 2 | 3
  onClick?: () => void
  className?: string
}
```

### 2. 样式

- 圆角: 16-20px
- 阴影: `0 2px 8px rgba(0,0,0,0.08)`（默认），hover 阴影增强
- 背景: CSS 变量 `--background-card`
- hover: `transform: translateY(-4px)` + 阴影加深
- transition: `180ms ease`
- 适配 prefers-reduced-motion（禁用位移，仅阴影变化）

## 依赖

- 零新依赖

### `proposal.md`
# Card 组件

## 为什么做

需要可复用 Card 组件，风格接近 Material Design（层级阴影、圆角、间距、交互态），兼容项目主题变量。

## 做什么

- 在 `packages/components/card/` 实现 Card 组件
- 基于 styled-components 实现 Material 风格
- 支持 hover/press 动画，适配 prefers-reduced-motion
- 兼容 light/dark 模式

## 影响范围

- `packages/components/card/` — 重构

### `tasks.md`
# 任务拆分

## Phase 1 — Card 组件实现

- [ ] T1: 实现 Card 样式与基础结构
  - 涉及文件: `packages/components/card/index.tsx`, `packages/components/card/styles/index.ts`
  - 产出: Material 风格 Card，支持 variant/elevation

- [ ] T2: 更新导出与 README
  - 涉及文件: `packages/components/index.ts`, `packages/components/card/readme.md`

## Phase 2 — 验证

- [ ] T3: 验证样式与兼容性
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证 light/dark、hover/press 动画、reduced-motion
