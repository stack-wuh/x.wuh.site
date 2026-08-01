# 修复 About 留言板入口 Hover 可读性与过渡

> 原始变更名：`2026-07-26-B-fix-guestbook-trigger-hover`

## 元数据
- 日期：2026-07-26
- 类型：B
- 状态：proposed
- Issue：历史记录未提供

## 动机
About 页面“留言板”入口在鼠标移入后会切换背景，但标题、预览文案和进入提示未与背景状态形成稳定的对比关系，部分主题下文字难以辨认。当前背景与边框虽声明了短过渡，文字状态没有统一的渐进节奏，导致各视觉元素变化不同步，交互显得突兀。

## 引用规范
- `specs/guestbook-barrage/spec.md`

## 决策
本变更仅调整 About 页面留言板入口相关 styled-components，不改变 `GuestbookBarrageDialog` 的组件结构、状态或数据流。入口容器负责纸张基底、暖色渐变和边框状态，标题、预览文字与 CTA 分别使用现有语义颜色令牌，并共享统一过渡时长。

```text
GuestbookBarrageDialog
└── GuestbookTrigger
    ├── GuestbookTriggerAvatars（保持不变）
    ├── GuestbookTriggerCopy
    │   ├── GuestbookTriggerLabel
    │   ├── GuestbookTriggerTitle
    │   └── GuestbookTriggerPreview
    └── GuestbookTriggerCta
```

| 维度 | 选择 | 理由 |
|------|------|------|
| Hover 视觉 | 纸张轻染 | 保留 About 页层级，仅增强暖色渐变，不以深底抢占注意力 |
| 颜色来源 | 现有 CSS 语义令牌与 `color-mix()` | 自动适配主题，避免硬编码造成新的对比问题 |
| 动画节奏 | `220ms ease` | 足以感知渐进变化，又不会拖慢入口响应 |
| 动画范围 | 背景、边框、标题、预览文字、CTA | 所有视觉反馈同步，消除当前割裂感 |
| 键盘状态 | `:focus-visible` 提供等价状态 | 保证键盘用户获得与 Hover 一致的入口反馈 |
| 减少动态 | `prefers-reduced-motion: reduce` 下禁用过渡 | 保留最终视觉状态，不强制播放动画 |

## 任务
### Phase 1: 复现与最小修复
- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs`
- [x] 复现 Hover 背景变化后文字对比与过渡不同步的问题。
- [x] 断言入口使用纸张轻染状态、统一 `220ms ease`，并包含键盘 Focus 与减少动态规则。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** 修复前 2 项测试均因缺少目标规则而失败
- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 保持浅色纸张基底，通过低强度暖色渐变实现 Hover / Focus 反馈。
- [x] 为背景、边框、标题、预览文字和 CTA 配置统一的 `220ms ease` 过渡。
- [x] 使用语义颜色令牌保证亮色、暗色主题下文字清晰可读。
- [x] 增加 `prefers-reduced-motion: reduce` 降级规则。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 12 分钟
- [x] **验证:** 新增回归测试 2/2 通过
### Phase 2: 语法验收
- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 审查亮色和暗色主题的默认、Hover、`focus-visible` 状态规则。
- [x] 审查背景、边框与三层文字的同步过渡声明和目标色切换。
- [x] 确认未修改移动布局、入口点击和留言弹窗实现。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 独立语法与范围审查；发现并修复文字仅声明 transition、未切换颜色的问题
- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`、`packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs`
- [x] 执行 Node 语法检查、相关测试和 Git diff 空白检查。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** `node --check packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && node --test packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && git diff --check`
- [x] Hover 后标题、预览文案和 CTA 使用高对比语义颜色。
- [x] 入口保持浅色纸张基底，不切换为深色实底。
- [x] 背景、边框、标题、预览文字和 CTA 使用统一的 `220ms ease` 过渡。
- [x] `focus-visible` 获得等价视觉反馈和清晰焦点轮廓。
- [x] 减少动态偏好下取消过渡但保留状态反馈。
- [x] 头像、文案、布局、点击行为与弹窗逻辑未修改。
- [x] 相关测试 2/2 通过且 `git diff --check` 零错误。

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-26-B-fix-guestbook-trigger-hover
date: 2026-07-26
type: B
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/277
```

### `design.md`
# 设计文档

## 架构

本变更仅调整 About 页面留言板入口相关 styled-components，不改变 `GuestbookBarrageDialog` 的组件结构、状态或数据流。入口容器负责纸张基底、暖色渐变和边框状态，标题、预览文字与 CTA 分别使用现有语义颜色令牌，并共享统一过渡时长。

```text
GuestbookBarrageDialog
└── GuestbookTrigger
    ├── GuestbookTriggerAvatars（保持不变）
    ├── GuestbookTriggerCopy
    │   ├── GuestbookTriggerLabel
    │   ├── GuestbookTriggerTitle
    │   └── GuestbookTriggerPreview
    └── GuestbookTriggerCta
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Hover 视觉 | 纸张轻染 | 保留 About 页层级，仅增强暖色渐变，不以深底抢占注意力 |
| 颜色来源 | 现有 CSS 语义令牌与 `color-mix()` | 自动适配主题，避免硬编码造成新的对比问题 |
| 动画节奏 | `220ms ease` | 足以感知渐进变化，又不会拖慢入口响应 |
| 动画范围 | 背景、边框、标题、预览文字、CTA | 所有视觉反馈同步，消除当前割裂感 |
| 键盘状态 | `:focus-visible` 提供等价状态 | 保证键盘用户获得与 Hover 一致的入口反馈 |
| 减少动态 | `prefers-reduced-motion: reduce` 下禁用过渡 | 保留最终视觉状态，不强制播放动画 |

## 数据模型（如涉及）

不涉及数据模型变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### GuestbookTrigger

默认状态继续使用浅色纸张基底和低浓度暖色渐变。Hover 或 `focus-visible` 时，仅适度提高暖色渐变浓度与覆盖范围，并轻微增强边框；不切换为深色实底，不使用位移、缩放或强阴影。

背景和边框使用 `220ms ease`。为避免复合 `background` 在不同浏览器中出现跳变，可优先通过伪元素承载 Hover 渐变并过渡其透明度；纸张底色保持稳定。

### GuestbookTriggerTitle / Preview / Cta

三个文本层级使用现有语义文字令牌，在 Hover / Focus 状态下切换到经过验证的高对比语义色。它们与容器共享 `220ms ease` 的颜色过渡，避免背景先变、文字后变或瞬间跳色。

`GuestbookTriggerLabel` 已使用强调色，可保持不变；头像、布局、文案和图标尺寸不调整。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| > 520px | 保持三列入口布局，Hover 与键盘 Focus 使用纸张轻染反馈 |
| <= 520px | 保持现有两列布局；支持悬停的设备使用同一反馈，触摸点击行为不变 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** DOM 结构、按钮语义、文案、点击行为及弹窗逻辑保持不变
- **性能影响:** 仅增加少量 CSS 状态与透明度/颜色过渡，影响可忽略

### `proposal.md`
# 修复 About 留言板入口 Hover 可读性与过渡

## 背景

About 页面“留言板”入口在鼠标移入后会切换背景，但标题、预览文案和进入提示未与背景状态形成稳定的对比关系，部分主题下文字难以辨认。当前背景与边框虽声明了短过渡，文字状态没有统一的渐进节奏，导致各视觉元素变化不同步，交互显得突兀。

## 目标

- 采用已确认的“纸张轻染”方案，Hover 时保持浅色纸张基底，仅适度增强暖色渐变与边框。
- 确保标题、预览文案和 CTA 在亮色、暗色主题下始终清晰可读。
- 背景、边框、标题、预览文字和 CTA 使用统一的 `220ms ease` 过渡。
- 为键盘聚焦提供等价的视觉反馈，并在减少动态偏好下取消过渡。

## 非目标（明确不做）

- 不修改留言板弹窗、消息流、输入框或提交逻辑。
- 不调整留言板入口的文案、头像、布局和点击行为。
- 不采用深色反转或强烈酒红光晕方案。
- 不修改 About 页面其他卡片或入口的交互样式。

## 影响范围

- `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts` — 修复留言板入口的 Hover / Focus 背景、文字对比度和同步过渡。
- `openspec/specs/guestbook-barrage/spec.md` — 归档后补充留言板入口可读性与动效规范。

### `specs/guestbook-barrage/spec.md`
# Spec: 留言板入口交互

## ADDED Requirements

### Requirement: 留言板入口 Hover 保持文字可读

留言板入口的交互状态必须保持纸张风格与文字可读性。

#### Scenario: 用户悬停或聚焦留言板入口
- **GIVEN** 用户在 About 页面看到留言板入口
- **WHEN** 指针悬停在入口上，或入口获得 `focus-visible`
- **THEN** 入口保持浅色纸张基底，并以低强度暖色渐变增强背景层次
- **AND** 标题、预览文案和 CTA 在亮色与暗色主题下保持清晰可读
- **AND** 入口不切换为深色实底，不使用位移、缩放或强阴影反馈

### Requirement: 留言板入口状态同步渐进

留言板入口的背景、边框与文字反馈必须使用一致的过渡节奏。

#### Scenario: 入口状态发生变化
- **GIVEN** 留言板入口正在进入或离开 Hover / `focus-visible` 状态
- **WHEN** 背景、边框和文字状态发生变化
- **THEN** 背景、边框、标题、预览文字和 CTA 使用统一的 `220ms ease` 过渡
- **AND** 各视觉元素不会出现不同步跳变
- **AND** 入口的布局和点击区域不会因状态变化发生偏移

### Requirement: 留言板入口尊重减少动态偏好

留言板入口必须在减少动态模式下提供无动画但完整的状态反馈。

#### Scenario: 用户启用减少动态偏好
- **GIVEN** 用户启用了 `prefers-reduced-motion: reduce`
- **WHEN** 留言板入口进入或离开 Hover / `focus-visible` 状态
- **THEN** 入口取消渐进动画并直接呈现目标状态
- **AND** 文字可读性、背景反馈和焦点轮廓仍然保留

## MODIFIED Requirements

### Requirement: About 页面留言板入口

About 页面必须提供视觉一致、可读且可自然进入留言弹窗的入口。

#### Scenario: 用户从 About 页面进入留言板
- **GIVEN** 用户正在浏览 About 页面
- **WHEN** 用户看到或操作“留言板”区块
- **THEN** 系统应展示一个与 About 页面视觉一致且文字清晰可读的留言入口
- **AND** 入口应使用聊天语义的头像、标题、预览文案和进入提示
- **AND** 指针悬停和键盘聚焦状态应使用自然、同步的渐进反馈
- **AND** 用户点击入口后应打开居中的留言弹窗

### `tasks.md`
# 任务清单

## Phase 1: 复现与最小修复

### Task 1: 建立留言板入口样式回归检查

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs`
- [x] 复现 Hover 背景变化后文字对比与过渡不同步的问题。
- [x] 断言入口使用纸张轻染状态、统一 `220ms ease`，并包含键盘 Focus 与减少动态规则。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** 修复前 2 项测试均因缺少目标规则而失败

### Task 2: 修复留言板入口 Hover 样式

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 保持浅色纸张基底，通过低强度暖色渐变实现 Hover / Focus 反馈。
- [x] 为背景、边框、标题、预览文字和 CTA 配置统一的 `220ms ease` 过渡。
- [x] 使用语义颜色令牌保证亮色、暗色主题下文字清晰可读。
- [x] 增加 `prefers-reduced-motion: reduce` 降级规则。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 12 分钟
- [x] **验证:** 新增回归测试 2/2 通过

## Phase 2: 语法验收

### Task 3: 检查入口状态与主题适配

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 审查亮色和暗色主题的默认、Hover、`focus-visible` 状态规则。
- [x] 审查背景、边框与三层文字的同步过渡声明和目标色切换。
- [x] 确认未修改移动布局、入口点击和留言弹窗实现。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 独立语法与范围审查；发现并修复文字仅声明 transition、未切换颜色的问题

### Task 4: 执行语法检查

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`、`packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs`
- [x] 执行 Node 语法检查、相关测试和 Git diff 空白检查。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** `node --check packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && node --test packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && git diff --check`

## 验收

- [x] Hover 后标题、预览文案和 CTA 使用高对比语义颜色。
- [x] 入口保持浅色纸张基底，不切换为深色实底。
- [x] 背景、边框、标题、预览文字和 CTA 使用统一的 `220ms ease` 过渡。
- [x] `focus-visible` 获得等价视觉反馈和清晰焦点轮廓。
- [x] 减少动态偏好下取消过渡但保留状态反馈。
- [x] 头像、文案、布局、点击行为与弹窗逻辑未修改。
- [x] 相关测试 2/2 通过且 `git diff --check` 零错误。
