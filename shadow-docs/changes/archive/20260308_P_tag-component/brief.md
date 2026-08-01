# 标签组件

> 原始变更名：`20260308_P_tag-component`

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
# 设计：标签组件

## 方案

### 1. 组件 API

```ts
interface TagProps {
  children: React.ReactNode
  color?: string // 标签背景色，来自 GitHub label color
  onClick?: () => void
  className?: string
}
```

### 2. 样式实现

使用 styled-components，CSS 变量主题令牌：

- 胶囊样式：`border-radius: 999px`，`padding: 2px 12px`，字体 `12-13px`
- hover：`transform: scale(1.05)` + 字色与背景色互换
- transition: `180ms ease`
- 适配 `prefers-reduced-motion`

### 3. 颜色处理

- 接收 GitHub label 的 hex color 作为背景色
- 自动计算对比度，确保文字可读
- light/dark 模式自动切换

### 4. 响应式

- 移动端标签不换行，超出滚动
- 最小触摸目标 28px

## 依赖

- 零新依赖，仅使用 styled-components + CSS 变量

## 任务
### Phase 1 — Tag 组件实现
- [ ] T1: 创建 Tag 组件结构与 styled-components 样式
- [ ] T2: 更新组件导出
### Phase 2 — 页面接入
- [ ] T3: 在 HomeView.tsx 中接入 Tag 组件
### Phase 3 — 验证
- [ ] T4: 验证 light/dark 模式与响应式

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 标签组件
change: tag-component
date: 2026-03-08
type: P
status: applied
```

### `design.md`
# 设计：标签组件

## 方案

### 1. 组件 API

```ts
interface TagProps {
  children: React.ReactNode
  color?: string // 标签背景色，来自 GitHub label color
  onClick?: () => void
  className?: string
}
```

### 2. 样式实现

使用 styled-components，CSS 变量主题令牌：

- 胶囊样式：`border-radius: 999px`，`padding: 2px 12px`，字体 `12-13px`
- hover：`transform: scale(1.05)` + 字色与背景色互换
- transition: `180ms ease`
- 适配 `prefers-reduced-motion`

### 3. 颜色处理

- 接收 GitHub label 的 hex color 作为背景色
- 自动计算对比度，确保文字可读
- light/dark 模式自动切换

### 4. 响应式

- 移动端标签不换行，超出滚动
- 最小触摸目标 28px

## 依赖

- 零新依赖，仅使用 styled-components + CSS 变量

### `proposal.md`
# 标签组件

## 为什么做

首页 CardHeader 中标签部分直接内联渲染，缺少统一组件。新增 Tag 胶囊组件，与 GitHub 标签色彩保持一致，提供统一的视觉和交互体验。

## 做什么

- 在 `packages/components` 新增 Tag 组件，胶囊样式
- hover 时字体放大一个字号，字色与背景色互换
- 接入 styled-components + CSS 变量主题令牌，支持 light/dark 模式
- 替换 `HomeView.tsx` 中 CardHeader 的标签部分

## 覆盖范围

- 博客列表卡片标签
- 博客详情页标签
- 后续任意需要展示标签的场景

## 影响范围

- `packages/components/tag/` — 新增
- `packages/wuh.site.next/app/HomeView.tsx` — 替换标签渲染

## 不改什么

- 不改变标签数据获取方式
- 不新增第三方依赖

### `tasks.md`
# 任务拆分

## Phase 1 — Tag 组件实现

- [ ] T1: 创建 Tag 组件结构与 styled-components 样式
  - 涉及文件: `packages/components/tag/index.tsx`, `packages/components/tag/styles/index.ts`
  - 产出: 胶囊样式 Tag 组件，支持 color prop

- [ ] T2: 更新组件导出
  - 涉及文件: `packages/components/index.ts`
  - 产出: `@wuh.site/components` 可导入 Tag

## Phase 2 — 页面接入

- [ ] T3: 在 HomeView.tsx 中接入 Tag 组件
  - 涉及文件: `packages/wuh.site.next/app/HomeView.tsx`
  - 产出: 替换 CardHeader 内联标签为 Tag 组件

## Phase 3 — 验证

- [ ] T4: 验证 light/dark 模式与响应式
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证 hover 动画、标签颜色、移动端表现
