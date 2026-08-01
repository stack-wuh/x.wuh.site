# 网站主题优化

> 原始变更名：`20260418_P_site-theme-optimization`

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
# 设计：网站主题优化

## 方案

### 1. Design Tokens

CSS 变量扩展为四分支:
- `light-wine` / `dark-wine`（100 元主题）
- `light-plain` / `dark-plain`（素雅主题）

```
--color-bg-primary: #7B5A5A (wine) / #FAFAF5 (plain)
--color-bg-card: #FFF3F0 (wine) / #FFFFFF (plain)
--color-primary: #C94A44
--color-accent: #E3B567
--font-size-hero: 56px
--font-size-title: 28-32px
--font-size-body: 18px
--space-8: 8px ... --space-80: 80px
--radius-card: 16-20px
--radius-pill: 999px
--shadow-default: 0 20px 40px rgba(0,0,0,0.08)
```

### 2. 页面布局

- 主容器宽度: 1100-1200px，居中
- 首页: 3 列卡片（桌面）/ 2 列（平板≤1024px）/ 1 列（手机≤768px）
- 文章详情: 正文宽度 780-820px，居中

### 3. TOC

- 桌面端: 右侧固定，scroll spy 高亮当前章节
- 移动端: 折叠/抽屉/置底卡片
- 键盘可导航

## 依赖

- 零新依赖

## 任务
### Phase 1 — Design Tokens
- [ ] T1: 定义 tokens 与 CSS 变量
- [ ] T2: 实现主题切换入口与持久化
### Phase 2 — 页面重构
- [ ] T3: 重构首页（Header + Hero + 精选模块 + 列表卡片）
- [ ] T4: 重构文章详情页（正文宽度 + 元信息 + 上下篇 + 评论空状态）
- [ ] T5: 实现 TOC
### Phase 3 — 组件对齐
- [ ] T6: 统一 Card/Tag/Button/Empty 组件样式
- [ ] T7: 响应式调试（四档断点）
- [ ] T8: 可访问性检查（对比度、focus、keyboard）
### Phase 4 — 验证
- [ ] T9: 全站验证

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 网站主题优化
change: site-theme-optimization
date: 2026-04-18
type: P
status: applied
```

### `design.md`
# 设计：网站主题优化

## 方案

### 1. Design Tokens

CSS 变量扩展为四分支:
- `light-wine` / `dark-wine`（100 元主题）
- `light-plain` / `dark-plain`（素雅主题）

```
--color-bg-primary: #7B5A5A (wine) / #FAFAF5 (plain)
--color-bg-card: #FFF3F0 (wine) / #FFFFFF (plain)
--color-primary: #C94A44
--color-accent: #E3B567
--font-size-hero: 56px
--font-size-title: 28-32px
--font-size-body: 18px
--space-8: 8px ... --space-80: 80px
--radius-card: 16-20px
--radius-pill: 999px
--shadow-default: 0 20px 40px rgba(0,0,0,0.08)
```

### 2. 页面布局

- 主容器宽度: 1100-1200px，居中
- 首页: 3 列卡片（桌面）/ 2 列（平板≤1024px）/ 1 列（手机≤768px）
- 文章详情: 正文宽度 780-820px，居中

### 3. TOC

- 桌面端: 右侧固定，scroll spy 高亮当前章节
- 移动端: 折叠/抽屉/置底卡片
- 键盘可导航

## 依赖

- 零新依赖

### `proposal.md`
# 网站主题优化

## 为什么做

博客整体视觉统一性、可读性和交互体验需要提升。需要统一 design tokens（配色/字体/间距/阴影/圆角），覆盖主要页面和组件。

## 做什么

### 主题系统
- 两套主题切换："100 元主题" + "素雅主题"
- 通过 CSS variables 实现，localStorage 持久化
- 切换入口在 Header 中

### 视觉规范
- 配色: 100 元主题（#7B5A5A 深背景 / #FFF3F0 卡片 / #C94A44 主色 / #E3B567 强调）
- 字体: Hero 56px, 模块标题 28-32px, 正文 18px, metadata 14-16px
- 间距: 8pt 系统（8/16/24/32/40/64/80）
- 圆角: 卡片 16-20px, 标签 999px
- 阴影: 默认 0 20px 40px rgba(0,0,0,0.08), hover 增强

### 覆盖范围
- 页面: 首页 Hero、精选博客、文章详情页
- 组件: 信息块、标签、按钮、分享、导航、评论空状态
- 文章 TOC: 桌面端右侧固定，移动端折叠
- 响应式: >1280 / 1024-1279 / 768-1023 / <768 四档
- 可访问性: 对比度 ≥ 4.5:1、focus-visible、键盘导航

## 影响范围

- `packages/components/themes/` — design tokens 扩展
- `packages/wuh.site.next/app/` — 页面布局与样式重构

### `tasks.md`
# 任务拆分

## Phase 1 — Design Tokens

- [ ] T1: 定义 tokens 与 CSS 变量
  - 涉及文件: `packages/components/themes/tokens.ts`, `CssVariableStyles.tsx`
  - 产出: 两套主题四分支 CSS 变量

- [ ] T2: 实现主题切换入口与持久化
  - 涉及文件: `packages/components/themes/ThemeProvider.tsx`
  - 产出: localStorage 持久化 + 跟随系统选项

## Phase 2 — 页面重构

- [ ] T3: 重构首页（Header + Hero + 精选模块 + 列表卡片）
  - 涉及文件: `packages/wuh.site.next/app/HomeView.tsx`, styles

- [ ] T4: 重构文章详情页（正文宽度 + 元信息 + 上下篇 + 评论空状态）
  - 涉及文件: `packages/wuh.site.next/app/post/PostView.tsx`

- [ ] T5: 实现 TOC
  - 涉及文件: `packages/wuh.site.next/app/post/TableOfContents.tsx`

## Phase 3 — 组件对齐

- [ ] T6: 统一 Card/Tag/Button/Empty 组件样式
- [ ] T7: 响应式调试（四档断点）
- [ ] T8: 可访问性检查（对比度、focus、keyboard）

## Phase 4 — 验证

- [ ] T9: 全站验证
  - `pnpm --filter @wuh.site/next lint && pnpm --filter @wuh.site/next build`
  - 手动回归所有页面 + 两套主题切换 + 四档断点
