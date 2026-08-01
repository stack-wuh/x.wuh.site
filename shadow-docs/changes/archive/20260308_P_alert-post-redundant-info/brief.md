# Alert 组件与博客详情页冗余信息

> 原始变更名：`20260308_P_alert-post-redundant-info`

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
# 设计：Alert 组件与博客冗余信息

## 方案

### 1. Alert 组件 API

```ts
interface AlertProps {
  children: React.ReactNode
  type?: 'info' | 'success' | 'warning' | 'error'
  icon?: React.ReactNode
  closable?: boolean
  onClose?: () => void
}
```

### 2. 博客详情页布局

**Meta Card**:
- 5 个字段，每个 label: value 结构，Icon 前置
- 更新时间: 由 {github.userName} 于 yyyy-MM-dd HH:MM:SS 更新
- 原文链接: GitHub Issue 链接（去域名）
- 所属项目: Project 链接
- 开源许可: 许可说明
- 所属标签: 标签列表
- 单行展示，不换行（white-space: nowrap + text-overflow: ellipsis）
- Icon hover 绕中心旋转 360 度

**Share Card**:
- 独立的 Card 包裹 SharedLinkGroup

### 3. 样式

- 使用 styled-components + CSS 变量
- Meta Card 与 Share Card 独立卡片，放在正文下方
- 响应式: 移动端字段可能折断，需调整最小宽度

## 任务
### Phase 1 — Alert 组件重构
- [ ] T1: 重写 Alert 组件（删除旧 scss 依赖）
### Phase 2 — 博客详情页接入
- [ ] T2: PostView 接入 Alert 展示冗余信息
- [ ] T3: 拆分为 Meta Card + Share Card 双卡片结构
### Phase 3 — 验证
- [ ] T4: 功能与样式验证

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: Alert组件与博客冗余信息
change: alert-post-redundant-info
date: 2026-03-08
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/23
```

### `design.md`
# 设计：Alert 组件与博客冗余信息

## 方案

### 1. Alert 组件 API

```ts
interface AlertProps {
  children: React.ReactNode
  type?: 'info' | 'success' | 'warning' | 'error'
  icon?: React.ReactNode
  closable?: boolean
  onClose?: () => void
}
```

### 2. 博客详情页布局

**Meta Card**:
- 5 个字段，每个 label: value 结构，Icon 前置
- 更新时间: 由 {github.userName} 于 yyyy-MM-dd HH:MM:SS 更新
- 原文链接: GitHub Issue 链接（去域名）
- 所属项目: Project 链接
- 开源许可: 许可说明
- 所属标签: 标签列表
- 单行展示，不换行（white-space: nowrap + text-overflow: ellipsis）
- Icon hover 绕中心旋转 360 度

**Share Card**:
- 独立的 Card 包裹 SharedLinkGroup

### 3. 样式

- 使用 styled-components + CSS 变量
- Meta Card 与 Share Card 独立卡片，放在正文下方
- 响应式: 移动端字段可能折断，需调整最小宽度

### `proposal.md`
# Alert 组件与博客详情页冗余信息

## 为什么做

博客详情页缺少统一的冗余信息提示组件。现有 Alert 占位实现引用了不存在的 scss 文件，需要重构为可用的 styled-components 实现，并接入页面展示文章更新时间、原文链接、标签、版权说明等信息。

## 做什么

- 重构 `packages/components/alert/` 为可复用 Alert 组件
- 在 PostView.tsx 接入 Alert，展示：更新时间（具体到分钟）、文档原链接（去掉 GitHub 域名）、文档标签、版权说明、所属 Project（支持点击跳转）
- 将分享组件放入 Alert 区域
- Alert 组件不需要支持点击关闭
- 后续拆分为 Meta Card + Share Card 双卡片结构
- 元信息字段单行不换行，label: value 结构前加 Icon（hover 旋转 360 度）

## 影响范围

- `packages/components/alert/` — 重构
- `packages/wuh.site.next/app/post/PostView.tsx` — 接入 Alert
- `packages/wuh.site.next/app/post/styles/index.ts` — 样式调整

### `tasks.md`
# 任务拆分

## Phase 1 — Alert 组件重构

- [ ] T1: 重写 Alert 组件（删除旧 scss 依赖）
  - 涉及文件: `packages/components/alert/index.tsx`, `packages/components/alert/styles/index.ts`
  - 产出: styled-components 实现的 Alert 组件

## Phase 2 — 博客详情页接入

- [ ] T2: PostView 接入 Alert 展示冗余信息
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`
  - 产出: 展示更新时间、原文链接、标签、版权、Project

- [ ] T3: 拆分为 Meta Card + Share Card 双卡片结构
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`, styles
  - 产出: 元信息单行不换行，Icon hover 旋转，Share 独立卡片

## Phase 3 — 验证

- [ ] T4: 功能与样式验证
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证桌面/移动端、字段缺失降级、超长文本省略号
