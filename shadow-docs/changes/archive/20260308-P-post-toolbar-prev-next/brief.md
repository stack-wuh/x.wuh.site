# 博客详情页上下篇导航

> 原始变更名：`20260308_P_post-toolbar-prev-next`

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
# 设计：文章上下篇导航

## 方案

### 1. 数据获取

- 在 page.tsx 中获取当前文章的相邻文章信息
- 排序规则: 按 issue.number 或 created_at
- 查询范围: 仅 open issues
- 传递 prevIssue/nextIssue 给 PostView

### 2. Toolbar 布局

```
[← 上一条标题...]                    [下一条标题... →]
```

- `display: flex; justify-content: space-between`
- 按钮: `max-width: 45%`, `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`
- 禁用态: `aria-disabled`, 透明度降低, 无 pointer-events

### 3. 禁用态

- 无上一条/下一条: 按钮文案 "空空如也"
- 不可点击
- 视觉弱化

## 依赖

- 零新依赖

## 任务
### Phase 1 — 数据层
- [ ] T1: page.tsx 中获取相邻文章数据
### Phase 2 — UI 层
- [ ] T2: 重构 PostView 底部 Toolbar
### Phase 3 — 验证
- [ ] T3: 验证导航功能

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 文章上下篇导航
change: post-toolbar-prev-next
date: 2026-03-08
type: P
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/30
```

### `design.md`
# 设计：文章上下篇导航

## 方案

### 1. 数据获取

- 在 page.tsx 中获取当前文章的相邻文章信息
- 排序规则: 按 issue.number 或 created_at
- 查询范围: 仅 open issues
- 传递 prevIssue/nextIssue 给 PostView

### 2. Toolbar 布局

```
[← 上一条标题...]                    [下一条标题... →]
```

- `display: flex; justify-content: space-between`
- 按钮: `max-width: 45%`, `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`
- 禁用态: `aria-disabled`, 透明度降低, 无 pointer-events

### 3. 禁用态

- 无上一条/下一条: 按钮文案 "空空如也"
- 不可点击
- 视觉弱化

## 依赖

- 零新依赖

### `proposal.md`
# 博客详情页上下篇导航

## 为什么做

博客详情页底部 Toolbar 当前是"返回首页"和"在 GitHub 查看"按钮，缺少文章之间的导航。需要改为上下篇导航，让读者可以连续阅读。

## 做什么

- 删除底部 Toolbar 的"返回首页"和"在 GitHub 查看"按钮
- 左侧按钮改为 prevIcon + 上一条 issue 标题
- 右侧按钮改为 nextIcon + 下一条 issue 标题
- 上一条/下一条不存在时按钮不可点击，文案显示"空空如也"
- 单行展示，超出显示省略号
- 保持单行双按钮左右两端对齐布局

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 按钮重构
- `packages/wuh.site.next/app/post/[number]/page.tsx` — 邻接数据获取
- `packages/wuh.site.next/app/post/styles/index.ts` — 样式更新

### `tasks.md`
# 任务拆分

## Phase 1 — 数据层

- [ ] T1: page.tsx 中获取相邻文章数据
  - 涉及文件: `packages/wuh.site.next/app/post/[number]/page.tsx`
  - 产出: prevIssue/nextIssue 数据

## Phase 2 — UI 层

- [ ] T2: 重构 PostView 底部 Toolbar
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`, styles
  - 产出: 上下篇导航按钮 + 禁用态 "空空如也"

## Phase 3 — 验证

- [ ] T3: 验证导航功能
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证第一篇/最后一篇禁用态、超长标题省略、移动端
