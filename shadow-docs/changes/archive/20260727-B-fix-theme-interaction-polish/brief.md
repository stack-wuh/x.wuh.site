# 修复 Header 双下划线与留言板主题渐变

> 原始变更名：`2026-07-27-B-fix-theme-interaction-polish`

## 元数据
- 日期：2026-07-27
- 类型：B
- 状态：proposed
- Issue：历史记录未提供

## 动机
近期 Header 与 About 留言板入口的样式优化仍存在两处可见问题：

1. Header 桌面导航 Hover 时同时显示全局 `a:hover` 文字下划线和 `NavLink::after` 主题色装饰线，形成双下划线，与“只保留主题色装饰线”的规范不符。
2. About 留言板入口以固定 `--accent-color` 为主要渐变来源，颜色未直接跟随当前主题的 `--primary-color`；暗色分支还使用 `prefers-color-scheme`，可能与用户手动选择的 `data-color-scheme` 不一致。现有渐变方向和强度缺少自然衰减，视觉效果生硬。

## 引用规范
- `specs/design-system/spec.md`
- `specs/guestbook-barrage/spec.md`

## 决策
本变更由两个独立的局部 CSS 修复组成，均不改变 React 结构或数据流：

```text
SiteHeader.NavLink
├── 覆盖全局 a:hover text-decoration
└── 保留 NavLink::after 主题色装饰线

About.GuestbookTrigger
├── 使用 --primary-color 生成单向雾化渐变
├── 使用 data-color-scheme 路由亮暗状态
└── 保留文字可读性、220ms 过渡与 reduced-motion
```

| 维度 | 选择 | 理由 |
|------|------|------|
| Header 双线修复 | 在 `NavLink` 的 Hover / Focus 状态显式设置 `text-decoration: none` | 局部解决全局 `a:hover` 与伪元素冲突，不影响正文链接 |
| Header 装饰线 | 保留现有 `::after` 1px 主题色渐隐线 | 已符合用户选择和正式设计系统规范 |
| 留言板渐变 | 方案 A：105deg 左向右单向主题雾化 | 主题色沿内容阅读方向自然衰减，纸张层次清晰 |
| 渐变色源 | `--primary-color` 与 `--background-100` 的 `color-mix()` | 直接随酒红/素雅主题变化，不依赖固定强调色 |
| 亮暗路由 | `[data-color-scheme='dark'] &` | 与站点用户选择一致，避免系统偏好与手动模式冲突 |
| 动效 | 背景、边框与文字保留 `220ms ease` | 延续已确认的同步节奏 |

## 任务
### Phase 1: 建立回归测试
- [x] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [x] 断言 `NavLink` 在 Hover / `focus-visible` 状态显式禁用原生文字下划线。
- [x] 断言现有 `::after` 主题色装饰线保持不变。
- [x] **预计耗时:** 15 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 实现前 21/22 通过，新增断言因缺少局部 `text-decoration: none` 失败
- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs`
- [x] 断言背景渐变使用 `--primary-color`，且不使用 `--accent-color` 作为背景主色。
- [x] 断言暗色分支使用 `[data-color-scheme='dark']`，不使用 `prefers-color-scheme`。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 实现前 1/2 通过，新增断言因色源和主题路由不符失败
### Phase 2: 最小样式修复
- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [x] 在 Hover / `focus-visible` 中覆盖全局文字下划线。
- [x] 保留 1px `--primary-color` 伪元素装饰线和焦点轮廓。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** Header 回归测试 22/22 通过
- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 使用 `--primary-color` 与纸张底色构建 105deg 左向右自然衰减渐变。
- [x] 左侧强调线、边框和 CTA 使用主题色语义。
- [x] 暗色分支改用 `[data-color-scheme='dark'] &`。
- [x] 保留 `220ms ease`、文字可读性和 reduced-motion。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** 留言板回归测试 2/2 通过
### Phase 3: 语法与范围检查
- [x] **文件:** 上述 4 个实现与测试文件
- [x] 执行 Node 语法检查、相关测试与 Git diff 空白检查。
- [x] 确认未修改全局链接规则、移动菜单、留言弹窗或业务逻辑。
- [x] **预计耗时:** 15 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node --check packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && git diff --check`，24/24 通过
- [x] Header Hover / `focus-visible` 仅显示一条 1px 主题色装饰线。
- [x] Header 不再显示浏览器文字下划线，正文链接规则未改变。
- [x] 留言板默认与 Hover / Focus 背景均使用当前 `--primary-color`。
- [x] 留言板渐变从左向右自然衰减并保留纸张基底。
- [x] 酒红/素雅及亮色/暗色主题均通过 `data-*` 主题状态自动适配。
- [x] 背景、边框和文字保留统一 `220ms ease`，reduced-motion 下取消动画。
- [x] 相关测试 24/24 通过，`git diff --check` 零错误。

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-27-B-fix-theme-interaction-polish
date: 2026-07-27
type: B
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/284
```

### `design.md`
# 设计文档

## 架构

本变更由两个独立的局部 CSS 修复组成，均不改变 React 结构或数据流：

```text
SiteHeader.NavLink
├── 覆盖全局 a:hover text-decoration
└── 保留 NavLink::after 主题色装饰线

About.GuestbookTrigger
├── 使用 --primary-color 生成单向雾化渐变
├── 使用 data-color-scheme 路由亮暗状态
└── 保留文字可读性、220ms 过渡与 reduced-motion
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Header 双线修复 | 在 `NavLink` 的 Hover / Focus 状态显式设置 `text-decoration: none` | 局部解决全局 `a:hover` 与伪元素冲突，不影响正文链接 |
| Header 装饰线 | 保留现有 `::after` 1px 主题色渐隐线 | 已符合用户选择和正式设计系统规范 |
| 留言板渐变 | 方案 A：105deg 左向右单向主题雾化 | 主题色沿内容阅读方向自然衰减，纸张层次清晰 |
| 渐变色源 | `--primary-color` 与 `--background-100` 的 `color-mix()` | 直接随酒红/素雅主题变化，不依赖固定强调色 |
| 亮暗路由 | `[data-color-scheme='dark'] &` | 与站点用户选择一致，避免系统偏好与手动模式冲突 |
| 动效 | 背景、边框与文字保留 `220ms ease` | 延续已确认的同步节奏 |

## 数据模型（如涉及）

不涉及数据模型变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### NavLink

保留现有 `::after`：1px 高、两端透明、中段使用 `--primary-color`。在 `:hover` 与 `:focus-visible` 中显式声明 `text-decoration: none`，覆盖全局 `a:hover`，从而只显示伪元素装饰线。焦点轮廓、文字颜色增强和链接点击区域保持不变。

### GuestbookTrigger

默认和 Hover / Focus 状态均以 `--background-100` 为纸张基底。前景渐变改为从左侧低浓度 `--primary-color` 开始，经过较淡中段后在右侧自然回归纸张底色。Hover / Focus 仅适度增加主题色浓度和扩展衰减范围，不改变渐变方向，不使用固定 `--accent-color` 作为背景主色。

左侧强调边框、CTA 和相关强调反馈统一使用 `--primary-color`。标题、预览文字继续使用语义文字令牌，保证可读性。

暗色分支从 `@media (prefers-color-scheme: dark)` 改为 `[data-color-scheme='dark'] &`，使用相同方向和层次，仅调整主题色浓度与纸张底色混合比例。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | Header 桌面导航只显示主题色装饰线；留言板采用单向主题雾化 |
| < 768px | Header 移动菜单保持不变；留言板沿用同一渐变与现有窄屏布局 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** DOM、链接、按钮语义、布局与业务行为保持不变
- **性能影响:** 仅调整已有 CSS 选择器和渐变值，影响可忽略

### `proposal.md`
# 修复 Header 双下划线与留言板主题渐变

## 背景

近期 Header 与 About 留言板入口的样式优化仍存在两处可见问题：

1. Header 桌面导航 Hover 时同时显示全局 `a:hover` 文字下划线和 `NavLink::after` 主题色装饰线，形成双下划线，与“只保留主题色装饰线”的规范不符。
2. About 留言板入口以固定 `--accent-color` 为主要渐变来源，颜色未直接跟随当前主题的 `--primary-color`；暗色分支还使用 `prefers-color-scheme`，可能与用户手动选择的 `data-color-scheme` 不一致。现有渐变方向和强度缺少自然衰减，视觉效果生硬。

## 目标

- Header 桌面导航在 Hover / `focus-visible` 状态只显示一条 1px 主题色装饰线。
- 留言板入口采用已确认的“单向主题雾化”方案：主题色从左侧向右自然衰减，保持纸张基底。
- 留言板背景、边框、CTA 和强调线直接跟随当前主题的 `--primary-color`。
- 留言板亮暗样式跟随站点 `data-color-scheme`，并保留统一 `220ms ease` 与减少动态适配。

## 非目标（明确不做）

- 不修改全站通用链接的 Hover 下划线规则。
- 不改变 Header 导航的文案、链接、点击区域或移动端菜单样式。
- 不修改留言板弹窗、消息流、文案、布局、头像或提交逻辑。
- 不增加位移、缩放、强阴影或额外装饰动画。

## 影响范围

- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 局部覆盖全局链接下划线，确保只显示主题色装饰线。
- `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` — 增加 Header 单下划线回归断言。
- `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts` — 重做留言板入口主题色渐变与主题状态选择器。
- `packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs` — 更新留言板渐变与主题路由回归断言。
- `openspec/specs/design-system/spec.md`、`openspec/specs/guestbook-barrage/spec.md` — 归档后同步正式规范。

### `specs/design-system/spec.md`
# Spec: Header 桌面导航单下划线

## MODIFIED Requirements

### Requirement: 桌面主导航使用渐隐装饰下划线

桌面主导航必须只使用一条主题色装饰线反馈交互状态。

#### Scenario: 用户悬停或聚焦桌面导航项
- **GIVEN** 用户在视口宽度不小于 768px 的页面访问 Header
- **WHEN** 指针悬停在“博客 / 关于 / 知识库”任一导航项，或该导航项获得 `focus-visible`
- **THEN** 导航文字下方只显示一条 1px 高、两端透明且中段使用 `--primary-color` 的装饰线
- **AND** 导航项显式禁用原生或全局文字下划线
- **AND** 导航项不显示悬停胶囊背景
- **AND** 导航项不产生上浮、滑入、缩放或其他几何位移动效

### Requirement: 桌面主导航保持可访问与稳定布局

桌面主导航必须在单下划线修复后保持原有语义和可访问反馈。

#### Scenario: 用户使用键盘、指针或屏幕阅读器访问桌面主导航
- **GIVEN** 用户访问桌面主导航
- **WHEN** 导航项处于默认、悬停、聚焦或点击状态
- **THEN** 链接文案、目标地址、语义和点击区域保持不变
- **AND** `focus-visible` 状态保留清晰的焦点轮廓
- **AND** 单条装饰线不会引起 Header 或相邻导航项的布局偏移

### `specs/guestbook-barrage/spec.md`
# Spec: 留言板入口主题渐变

## MODIFIED Requirements

### Requirement: 留言板入口 Hover 保持文字可读

留言板入口的交互状态必须使用当前站点主题色，并保持纸张风格与文字可读性。

#### Scenario: 用户悬停或聚焦留言板入口
- **GIVEN** 用户在 About 页面看到留言板入口
- **WHEN** 指针悬停在入口上，或入口获得 `focus-visible`
- **THEN** 入口以 `--background-100` 为纸张基底，并以 `--primary-color` 从左向右自然衰减形成单向主题雾化渐变
- **AND** 默认状态与交互状态均直接跟随当前 `data-theme-family` 和 `data-color-scheme`
- **AND** 背景渐变不使用固定 `--accent-color` 作为主色
- **AND** 标题、预览文案和 CTA 在亮色与暗色主题下保持清晰可读
- **AND** 入口不使用位移、缩放或强阴影反馈

### Requirement: 留言板入口状态同步渐进

留言板入口的主题渐变、边框与文字反馈必须使用一致且自然的过渡节奏。

#### Scenario: 入口状态发生变化
- **GIVEN** 留言板入口正在进入或离开 Hover / `focus-visible` 状态
- **WHEN** 主题渐变、边框和文字状态发生变化
- **THEN** 背景、边框、标题、预览文字和 CTA 使用统一的 `220ms ease` 过渡
- **AND** Hover / Focus 仅适度增强主题色浓度与衰减范围，不改变渐变方向
- **AND** 左侧强调线、交互边框和 CTA 使用当前 `--primary-color`
- **AND** 各视觉元素不会出现不同步跳变或布局偏移

### Requirement: 留言板入口尊重减少动态偏好

留言板入口必须在主题渐变修复后继续支持减少动态偏好。

#### Scenario: 用户启用减少动态偏好
- **GIVEN** 用户启用了 `prefers-reduced-motion: reduce`
- **WHEN** 留言板入口进入或离开 Hover / `focus-visible` 状态
- **THEN** 入口取消渐进动画并直接呈现目标主题色状态
- **AND** 文字可读性、主题渐变、边框反馈和焦点轮廓仍然保留

### `tasks.md`
# 任务清单

## Phase 1: 建立回归测试

### Task 1: 复现 Header 双下划线

- [x] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [x] 断言 `NavLink` 在 Hover / `focus-visible` 状态显式禁用原生文字下划线。
- [x] 断言现有 `::after` 主题色装饰线保持不变。
- [x] **预计耗时:** 15 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 实现前 21/22 通过，新增断言因缺少局部 `text-decoration: none` 失败

### Task 2: 复现留言板非主题色渐变

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs`
- [x] 断言背景渐变使用 `--primary-color`，且不使用 `--accent-color` 作为背景主色。
- [x] 断言暗色分支使用 `[data-color-scheme='dark']`，不使用 `prefers-color-scheme`。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 实现前 1/2 通过，新增断言因色源和主题路由不符失败

## Phase 2: 最小样式修复

### Task 3: 修复 Header 单下划线

- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [x] 在 Hover / `focus-visible` 中覆盖全局文字下划线。
- [x] 保留 1px `--primary-color` 伪元素装饰线和焦点轮廓。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** Header 回归测试 22/22 通过

### Task 4: 实现留言板单向主题雾化

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 使用 `--primary-color` 与纸张底色构建 105deg 左向右自然衰减渐变。
- [x] 左侧强调线、边框和 CTA 使用主题色语义。
- [x] 暗色分支改用 `[data-color-scheme='dark'] &`。
- [x] 保留 `220ms ease`、文字可读性和 reduced-motion。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** 留言板回归测试 2/2 通过

## Phase 3: 语法与范围检查

### Task 5: 检查变更语法和范围

- [x] **文件:** 上述 4 个实现与测试文件
- [x] 执行 Node 语法检查、相关测试与 Git diff 空白检查。
- [x] 确认未修改全局链接规则、移动菜单、留言弹窗或业务逻辑。
- [x] **预计耗时:** 15 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node --check packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs packages/wuh.site.next/app/about/components/guestbook-trigger-hover.test.mjs && git diff --check`，24/24 通过

## 验收

- [x] Header Hover / `focus-visible` 仅显示一条 1px 主题色装饰线。
- [x] Header 不再显示浏览器文字下划线，正文链接规则未改变。
- [x] 留言板默认与 Hover / Focus 背景均使用当前 `--primary-color`。
- [x] 留言板渐变从左向右自然衰减并保留纸张基底。
- [x] 酒红/素雅及亮色/暗色主题均通过 `data-*` 主题状态自动适配。
- [x] 背景、边框和文字保留统一 `220ms ease`，reduced-motion 下取消动画。
- [x] 相关测试 24/24 通过，`git diff --check` 零错误。
