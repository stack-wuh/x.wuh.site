# Result 组件（404/500 错误页）

> 原始变更名：`20260322_P_result-component`

## 元数据
- 日期：2026-03-22
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：Result 组件

## 方案

### 1. 组件 API

```ts
interface ResultProps {
  status: 404 | 500 | 'info' | 'empty'
  title?: string
  description?: string
  extra?: React.ReactNode // 操作按钮等
  children?: React.ReactNode
}
```

### 2. 视觉

- GitHub 风格卡片布局
- 404: 插画 + 标题 + 引导去 GitHub/首页
- 500: 插画 + 标题 + 引导去 GitHub Issues
- 暗色模式对比度适配

## 依赖

- 零新依赖

## 任务
### Phase 1 — Result 组件实现
- [ ] T1: 实现 Result 组件
### Phase 2 — 页面接入
- [ ] T2: 404 页面接入
- [ ] T3: 500 页面接入
### Phase 3 — 验证
- [ ] T4: 验证错误页展示

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: Result组件
change: result-component
date: 2026-03-22
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/37
```

### `design.md`
# 设计：Result 组件

## 方案

### 1. 组件 API

```ts
interface ResultProps {
  status: 404 | 500 | 'info' | 'empty'
  title?: string
  description?: string
  extra?: React.ReactNode // 操作按钮等
  children?: React.ReactNode
}
```

### 2. 视觉

- GitHub 风格卡片布局
- 404: 插画 + 标题 + 引导去 GitHub/首页
- 500: 插画 + 标题 + 引导去 GitHub Issues
- 暗色模式对比度适配

## 依赖

- 零新依赖

### `proposal.md`
# Result 组件（404/500 错误页）

## 为什么做

页面 404/500 错误展示过于简单。需要新增 Result 组件用于错误页，引导用户前往 GitHub 或其他平台查看内容。

## 做什么

- 新增 Result 组件（含 404/500 展示形态）
- GitHub 风格卡片，提供引导链接
- 404/500 页面使用 Result 组件
- 支持自定义内容，后续可扩展更多场景
- 视觉上不空洞，强调下一步去向

## 影响范围

- `packages/components/result/` — 新增
- `packages/wuh.site.next/app/not-found.tsx` — 接入
- `packages/wuh.site.next/app/error.tsx` — 接入

### `tasks.md`
# 任务拆分

## Phase 1 — Result 组件实现

- [ ] T1: 实现 Result 组件
  - 涉及文件: `packages/components/result/index.tsx`, `404.tsx`, `500.tsx`
  - 产出: 支持 404/500 的 Result 组件

## Phase 2 — 页面接入

- [ ] T2: 404 页面接入
  - 涉及文件: `packages/wuh.site.next/app/not-found.tsx`
- [ ] T3: 500 页面接入
  - 涉及文件: `packages/wuh.site.next/app/error.tsx`

## Phase 3 — 验证

- [ ] T4: 验证错误页展示
  - 手动验证 404/500 页面展示、引导链接、dark mode
