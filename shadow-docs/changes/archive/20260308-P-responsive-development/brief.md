# 首页与博客列表响应式布局优化

> 原始变更名：`20260308_P_responsive-development`

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
# 设计：响应式布局优化

## 方案

### 1. 断点定义

```ts
const breakpoints = {
  mobile: 640,   // ≤640px: 单列
  tablet: 1024,  // ≤1024px: 双列
  desktop: 1440, // >1024px: 三列, 最大宽度 1200px
}
```

### 2. 布局策略

- 手机 (≤640px): CTA 按钮换行, 列表卡片全幅, padding 16px
- 平板 (≤1024px): 卡片双列, Hero 图文上下排列
- 桌面 (>1024px): 三列栅格, max-width 1200px 居中

### 3. 组件适配

- Card: 响应式宽度 `width: 100%`（移动端）/ `calc(50% - gap)`（平板）/ `calc(33.33% - gap)`（桌面）
- Tag: 移动端不换行，超出滚动
- Button: 移动端全宽或最小宽度

## 依赖

- 零新依赖（仅 styled-components @media）

## 任务
### Phase 1 — 结构调整
- [ ] T1: 拆分 HomeView 结构并实现响应式栅格
- [ ] T2: 微调 card/cta/section 样式
### Phase 2 — 博客列表页
- [ ] T3: blog/page.tsx 响应式适配
### Phase 3 — 验证
- [ ] T4: 验证各断点布局

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 响应式布局优化
change: responsive-development
date: 2026-03-08
type: P
status: applied
```

### `design.md`
# 设计：响应式布局优化

## 方案

### 1. 断点定义

```ts
const breakpoints = {
  mobile: 640,   // ≤640px: 单列
  tablet: 1024,  // ≤1024px: 双列
  desktop: 1440, // >1024px: 三列, 最大宽度 1200px
}
```

### 2. 布局策略

- 手机 (≤640px): CTA 按钮换行, 列表卡片全幅, padding 16px
- 平板 (≤1024px): 卡片双列, Hero 图文上下排列
- 桌面 (>1024px): 三列栅格, max-width 1200px 居中

### 3. 组件适配

- Card: 响应式宽度 `width: 100%`（移动端）/ `calc(50% - gap)`（平板）/ `calc(33.33% - gap)`（桌面）
- Tag: 移动端不换行，超出滚动
- Button: 移动端全宽或最小宽度

## 依赖

- 零新依赖（仅 styled-components @media）

### `proposal.md`
# 首页与博客列表响应式布局优化

## 为什么做

当前 HomeView 使用固定 980px 宽度、三栏网格和大段留白。需要实现手机(≤640px)、平板(≤1024px)和桌面三档响应式体验，在不同设备保持可读、可交互的排版。

## 做什么

- 将 HomeView 栅格/CTA/列表部分拆分，统一响应式断点
- 重新定义 padding/margin/字体/按钮排列
- 手机堆叠、平板双列、桌面三列
- blog/page.tsx 同步完成响应式布局
- 维护现有主题变量，无新增依赖

## 影响范围

- `packages/wuh.site.next/app/HomeView.tsx` — 结构+样式重构
- `packages/wuh.site.next/app/blog/page.tsx` — 响应式

### `tasks.md`
# 任务拆分

## Phase 1 — 结构调整

- [ ] T1: 拆分 HomeView 结构并实现响应式栅格
  - 涉及文件: `packages/wuh.site.next/app/HomeView.tsx`
  - 产出: 三档响应式布局

- [ ] T2: 微调 card/cta/section 样式
  - 涉及文件: `packages/wuh.site.next/app/HomeView.tsx`, styles
  - 产出: 三设备间距、字号、对齐统一

## Phase 2 — 博客列表页

- [ ] T3: blog/page.tsx 响应式适配
  - 涉及文件: `packages/wuh.site.next/app/blog/page.tsx`

## Phase 3 — 验证

- [ ] T4: 验证各断点布局
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证 390px/768px/1440px 宽度无水平滚动
