# Empty 组件

> 原始变更名：`20260308_P_empty-component`

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
# 设计：Empty 组件

## 方案

### 1. 组件 API

```ts
interface EmptyProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}
```

### 2. 样式

- 使用 CSS 变量 token（--space-*、--font-size-*、--text-*）
- 居中布局，插画/icon + 标题 + 描述
- 响应式: 移动端 padding 16px

## 依赖

- 零新依赖

## 任务
### Phase 1 — Empty 组件实现
- [ ] T1: 实现 Empty 组件
### Phase 2 — 页面接入
- [ ] T2: 博客详情页底部接入 Empty 作为留言占位
### Phase 3 — 验证
- [ ] T3: 验证功能与样式

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: Empty组件
change: empty-component
date: 2026-03-08
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/6
```

### `design.md`
# 设计：Empty 组件

## 方案

### 1. 组件 API

```ts
interface EmptyProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}
```

### 2. 样式

- 使用 CSS 变量 token（--space-*、--font-size-*、--text-*）
- 居中布局，插画/icon + 标题 + 描述
- 响应式: 移动端 padding 16px

## 依赖

- 零新依赖

### `proposal.md`
# Empty 组件

## 为什么做

博客详情页底部留言区域缺少占位提示。需要新增 Empty 空状态组件，在留言系统未实现时提供清晰的占位语义。

## 做什么

- 在 `packages/components/empty/` 实现可复用 Empty 组件
- 样式使用 CSS 变量 token
- 在博客详情页底部接入作为"留言系统预留区"占位
- 支持可选 title/description/icon 插槽

## 影响范围

- `packages/components/empty/` — 新增
- `packages/wuh.site.next/app/post/PostView.tsx` — 底部接入

## 不改什么

- 不接入真实留言系统接口
- 不新增第三方依赖

### `tasks.md`
# 任务拆分

## Phase 1 — Empty 组件实现

- [ ] T1: 实现 Empty 组件
  - 涉及文件: `packages/components/empty/index.tsx`, readme.md
  - 产出: token 驱动的 Empty 空状态组件

## Phase 2 — 页面接入

- [ ] T2: 博客详情页底部接入 Empty 作为留言占位
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`
  - 产出: 留言系统预留区展示

## Phase 3 — 验证

- [ ] T3: 验证功能与样式
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证占位文案、light/dark、移动端
