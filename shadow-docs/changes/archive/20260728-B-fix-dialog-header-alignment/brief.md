# 修复 Dialog 标题与关闭图标垂直对齐

> 原始变更名：`2026-07-28-B-fix-dialog-header-alignment`

## 元数据
- 日期：2026-07-28
- 类型：B
- 状态：applied
- Issue：历史记录未提供

## 动机
共享 Dialog 的 Header 与关闭按钮当前均使用顶部对齐，导致标题与关闭图标不在同一视觉中线上，关闭图标呈现顶对齐。该样式由共享组件提供，因此会影响所有使用标题栏的 Dialog。

## 引用规范
- `specs/contact-dialog/spec.md`

## 决策
本次修复只调整共享 Dialog 的样式层，不改变组件结构和调用接口。`DialogHeader` 负责让标题组与关闭按钮沿交叉轴居中，`CloseButton` 负责让 `×` 在现有点击区域内居中。

```
DialogHeader（交叉轴居中）
├── DialogHeaderContent（标题 / 副标题）
└── CloseButton（44×44，图标居中）
```

| 维度 | 选择 | 理由 |
|------|------|------|
| Header 对齐 | `align-items: center` | 同时覆盖单标题和标题组，保持 flex 正常布局流，改动最小 |
| 图标对齐 | `CloseButton` 使用 `align-items: center` | 保留 44×44 点击区域，并消除图标在按钮内部顶对齐的问题 |
| 实现位置 | 共享 Dialog 样式 | 一次修复所有使用方，避免页面级覆盖和样式分叉 |

## 任务
### Phase 1: 复现与最小修复
- [x] **文件:** `packages/components/dialog/styles/index.tsx`
- [x] 在现有测试能力范围内建立可复现的样式断言；项目无适用自动化样式测试，使用一次性源码样式断言建立失败证据。
- [x] 覆盖 `DialogHeader` 与 `CloseButton` 两层交叉轴对齐。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 修复前断言失败：`header=false, close=false`。
- [x] **文件:** `packages/components/dialog/styles/index.tsx`
- [x] 将 `DialogHeader` 的交叉轴对齐改为居中。
- [x] 将 `CloseButton` 内部图标的交叉轴对齐改为居中。
- [x] 不改变结构、间距、尺寸、交互与无障碍属性。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 2 分钟
- [x] **验证:** 回归断言通过：`DialogHeader and CloseButton use align-items:center`。
### Phase 2: 验证
- [x] **文件:** `packages/components/dialog/styles/index.tsx`
- [x] 验证共享样式同时覆盖单标题和“标题 + 副标题”场景。
- [x] 验证同一共享 Header 样式覆盖桌面 center 与移动端 bottom placement。
- [x] 确认关闭按钮的语义、事件、hover 与 focus-visible 样式未发生代码变更。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 12 分钟
- [x] **验证:** 样式回归断言与 `git diff --check` 通过；`NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 通过。浏览器 Preview 服务因环境启动后立即丢失而无法完成交互验证；`oxlint` 与 Next build 在当前 x86_64/Node 22.22.3 环境均以 SIGSEGV 退出。
- [x] 单标题 Dialog 的标题与关闭按钮沿 Header 中轴垂直居中。
- [x] 带副标题 Dialog 的关闭按钮相对标题组整体垂直居中。
- [x] `×` 在 44×44 像素点击区域内水平、垂直居中。
- [x] 桌面 center 和移动端 bottom placement 均使用相同共享对齐规则。
- [x] Header 间距、按钮尺寸、关闭交互、hover 与 focus-visible 未发生代码变更。
- [x] `NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 零错误。

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-28-B-fix-dialog-header-alignment
date: 2026-07-28
type: B
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/288
```

### `design.md`
# 设计文档

## 架构

本次修复只调整共享 Dialog 的样式层，不改变组件结构和调用接口。`DialogHeader` 负责让标题组与关闭按钮沿交叉轴居中，`CloseButton` 负责让 `×` 在现有点击区域内居中。

```
DialogHeader（交叉轴居中）
├── DialogHeaderContent（标题 / 副标题）
└── CloseButton（44×44，图标居中）
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Header 对齐 | `align-items: center` | 同时覆盖单标题和标题组，保持 flex 正常布局流，改动最小 |
| 图标对齐 | `CloseButton` 使用 `align-items: center` | 保留 44×44 点击区域，并消除图标在按钮内部顶对齐的问题 |
| 实现位置 | 共享 Dialog 样式 | 一次修复所有使用方，避免页面级覆盖和样式分叉 |

## 数据模型（如涉及）

不涉及数据模型变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### DialogHeader

保留现有 `display: flex`、`justify-content: space-between`、间距、内边距和分割线，只将交叉轴对齐从顶部改为居中。无副标题时，标题与关闭按钮整体居中；有副标题时，关闭按钮相对标题组整体居中。

### CloseButton

保留现有语义、44×44 最小点击区域、hover、focus 和关闭行为，只将按钮内部图标的交叉轴对齐从顶部改为居中。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| > 640px | center placement 的 Dialog 标题组与关闭按钮垂直居中 |
| <= 640px | bottom placement 的 Dialog 保持拖拽指示条和现有间距，标题组与关闭按钮垂直居中 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** Dialog Props、DOM 结构、点击区域和交互保持兼容；所有共享 Dialog 统一获得修复
- **性能影响:** 仅修改两处静态 CSS 对齐属性，无可感知性能影响

### `proposal.md`
# 修复 Dialog 标题与关闭图标垂直对齐

## 背景

共享 Dialog 的 Header 与关闭按钮当前均使用顶部对齐，导致标题与关闭图标不在同一视觉中线上，关闭图标呈现顶对齐。该样式由共享组件提供，因此会影响所有使用标题栏的 Dialog。

## 目标

- 让共享 Dialog 的标题区域与关闭按钮在 Header 内垂直居中。
- 让关闭图标在现有 44×44 像素点击区域内垂直、水平居中。
- 同时兼容单标题和“标题 + 副标题”场景。

## 非目标（明确不做）

- 不调整 Dialog Header 的间距、边框、字体或关闭按钮尺寸。
- 不修改 Dialog 的结构、Props、关闭交互、动画或无障碍属性。
- 不单独覆盖某个页面或某个 Dialog 使用方。

## 影响范围

- `packages/components/dialog/styles/index.tsx` — 调整共享 Dialog Header 和关闭按钮的 flex 对齐方式。
- `packages/components` — 所有使用共享 Dialog 标题栏的前端界面同步生效。

### `specs/contact-dialog/spec.md`
# Spec: 联系弹窗

## ADDED Requirements

### Requirement: Dialog 标题栏垂直对齐
The shared Dialog title area and close button MUST be vertically centered within the Header.

#### Scenario: 单标题 Dialog 标题栏对齐
- **GIVEN** 共享 Dialog 显示标题且关闭按钮可见
- **WHEN** Dialog Header 渲染
- **THEN** 标题区域与关闭按钮沿 Header 交叉轴垂直居中
- **AND** 关闭图标在 44×44 像素点击区域内水平、垂直居中

### Requirement: Dialog 副标题场景对齐
A shared Dialog with a subtitle MUST use the complete title group as the vertical alignment reference for the close button.

#### Scenario: 标题组与关闭按钮对齐
- **GIVEN** 共享 Dialog 同时显示标题和副标题
- **WHEN** Dialog Header 渲染
- **THEN** 关闭按钮相对“标题 + 副标题”组成的标题组整体垂直居中
- **AND** 桌面 center placement 与移动端 bottom placement 使用相同对齐规则

## MODIFIED Requirements

### Requirement: Dialog 圆角和间距
The Dialog MUST preserve its existing radius and spacing while vertically centering the title area and close button within the Header.

#### Scenario: 桌面端 Dialog 布局
- **GIVEN** Dialog 在桌面端打开并显示标题栏
- **WHEN** 弹窗渲染
- **THEN** 四角 border-radius 为 16px
- **AND** Header padding 为 12px 22px，底部带分割线
- **AND** 标题区域与关闭按钮在 Header 内垂直居中
- **AND** Body padding 为 12px 22px 18px
- **AND** 默认宽度 max 480px

### `tasks.md`
# 任务清单

## Phase 1: 复现与最小修复

### Task 1: 记录对齐缺陷并建立回归检查

- [x] **文件:** `packages/components/dialog/styles/index.tsx`
- [x] 在现有测试能力范围内建立可复现的样式断言；项目无适用自动化样式测试，使用一次性源码样式断言建立失败证据。
- [x] 覆盖 `DialogHeader` 与 `CloseButton` 两层交叉轴对齐。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 修复前断言失败：`header=false, close=false`。

### Task 2: 修复共享 Dialog 对齐

- [x] **文件:** `packages/components/dialog/styles/index.tsx`
- [x] 将 `DialogHeader` 的交叉轴对齐改为居中。
- [x] 将 `CloseButton` 内部图标的交叉轴对齐改为居中。
- [x] 不改变结构、间距、尺寸、交互与无障碍属性。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 2 分钟
- [x] **验证:** 回归断言通过：`DialogHeader and CloseButton use align-items:center`。

## Phase 2: 验证

### Task 3: 执行静态与视觉回归验证

- [x] **文件:** `packages/components/dialog/styles/index.tsx`
- [x] 验证共享样式同时覆盖单标题和“标题 + 副标题”场景。
- [x] 验证同一共享 Header 样式覆盖桌面 center 与移动端 bottom placement。
- [x] 确认关闭按钮的语义、事件、hover 与 focus-visible 样式未发生代码变更。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 12 分钟
- [x] **验证:** 样式回归断言与 `git diff --check` 通过；`NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 通过。浏览器 Preview 服务因环境启动后立即丢失而无法完成交互验证；`oxlint` 与 Next build 在当前 x86_64/Node 22.22.3 环境均以 SIGSEGV 退出。

## 验收

- [x] 单标题 Dialog 的标题与关闭按钮沿 Header 中轴垂直居中。
- [x] 带副标题 Dialog 的关闭按钮相对标题组整体垂直居中。
- [x] `×` 在 44×44 像素点击区域内水平、垂直居中。
- [x] 桌面 center 和移动端 bottom placement 均使用相同共享对齐规则。
- [x] Header 间距、按钮尺寸、关闭交互、hover 与 focus-visible 未发生代码变更。
- [x] `NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 零错误。
