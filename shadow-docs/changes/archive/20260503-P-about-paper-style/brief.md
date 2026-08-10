# About 页面重设计

> 原始变更名：`2026-05-03-about-paper-style`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
上一版将所有 Section 套入纸张风卡片，导致"全是白方块"，缺层次感和节奏。OrnamentDivider 每个 Section 都放，从装饰变成了噪音。

## 引用规范
- `specs/about-paper-style.md`

## 决策
# Design: About 重设计

## 视觉层次

```
Hero（无卡，居中大字）
  │
  ├─ OrnamentDivider ───────────────── (仅首)
  │
  ├─ About（无卡，头像 + 文字横排)
  ├─ 平台热力图（无卡，hotmap 直出）
  ├─ 最近日志（无卡，纯时间线）
  ├─ 平台概况（无卡，轻量项目卡片）
  │
  ├─ 联系与社交（纸张风卡片）─── (唯一卡片)
  │
  └─ OrnamentDivider ───────────────── (仅尾)
```

## 关键设计决定

### Hero 去卡片化
- 移除 HeroCard 包裹
- 标题大字 + 副标题直接放页面背景
- Metrics 改为横排 `值 · 标签` 格式，轻量展示

### Section 标题
- 保留 `var(--font-serif)` + `font-weight: 700`
- 每个 Section 有 subtitle 辅助说明

### 平台概况（无卡）
- 平台条目改为轻量 div，底部分隔线区分
- 不用 Card 组件

### 最近日志（按日期聚合时间线）
- InkDot + 日期 + 摘要 + 内联链接
- 链接用 · 分隔，compact 排在一行
- hover 左移动效保留

### 唯一卡片
- 联系与社交区：纸张风卡片 (`background-100` + `radius-card` + elevation + inset)
- 暗色模式精细适配

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `design.md`
# Design: About 重设计

## 视觉层次

```
Hero（无卡，居中大字）
  │
  ├─ OrnamentDivider ───────────────── (仅首)
  │
  ├─ About（无卡，头像 + 文字横排)
  ├─ 平台热力图（无卡，hotmap 直出）
  ├─ 最近日志（无卡，纯时间线）
  ├─ 平台概况（无卡，轻量项目卡片）
  │
  ├─ 联系与社交（纸张风卡片）─── (唯一卡片)
  │
  └─ OrnamentDivider ───────────────── (仅尾)
```

## 关键设计决定

### Hero 去卡片化
- 移除 HeroCard 包裹
- 标题大字 + 副标题直接放页面背景
- Metrics 改为横排 `值 · 标签` 格式，轻量展示

### Section 标题
- 保留 `var(--font-serif)` + `font-weight: 700`
- 每个 Section 有 subtitle 辅助说明

### 平台概况（无卡）
- 平台条目改为轻量 div，底部分隔线区分
- 不用 Card 组件

### 最近日志（按日期聚合时间线）
- InkDot + 日期 + 摘要 + 内联链接
- 链接用 · 分隔，compact 排在一行
- hover 左移动效保留

### 唯一卡片
- 联系与社交区：纸张风卡片 (`background-100` + `radius-card` + elevation + inset)
- 暗色模式精细适配

### `proposal.md`
# About 页面重设计

## 问题

上一版将所有 Section 套入纸张风卡片，导致"全是白方块"，缺层次感和节奏。OrnamentDivider 每个 Section 都放，从装饰变成了噪音。

## 设计方向

| 决策 | 选择 |
|------|------|
| Hero | 去卡片化，内容直接放在页面背景上 |
| 分隔 | OrnamentDivider 只保留首尾 |
| 卡片策略 | 仅 Contact 保留纸张风卡片，其他区块无卡片 |
| 日志布局 | 按日期聚合的纯时间线（一行一条日志） |

## Scope

单文件：`packages/wuh.site.next/app/about/page.tsx`

### `specs/about-paper-style.md`
# Spec: About 重设计

## 改动文件

`packages/wuh.site.next/app/about/page.tsx`

## 验收标准

### 视觉
- [ ] Hero 无卡片包裹，内容居中在页面背景上
- [ ] 仅首尾有 OrnamentDivider，中间 Section 无分隔装饰
- [ ] 仅 Contact 使用纸张风卡片
- [ ] 最近日志为按日期聚合的单行时间线
- [ ] 平台概况为轻量条目（无 Card 包裹）

### 技术
- [ ] TypeScript 类型检查通过
- [ ] 暗色/亮色模式正常

### 回归
- [ ] 其他页面样式不受影响

### `tasks.md`
# Tasks

| # | 任务 | 状态 |
|---|------|------|
| 1 | Hero 去卡片化 + metrics 横排 | ✅ |
| 2 | OrnamentDivider 减为首尾两个 | ✅ |
| 3 | About 区块去卡片包裹 | ✅ |
| 4 | 热力图去卡片包裹 | ✅ |
| 5 | 日志改为按日期聚合时间线 | ✅ |
| 6 | 平台概况去卡片化，轻量分隔 | ✅ |
| 7 | 联系与社交保留纸张风卡片 | ✅ |
| 8 | 暗色模式适配调整 | ✅ |
