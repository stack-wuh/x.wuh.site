# 修复 About 综合热力图布局错位与裁切

> 原始变更名：`2026-07-28-B-fix-heatmap-layout`

## 元数据
- 日期：2026-07-28
- 类型：B
- 状态：applied
- Issue：历史记录未提供

## 动机
About 综合热力图虽然已统一站点活动与 GitHub 贡献，但当前布局存在三个可见缺陷：热力图区域出现横向滚动条，月份标题与周列及星期标题没有共享同一坐标，第一行及边缘单元格的 Tooltip 会被容器裁切。

根因集中在 Heatmap 组件布局：网格使用固定 12px 单元格并设置 `overflow-x: auto`；月份位置通过 `weekIndex * 15` 和独立的 `margin-left` 手工计算；Tooltip 固定向上、单行展示，并位于带溢出裁切的网格容器内。

## 引用规范
- `specs/about-activity/spec.md`

## 决策
修复限定在共享 Heatmap 组件的布局层。月份标题、星期标题和 53 个周列改为使用同一套 CSS Grid 轨道变量，不再由多个容器分别计算偏移。单元格尺寸由容器宽度决定并设置上下限，保证 365 天在可用宽度内完整显示。

```text
Heatmap Wrapper
├── MonthRow: [星期标签轨道] + [53 个共享周轨道]
├── Grid
│   └── 7 × Row: [星期标签轨道] + [53 个共享周轨道]
└── Legend

Tooltip
├── 默认向上
├── 首行向下
├── 左边缘向右对齐
└── 右边缘向左对齐
```

| 维度 | 选择 | 理由 |
|------|------|------|
| 主布局 | CSS Grid 共享轨道 | 月份、星期和格子使用同一坐标来源，消除手工偏移漂移 |
| 单元格尺寸 | 基于容器宽度的响应式尺寸并设置上下限 | 完整展示 53 周，避免内部滚动条和页面溢出 |
| 月份定位 | 使用周索引对应的 Grid column | 不再使用 `weekIndex * 15` 像素定位 |
| Tooltip | 多行限宽并按行列边缘切换方向 | 避免首行向上溢出和左右边缘裁切 |
| 兼容方式 | 保持 Heatmap 数据与公开 Props 不变 | 避免影响既有 GitHub Heatmap 调用方 |

## 任务
### Phase 1: 建立布局回归
- [x] **文件:** `packages/components/heatmap/heatmap-layout.test.mjs`
- [x] 增加网格不使用横向滚动的失败断言。
- [x] 增加月份、星期和周列共享轨道定义的失败断言。
- [x] **预计耗时:** 25 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** 修复前 0/2 通过；无滚动与共享轨道断言按预期失败。
- [x] **文件:** `packages/components/heatmap/heatmap-layout.test.mjs`
- [x] 增加首行 Tooltip 向下、左右边缘内向对齐和多行限宽的失败断言。
- [x] 保留 hover、click、focus 交互断言。
- [x] **预计耗时:** 25 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 修复前 0/2 通过；Tooltip 方向与换行断言按预期失败。
### Phase 2: 最小布局修复
- [x] **文件:** `packages/components/heatmap/index.tsx`、`packages/components/heatmap/styles.tsx`
- [x] 使用同一 CSS Grid 轨道渲染月份、星期和 53 周数据。
- [x] 移除 `weekIndex * 15` 和独立 `margin-left` 手工偏移。
- [x] 使用响应式单元格尺寸完整展示 365 天，并移除组件内部横向滚动。
- [x] **预计耗时:** 45 分钟
- [x] **实际耗时:** 18 分钟
- [x] **验证:** 布局回归测试 2/2 通过，Oxlint 与 `git diff --check` 通过。
- [x] **文件:** `packages/components/heatmap/index.tsx`、`packages/components/heatmap/styles.tsx`
- [x] 根据行列边缘状态调整 Tooltip 垂直方向和水平对齐。
- [x] 为综合明细设置最大宽度、换行和行高。
- [x] 保持 hover、click、focus 与 `aria-label` 行为。
- [x] **预计耗时:** 35 分钟
- [x] **实际耗时:** 12 分钟
- [x] **验证:** Tooltip 回归测试 2/2 通过，原有交互事件与可访问名称保留。
### Phase 3: 页面验证
- [ ] **文件:** 无生产文件修改
- [ ] 在 About 页面验证桌面、平板和移动视口。
- [ ] 检查加载态与真实数据态没有布局跳变。
- [ ] 运行相关测试、Oxlint、类型检查和浏览器控制台检查。
- [ ] **预计耗时:** 30 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 320px、375px、768px、1280px 下无横向溢出，标题和 Tooltip 行为符合规范。
- [ ] Heatmap 组件内部和 About 页面均不出现由热力图导致的横向滚动条。
- [ ] 月份标题与对应周列准确对齐。
- [ ] 星期标题与对应日期行准确对齐。
- [ ] 最近 365 天数据在桌面和移动端完整展示。
- [ ] 首行、末行及左右边缘 Tooltip 内容完整可见。
- [ ] Tooltip 支持综合活动明细换行，hover、click、focus 和可访问名称保持有效。
- [ ] 相关测试、Oxlint、TypeScript 类型检查和真实页面验证通过。

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-28-B-fix-heatmap-layout
date: 2026-07-28
type: B
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/291
```

### `design.md`
# 设计文档

## 架构

修复限定在共享 Heatmap 组件的布局层。月份标题、星期标题和 53 个周列改为使用同一套 CSS Grid 轨道变量，不再由多个容器分别计算偏移。单元格尺寸由容器宽度决定并设置上下限，保证 365 天在可用宽度内完整显示。

```text
Heatmap Wrapper
├── MonthRow: [星期标签轨道] + [53 个共享周轨道]
├── Grid
│   └── 7 × Row: [星期标签轨道] + [53 个共享周轨道]
└── Legend

Tooltip
├── 默认向上
├── 首行向下
├── 左边缘向右对齐
└── 右边缘向左对齐
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 主布局 | CSS Grid 共享轨道 | 月份、星期和格子使用同一坐标来源，消除手工偏移漂移 |
| 单元格尺寸 | 基于容器宽度的响应式尺寸并设置上下限 | 完整展示 53 周，避免内部滚动条和页面溢出 |
| 月份定位 | 使用周索引对应的 Grid column | 不再使用 `weekIndex * 15` 像素定位 |
| Tooltip | 多行限宽并按行列边缘切换方向 | 避免首行向上溢出和左右边缘裁切 |
| 兼容方式 | 保持 Heatmap 数据与公开 Props 不变 | 避免影响既有 GitHub Heatmap 调用方 |

## 数据模型（如涉及）

不涉及 DTO 或接口数据变更。组件内部可根据 `rowIndex`、`colIndex` 和总周数生成仅用于布局的边缘状态，不向调用方增加必填字段。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### Heatmap 网格

`MonthRow` 与七个日期行共享星期标签宽度、周列数量、列间距和单元格尺寸变量。月份标签放入对应月份首次出现的周列，不再使用绝对像素偏移。网格本身不设置横向滚动；容器通过 `min-width: 0` 和受约束的轨道尺寸避免撑破父布局。

### TooltipCell

保留 hover、focus 和 click 状态。Tooltip 文本设置最大宽度、正常换行和可读行高。首行单元格向下展开，其他行默认向上；左侧和右侧若干列分别采用边缘对齐，避免水平超出组件。Tooltip 层级高于热力图内容，且其祖先不使用会裁切纵向内容的 overflow。

### Loading 状态

Skeleton 使用与真实数据相同的共享轨道和响应式尺寸，防止加载完成前后月份、星期或整体宽度跳变。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | 53 周完整铺满可用宽度；单元格使用上限尺寸；Tooltip 优先单行或少量换行 |
| < 768px | 53 周继续完整展示；单元格缩小到可读下限；不出现内部或页面横向滚动；Tooltip 使用限宽多行布局 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** Heatmap Props、数据结构、颜色和交互入口保持不变
- **性能影响:** 仅替换静态布局计算和少量边缘状态判断，无可感知性能影响

### `proposal.md`
# 修复 About 综合热力图布局错位与裁切

## 背景

About 综合热力图虽然已统一站点活动与 GitHub 贡献，但当前布局存在三个可见缺陷：热力图区域出现横向滚动条，月份标题与周列及星期标题没有共享同一坐标，第一行及边缘单元格的 Tooltip 会被容器裁切。

根因集中在 Heatmap 组件布局：网格使用固定 12px 单元格并设置 `overflow-x: auto`；月份位置通过 `weekIndex * 15` 和独立的 `margin-left` 手工计算；Tooltip 固定向上、单行展示，并位于带溢出裁切的网格容器内。

## 目标

- Heatmap 在桌面端和移动端均不产生组件内部横向滚动条或页面横向溢出。
- 月份标题、星期标题和日期单元格使用同一套网格轨道，保持准确对齐。
- 365 天数据完整展示，单元格尺寸根据可用宽度响应式调整。
- 首行、末行及左右边缘单元格的 Tooltip 完整可见，并允许综合活动明细合理换行。
- 保留 hover、click、focus 交互和既有 GitHub Heatmap 调用兼容性。

## 非目标（明确不做）

- 不修改综合活动接口、DTO、聚合算法或等级计算。
- 不改变热力图颜色方案、数据范围和明细字段。
- 不增加月份分页、日期区间切换或新的图表依赖。
- 不调整 About 页面其他板块布局。

## 影响范围

- `packages/components/heatmap/index.tsx` — 月份定位和 Tooltip 边缘方向语义。
- `packages/components/heatmap/styles.tsx` — 共享网格轨道、响应式单元格和 Tooltip 防裁切布局。
- Heatmap 既有测试目录或最小布局回归测试 — 固化无滚动、轨道对齐和 Tooltip 可见性。

### `specs/about-activity/spec.md`
# Spec: Heatmap 响应式布局

## MODIFIED Requirements

### Requirement: 展示单一综合热力图
About 页面 MUST 在可用宽度内完整展示单一综合热力图，且布局标题与数据轨道准确对齐。

#### Scenario: 不同视口展示完整热力图
- **GIVEN** About 页面加载到最近 365 天统一活动数据
- **WHEN** 页面在桌面、平板或移动视口渲染综合热力图
- **THEN** 热力图完整展示 53 个周列且不产生组件内部横向滚动条
- **AND** 热力图不得导致页面横向溢出
- **AND** 月份标题与对应周列使用同一坐标轨道
- **AND** 星期标题与对应日期行准确对齐

### Requirement: Heatmap 组件支持多种数据语义
Heatmap 组件 MUST 在保持既有调用兼容的同时，提供不会被边界裁切的活动详情。

#### Scenario: 查看边缘单元格详情
- **GIVEN** Heatmap 渲染包含综合活动明细的日期单元格
- **WHEN** 用户 hover、点击或键盘聚焦首行、末行或左右边缘单元格
- **THEN** Tooltip 根据单元格位置向组件内部展开
- **AND** Tooltip 使用受限宽度和多行文本完整显示日期、总量及分类明细
- **AND** Tooltip 不被热力图容器裁切
- **AND** 单元格继续提供可访问名称和键盘焦点

## ADDED Requirements

### Requirement: Heatmap 加载态保持稳定布局
Heatmap 加载态 MUST 与真实数据态使用相同的响应式轨道。

#### Scenario: 数据从加载态切换到成功态
- **GIVEN** About 页面正在加载综合活动数据
- **WHEN** Heatmap 从 Skeleton 切换到 365 天真实数据
- **THEN** 星期轨道、周列宽度和整体占用宽度保持一致
- **AND** 页面不会因状态切换出现横向滚动或可见布局跳变

### `tasks.md`
# 任务清单

## Phase 1: 建立布局回归

### Task 1: 固化共享轨道与无滚动要求

- [x] **文件:** `packages/components/heatmap/heatmap-layout.test.mjs`
- [x] 增加网格不使用横向滚动的失败断言。
- [x] 增加月份、星期和周列共享轨道定义的失败断言。
- [x] **预计耗时:** 25 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** 修复前 0/2 通过；无滚动与共享轨道断言按预期失败。

### Task 2: 固化 Tooltip 防裁切要求

- [x] **文件:** `packages/components/heatmap/heatmap-layout.test.mjs`
- [x] 增加首行 Tooltip 向下、左右边缘内向对齐和多行限宽的失败断言。
- [x] 保留 hover、click、focus 交互断言。
- [x] **预计耗时:** 25 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 修复前 0/2 通过；Tooltip 方向与换行断言按预期失败。

## Phase 2: 最小布局修复

### Task 3: 统一月份、星期和周列轨道

- [x] **文件:** `packages/components/heatmap/index.tsx`、`packages/components/heatmap/styles.tsx`
- [x] 使用同一 CSS Grid 轨道渲染月份、星期和 53 周数据。
- [x] 移除 `weekIndex * 15` 和独立 `margin-left` 手工偏移。
- [x] 使用响应式单元格尺寸完整展示 365 天，并移除组件内部横向滚动。
- [x] **预计耗时:** 45 分钟
- [x] **实际耗时:** 18 分钟
- [x] **验证:** 布局回归测试 2/2 通过，Oxlint 与 `git diff --check` 通过。

### Task 4: 修复 Tooltip 边缘可见性

- [x] **文件:** `packages/components/heatmap/index.tsx`、`packages/components/heatmap/styles.tsx`
- [x] 根据行列边缘状态调整 Tooltip 垂直方向和水平对齐。
- [x] 为综合明细设置最大宽度、换行和行高。
- [x] 保持 hover、click、focus 与 `aria-label` 行为。
- [x] **预计耗时:** 35 分钟
- [x] **实际耗时:** 12 分钟
- [x] **验证:** Tooltip 回归测试 2/2 通过，原有交互事件与可访问名称保留。

## Phase 3: 页面验证

### Task 5: 验证桌面和移动布局

- [ ] **文件:** 无生产文件修改
- [ ] 在 About 页面验证桌面、平板和移动视口。
- [ ] 检查加载态与真实数据态没有布局跳变。
- [ ] 运行相关测试、Oxlint、类型检查和浏览器控制台检查。
- [ ] **预计耗时:** 30 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 320px、375px、768px、1280px 下无横向溢出，标题和 Tooltip 行为符合规范。

## 验收

- [ ] Heatmap 组件内部和 About 页面均不出现由热力图导致的横向滚动条。
- [ ] 月份标题与对应周列准确对齐。
- [ ] 星期标题与对应日期行准确对齐。
- [ ] 最近 365 天数据在桌面和移动端完整展示。
- [ ] 首行、末行及左右边缘 Tooltip 内容完整可见。
- [ ] Tooltip 支持综合活动明细换行，hover、click、focus 和可访问名称保持有效。
- [ ] 相关测试、Oxlint、TypeScript 类型检查和真实页面验证通过。
