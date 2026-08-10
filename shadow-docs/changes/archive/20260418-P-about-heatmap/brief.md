# About 页面 + 多平台热力图

> 原始变更名：`20260418_P_about-heatmap`

## 元数据
- 日期：2026-04-18
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：About 页面 + 多平台热力图

## 方案

### 1. 数据契约

```ts
type Contribution = {
  date: string // YYYY-MM-DD
  platform: 'github' | 'yuque' | 'wechat'
  count: number
  title?: string[]
  links?: string[]
}

type HeatmapResult = {
  contributions: Contribution[]
  range: { start: string; end: string }
}
```

### 2. 热力图渲染

- 7 行（周一至周日）× N 周格子
- 格子大小: 14-16px
- 颜色梯度: 0=透明、1=微绿、2=中绿、3+=深绿
- 平台筛选 + 时间窗口切换
- Tooltip: hover 显示详细数据
- SSR + ISR（revalidate 30 分钟）

### 3. 页面布局

- Hero: 短标题 + 副标题 + 关键指标卡片
- About: 左人像/图形 + 右文字 + 技能标签
- Heatmap: 全宽热力图 + 平台/时间筛选器
- 日志列表区: 可折叠，默认展开最近 7 天
- Contact: 头像 + 联系方式 + CTA

## 依赖

- 零新依赖（复用 Card、Tag 组件）

## 任务
### Phase 1 — 数据层
- [ ] T1: 定义数据契约与 API 接口
### Phase 2 — 页面实现
- [ ] T2: 实现 About 页面 Hero + About 板块
- [ ] T3: 实现热力图组件
- [ ] T4: 实现日志列表区 + 联系板块
### Phase 3 — 验证
- [ ] T5: 验证页面功能

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: About页面与热力图
change: about-heatmap
date: 2026-04-18
type: P
status: applied
```

### `design.md`
# 设计：About 页面 + 多平台热力图

## 方案

### 1. 数据契约

```ts
type Contribution = {
  date: string // YYYY-MM-DD
  platform: 'github' | 'yuque' | 'wechat'
  count: number
  title?: string[]
  links?: string[]
}

type HeatmapResult = {
  contributions: Contribution[]
  range: { start: string; end: string }
}
```

### 2. 热力图渲染

- 7 行（周一至周日）× N 周格子
- 格子大小: 14-16px
- 颜色梯度: 0=透明、1=微绿、2=中绿、3+=深绿
- 平台筛选 + 时间窗口切换
- Tooltip: hover 显示详细数据
- SSR + ISR（revalidate 30 分钟）

### 3. 页面布局

- Hero: 短标题 + 副标题 + 关键指标卡片
- About: 左人像/图形 + 右文字 + 技能标签
- Heatmap: 全宽热力图 + 平台/时间筛选器
- 日志列表区: 可折叠，默认展开最近 7 天
- Contact: 头像 + 联系方式 + CTA

## 依赖

- 零新依赖（复用 Card、Tag 组件）

### `proposal.md`
# About 页面 + 多平台热力图

## 为什么做

现有关于页内容简单，访问者无法了解站长的创作节奏与多平台输出。需要补充个人简介 + 内容输出履历，以 GitHub 热力图形式展示多平台发布轨迹。

## 做什么

### About 页面
- 顶部 Hero：标题 + 介绍 + CTA + 关键指标卡片
- About 板块：人像 + 文字介绍 + 技能标签 + 近期成果
- Platform Story：各平台说明（GitHub/语雀/微信）配 icon + 更新时间
- 联系/Social：头像 + 联系方式

### 多平台热力图
- 模仿 GitHub 贡献图：7 行 × N 周格子，按日期排列
- 数据平台：GitHub（Issues/Release/Commit）、语雀（文档更新）、微信公众号（推文）
- 聚合方式：按天汇总，不同平台权重，四段颜色梯度
- 平台切换器：GitHub、语雀、微信、全部
- 时间窗口：90/180/365 天
- Tooltip：悬停显示日期 + 平台分布 + 数量
- 点击某天展示该日内容列表

## 影响范围

- `packages/wuh.site.next/app/about/` — 页面重构
- 热力图数据源: GitHub API + 语雀 API + 微信爬虫

### `tasks.md`
# 任务拆分

## Phase 1 — 数据层

- [ ] T1: 定义数据契约与 API 接口
  - 涉及文件: `packages/wuh.site.next/app/about/api.ts`
  - 产出: Contribution 类型 + 数据获取

## Phase 2 — 页面实现

- [ ] T2: 实现 About 页面 Hero + About 板块
- [ ] T3: 实现热力图组件
  - 涉及文件: `packages/wuh.site.next/app/about/Heatmap.tsx`
  - 产出: 多平台热力图（格子/Tooltip/平台切换/时间窗口）

- [ ] T4: 实现日志列表区 + 联系板块

## Phase 3 — 验证

- [ ] T5: 验证页面功能
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证热力图切换、Tooltip、响应式、dark mode
