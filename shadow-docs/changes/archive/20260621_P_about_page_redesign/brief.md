# About 页面重设计

> 原始变更名：`20260621_P_about_page_redesign`

## 元数据
- 日期：2026-06-21
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
现有 About 页面是纯静态页面，6 个 section 按固定顺序排列。视觉上偏向简洁学术风，存在信息重复、层级不够清晰的问题。

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
4 个 section 纵向排列，关于我区块内嵌左侧装饰时间线：

```
Hero → 关于我(合并) → 热力图 → 时间线
```

## 任务
### Phase 1：历史任务
- [x] **文件:** `packages/wuh.site.next/app/about/styles.ts`
- [x] PageRoot 缩小到 640px，增大 padding
- [x] Hero 样式：HeroLabel（accent-color）、HeroTitle（serif）、HeroSub
- [x] SectionHeader + SectionLabel 组件
- [x] AboutTimeline + TimelineTrack + TimelineDot（桌面端 2px 竖线，移动端 hidden）
- [x] Profile 样式：Avatar（56px 圆形渐变）、ProfileRow、Bio（serif 15px）
- [x] PlatformCard：浅暖色背景 + hover 效果 + 暗色模式
- [x] ContactRow + ContactItem
- [x] MetricRow + MetricItem + MetricSep + MetricLabel
- [x] Heatmap 样式：HeatmapGrid、Cell、ChipButton、Legend
- [x] Timeline 样式：TimelineRow（hover 左移）、TimelineDate、TimelineSelect
- [x] **类型检查:** `npx tsc --noEmit`
- [x] **文件:** `packages/wuh.site.next/app/about/data.ts`
- [x] metrics 去掉 `detail` 字段，仅保留 `label` 和 `value`
- [x] platformStories 精简 description
- [x] **类型检查:** `npx tsc --noEmit`
- [x] **文件:** `packages/wuh.site.next/app/about/page.tsx`
- [x] 4-section 结构：Hero → 关于我(合并) → 热力图 → 时间线
- [x] 关于我内嵌 Profile + Platforms + Contact + Metrics
- [x] TimelineTrack 装饰线含 3 个 TimelineDot
- [x] 热力图含 FilterGroup + HeatmapGrid + Legend
- [x] 时间线含 TimelineSelect + TimelineList
- [x] **类型检查:** `npx tsc --noEmit`
- [x] 删除 `HeatmapSection.tsx`
- [x] 删除 `PlatformSection.tsx`
- [x] 删除 `TimelineSection.tsx`
- [x] 删除 `OrnamentDivider.tsx`
- [x] grep 确认无残留引用
- [x] `npx tsc --noEmit` — 零错误
- [x] About 目录从 9 个文件精简到 4 个（+ 空 md）

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: about-page-redesign
date: 2026-06-21
type: P
status: archived
```

### `design.md`
# 设计文档

## 架构

4 个 section 纵向排列，关于我区块内嵌左侧装饰时间线：

```
Hero → 关于我(合并) → 热力图 → 时间线
```

## 配色

沿用 `data-theme='plain'` 色板，不引入新变量：
- 主色：`--primary-color: #A87348`
- 背景：`--background-color: #F2EDE4`
- 强调：`--accent-color: #C89060`

## 排版

| 层级 | 字体 | 字重 | 字号 |
|------|------|------|------|
| Hero 标签 | `--font-sans` | 400 | 12px, letter-spacing: 3px |
| Hero 标题 | `--font-serif` | 700 | 28px |
| Hero 副标题 | `--font-sans` | 400 | 14px |
| Section 标签 | `--font-sans` | 500 | 11px, letter-spacing: 1.5px |
| 正文 | `--font-serif` | 400 | 15px, line-height: 1.9 |
| 标签/元数据 | `--font-sans` | 400 | 11px |
| 时间线条目 | `--font-sans` | 400 | 13px |

间距：Hero → 48px，Section 间 → 40px，装饰线 → 左 24px，卡片 padding → 16px

## 组件

### Hero
左对齐，无装饰。"ABOUT" 标签 → 标题 → 副标题。去掉原有 3 个指标。

### 关于我（合并）
左侧装饰时间线（2px 竖线 + 3 个圆点），右侧自上而下：
1. 个人（头像 + 名字 + 简介 + 标签）
2. 平台（3 个横向卡片，浅暖色背景 + 8px 圆角）
3. 联系（图标行，24px 间距）
4. 指标（数值 + 标签，顶部分隔线）

### 热力图
Section 标题 + 筛选器 ChipButton + 方格矩阵 + 图例。桌面 7 列，移动端横向滚动。

### 时间线
Section 标题 + 时间范围下拉 + 日期-标题行。日期左置 48px，右对齐。hover 左移 + 高亮。

## 响应式

| 断点 | 行为 |
|------|------|
| >= 768px | 完整布局，装饰线可见，平台卡片横向，max-width: 640px |
| < 768px | 装饰线 hidden，平台卡片纵向堆叠，热力图横向滚动，padding 缩小 |

## 接口兼容性

- 路由不变：`/about`
- 数据源不变：仍从 `data.ts` 硬编码读取
- layout.tsx 不变：metadata 保持不变

### `proposal.md`
# About 页面重设计

## 背景

现有 About 页面是纯静态页面，6 个 section 按固定顺序排列。视觉上偏向简洁学术风，存在信息重复、层级不够清晰的问题。

## 目标

- 视觉风格：保持简洁学术底子，注入温润人文气质（沿用 `plain` 主题色板）
- 内容结构：合并个人简介+平台+联系为"关于我"，信息层级重新排布为 Hero → 关于我 → 热力图 → 时间线
- 响应式：桌面端 Timeline 装饰线叙事，移动端退化为干净列表
- 配色不引入新变量，排版区分 Serif（叙事）和 Sans（信息）

## 影响范围

- `packages/wuh.site.next/app/about/styles.ts` — 完全重写
- `packages/wuh.site.next/app/about/data.ts` — 精简 metrics 和 platformStories
- `packages/wuh.site.next/app/about/page.tsx` — 重写为 4-section 结构
- 删除 `HeatmapSection.tsx`、`PlatformSection.tsx`、`TimelineSection.tsx`、`OrnamentDivider.tsx`
- `app/about/layout.tsx` — 不变

### `tasks.md`
# 任务清单

## Task 1: 重写 styles.ts

- [x] **文件:** `packages/wuh.site.next/app/about/styles.ts`
- [x] PageRoot 缩小到 640px，增大 padding
- [x] Hero 样式：HeroLabel（accent-color）、HeroTitle（serif）、HeroSub
- [x] SectionHeader + SectionLabel 组件
- [x] AboutTimeline + TimelineTrack + TimelineDot（桌面端 2px 竖线，移动端 hidden）
- [x] Profile 样式：Avatar（56px 圆形渐变）、ProfileRow、Bio（serif 15px）
- [x] PlatformCard：浅暖色背景 + hover 效果 + 暗色模式
- [x] ContactRow + ContactItem
- [x] MetricRow + MetricItem + MetricSep + MetricLabel
- [x] Heatmap 样式：HeatmapGrid、Cell、ChipButton、Legend
- [x] Timeline 样式：TimelineRow（hover 左移）、TimelineDate、TimelineSelect
- [x] **类型检查:** `npx tsc --noEmit`

## Task 2: 更新 data.ts

- [x] **文件:** `packages/wuh.site.next/app/about/data.ts`
- [x] metrics 去掉 `detail` 字段，仅保留 `label` 和 `value`
- [x] platformStories 精简 description
- [x] **类型检查:** `npx tsc --noEmit`

## Task 3: 重写 page.tsx

- [x] **文件:** `packages/wuh.site.next/app/about/page.tsx`
- [x] 4-section 结构：Hero → 关于我(合并) → 热力图 → 时间线
- [x] 关于我内嵌 Profile + Platforms + Contact + Metrics
- [x] TimelineTrack 装饰线含 3 个 TimelineDot
- [x] 热力图含 FilterGroup + HeatmapGrid + Legend
- [x] 时间线含 TimelineSelect + TimelineList
- [x] **类型检查:** `npx tsc --noEmit`

## Task 4: 删除旧组件

- [x] 删除 `HeatmapSection.tsx`
- [x] 删除 `PlatformSection.tsx`
- [x] 删除 `TimelineSection.tsx`
- [x] 删除 `OrnamentDivider.tsx`
- [x] grep 确认无残留引用

## Task 5: 构建验证

- [x] `npx tsc --noEmit` — 零错误
- [x] About 目录从 9 个文件精简到 4 个（+ 空 md）
