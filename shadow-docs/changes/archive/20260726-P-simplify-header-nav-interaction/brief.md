# 简化 Header 桌面导航交互

> 原始变更名：`2026-07-26-P-simplify-header-nav-interaction`

## 元数据
- 日期：2026-07-26
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
Header 桌面端“博客 / 关于 / 知识库”菜单当前在悬停时同时使用胶囊背景、文字颜色变化和上浮位移，视觉反馈偏重，与站点希望保持的克制导航风格不一致。导航项只需要清晰表达可点击状态，无需叠加多种动效。

## 引用规范
- `specs/design-system/spec.md`

## 决策
本变更只调整 `SiteHeader` 已有 `NavLink` 的样式，不改变 React 组件结构、状态管理或链接数据流。桌面端三个导航链接继续共用同一 styled-component，通过伪元素统一绘制渐隐装饰线。

```text
SiteHeader
└── Nav
    ├── NavLink：博客
    ├── NavLink：关于
    └── NavLink：知识库
         └── ::after：Hover / Focus 时显示渐隐装饰线
```

| 维度 | 选择 | 理由 |
|------|------|------|
| 下划线载体 | `::after` 伪元素 | 不增加 DOM，不影响链接语义与点击区域 |
| 视觉形式 | 两端透明、中段主题色的 1px 线性渐变 | 符合已确认的方案 C，保留细腻感但不叠加位移动效 |
| 触发状态 | `:hover` 与 `:focus-visible` | 同时覆盖指针和键盘操作，不增加当前页常驻状态 |
| 动效 | 无几何位移；下划线直接显示 | 满足减少动效的目标，避免滑入、缩放和上浮 |

## 任务
### Phase 1: 样式验证与实现
- [x] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [x] 补充现有 Header 样式断言，覆盖移除胶囊背景和上浮位移。
- [x] 断言桌面 `NavLink` 在 Hover / Focus 状态使用渐隐装饰下划线。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`，实现前 21 通过、1 失败
- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [x] 移除 `NavLink` 的胶囊圆角、悬停背景与上浮位移。
- [x] 使用伪元素实现两端渐隐的 1px 下划线，并限定在 Hover / Focus 状态显示。
- [x] 保留原有文字颜色增强和 `focus-visible` 焦点轮廓。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`，22/22 通过
### Phase 2: 语法检查
- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`、`packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [x] 执行 TypeScript 编译语法检查和 Git 空白错误检查。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** `pnpm exec tsc --noEmit && git diff --check`
- [x] 桌面端三个主导航项默认状态不显示下划线。
- [x] Hover 与 `focus-visible` 状态显示 1px 两端渐隐装饰线。
- [x] 导航项不再出现胶囊背景或上浮位移。
- [x] 键盘焦点轮廓、链接点击区域、文案和地址保持不变。
- [x] 移动端菜单实现未修改。
- [x] `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 22/22 通过。
- [x] `pnpm exec tsc --noEmit` 零错误。
- [x] `git diff --check` 零错误。

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-26-P-simplify-header-nav-interaction
date: 2026-07-26
type: P
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/274
```

### `design.md`
# 设计文档

## 架构

本变更只调整 `SiteHeader` 已有 `NavLink` 的样式，不改变 React 组件结构、状态管理或链接数据流。桌面端三个导航链接继续共用同一 styled-component，通过伪元素统一绘制渐隐装饰线。

```text
SiteHeader
└── Nav
    ├── NavLink：博客
    ├── NavLink：关于
    └── NavLink：知识库
         └── ::after：Hover / Focus 时显示渐隐装饰线
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 下划线载体 | `::after` 伪元素 | 不增加 DOM，不影响链接语义与点击区域 |
| 视觉形式 | 两端透明、中段主题色的 1px 线性渐变 | 符合已确认的方案 C，保留细腻感但不叠加位移动效 |
| 触发状态 | `:hover` 与 `:focus-visible` | 同时覆盖指针和键盘操作，不增加当前页常驻状态 |
| 动效 | 无几何位移；下划线直接显示 | 满足减少动效的目标，避免滑入、缩放和上浮 |

## 数据模型（如涉及）

不涉及数据模型变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### NavLink

保留现有链接字号、内边距和文字颜色。移除胶囊圆角、悬停背景以及 `transform: translateY(-1px)`。链接使用相对定位，并以绝对定位的 `::after` 在文字下方绘制 1px 渐隐装饰线。

默认状态不显示装饰线；鼠标悬停或键盘 `focus-visible` 时显示。文字颜色可继续从次要文本色增强为主要文本色，以保证链接反馈清晰。现有 `focus-visible` 外轮廓保留，因此键盘用户同时获得标准焦点指示与下划线语义反馈。

### 其他 Header 控件

`AppearanceTrigger`、`MobileItem`、`MobileToggle` 和外观设置相关控件不受影响，继续遵循各自现有交互规范。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | “博客 / 关于 / 知识库”在 Hover / Focus 时显示渐隐装饰下划线，不显示胶囊背景、不上浮 |
| < 768px | 移动菜单保持现有整行触摸反馈，不采用下划线方案 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 链接结构、地址、点击区域与键盘焦点行为保持兼容
- **性能影响:** 仅增加静态 CSS 伪元素，影响可忽略；移除 transform 与背景过渡后交互成本更低

### `proposal.md`
# 简化 Header 桌面导航交互

## 背景

Header 桌面端“博客 / 关于 / 知识库”菜单当前在悬停时同时使用胶囊背景、文字颜色变化和上浮位移，视觉反馈偏重，与站点希望保持的克制导航风格不一致。导航项只需要清晰表达可点击状态，无需叠加多种动效。

## 目标

- 将桌面端三个主导航项的悬停与键盘聚焦反馈简化为渐隐装饰下划线。
- 移除导航项的胶囊背景和 `translateY` 上浮效果。
- 保持菜单文字、链接行为、点击区域和键盘可访问性不变。

## 非目标（明确不做）

- 不调整移动端菜单项的交互样式。
- 不修改“外观”入口、外观浮层或主题切换行为。
- 不增加当前路由常驻选中态。
- 不修改 Header 布局、导航文案或链接地址。

## 影响范围

- `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` — 简化桌面导航项的视觉状态，增加渐隐装饰下划线。
- `openspec/specs/design-system/spec.md` — 归档后补充桌面主导航的克制交互规范。

### `specs/design-system/spec.md`
# Spec: Header 桌面主导航

## ADDED

### Requirement: 桌面主导航使用渐隐装饰下划线
- **GIVEN** 用户在视口宽度不小于 768px 的页面访问 Header
- **WHEN** 指针悬停在“博客 / 关于 / 知识库”任一导航项，或该导航项获得 `focus-visible`
- **THEN** 导航文字下方显示 1px 高、两端透明且中段使用主题色的渐隐装饰线
- **AND** 导航项不显示悬停胶囊背景
- **AND** 导航项不产生上浮、滑入、缩放或其他几何位移动效

### Requirement: 桌面主导航保持可访问与稳定布局
- **GIVEN** 用户使用键盘、指针或屏幕阅读器访问桌面主导航
- **WHEN** 导航项处于默认、悬停、聚焦或点击状态
- **THEN** 链接文案、目标地址、语义和点击区域保持不变
- **AND** `focus-visible` 状态保留清晰的焦点轮廓
- **AND** 下划线不会引起 Header 或相邻导航项的布局偏移

### Requirement: 移动菜单不采用桌面下划线方案
- **GIVEN** 用户在视口宽度小于 768px 的页面打开移动菜单
- **WHEN** 移动导航项渲染或被操作
- **THEN** 移动导航项保持现有整行触摸反馈
- **AND** 本次桌面渐隐装饰下划线规则不改变移动菜单样式

---

## MODIFIED

本变更不修改现有 Requirement。

---

## REMOVED

本变更不移除现有 Requirement。

### `tasks.md`
# 任务清单

## Phase 1: 样式验证与实现

### Task 1: 建立桌面导航交互回归检查

- [x] **文件:** `packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [x] 补充现有 Header 样式断言，覆盖移除胶囊背景和上浮位移。
- [x] 断言桌面 `NavLink` 在 Hover / Focus 状态使用渐隐装饰下划线。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`，实现前 21 通过、1 失败

### Task 2: 简化桌面导航样式

- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`
- [x] 移除 `NavLink` 的胶囊圆角、悬停背景与上浮位移。
- [x] 使用伪元素实现两端渐隐的 1px 下划线，并限定在 Hover / Focus 状态显示。
- [x] 保留原有文字颜色增强和 `focus-visible` 焦点轮廓。
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`，22/22 通过

## Phase 2: 语法检查

### Task 3: 检查变更语法

- [x] **文件:** `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts`、`packages/wuh.site.next/test/site-header-theme-toggle.test.mjs`
- [x] 执行 TypeScript 编译语法检查和 Git 空白错误检查。
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** `pnpm exec tsc --noEmit && git diff --check`

## 验收

- [x] 桌面端三个主导航项默认状态不显示下划线。
- [x] Hover 与 `focus-visible` 状态显示 1px 两端渐隐装饰线。
- [x] 导航项不再出现胶囊背景或上浮位移。
- [x] 键盘焦点轮廓、链接点击区域、文案和地址保持不变。
- [x] 移动端菜单实现未修改。
- [x] `node --test packages/wuh.site.next/test/site-header-theme-toggle.test.mjs` 22/22 通过。
- [x] `pnpm exec tsc --noEmit` 零错误。
- [x] `git diff --check` 零错误。
