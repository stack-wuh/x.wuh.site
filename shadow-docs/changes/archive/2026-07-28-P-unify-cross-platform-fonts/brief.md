# 主站跨平台字体统一：Noto 双家族全量自托管方案

> 原始变更名：`2026-07-28-P-unify-cross-platform-fonts`

## 元数据
- 日期：2026-07-28
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
主站目前加载了 Inter（仅 Latin 子集）和 Noto Serif SC（仅 400/700），但中文无衬线内容仍会回退到操作系统字体。macOS 通常使用苹方，Windows 通常使用微软雅黑，二者字形、字宽、标点位置和 synthetic bold 方式不同，导致：

- 同一标题在 Windows 提前换行；
- 按钮与标签宽度不一致；
- font-weight 500/600 的视觉粗细在两个平台不同；
- 中英文混排的基线和密度不一致。

单纯统一 CSS font-family 名称或排版指标（line-height、font-size）无法解决这些由字体度量本身决定的差异。

## 引用规范
- `specs/design-system/spec.md`

## 决策
字体统一的核心改动集中在字体加载层和主题变量层，组件层无需感知字体来源变化。

```
Root Layout（next/font 注入三个字体变量）
  ├── Noto Sans SC  → CSS var: --font-sans
  ├── Noto Serif SC → CSS var: --font-serif
  └── JetBrains Mono → CSS var: --font-mono
         ↓
CssVariableStyles（:root fallback 栈 + font-synthesis: none）
         ↓
全站组件只消费 var(--font-sans|serif|mono)
```

字体文件由 `next/font/google` 在构建期下载并同源托管，不依赖 Google Fonts CDN。浏览器通过 `unicode-range` 分片按需请求，只下载页面实际命中的字符区段。

| 维度 | 选择 | 理由 |
|------|------|------|
| 无衬线字体 | Noto Sans SC | 中英文同一字体文件，字形统一，避免 Inter + 系统中文混排；OFL 开源授权，适合自托管 |
| 衬线字体 | Noto Serif SC（保留现有） | 与 Noto Sans SC 同一设计体系，视觉协调，只需补充 500/600 字重 |
| 等宽字体 | JetBrains Mono（保留现有） | 已自托管，提升到根布局统一注入即可 |
| 字重 | 400/500/600/700 | 覆盖现有样式实际使用的所有字重，避免 synthetic bold |
| 加载方式 | next/font + unicode-range 分片 | 构建期缓存、同源、长期不可变、按需分片；无 Google CDN 依赖 |
| display | swap | 首屏速度优先；配合 metric overrides 降低 CLS |
| 字体合成 | font-synthesis: none | 明确禁止 synthetic bold/italic，使缺失字重在开发期暴露 |
| 字体 token | var(--font-sans|serif|mono) | 全站单一入口，组件不感知底层字体，便于后续迁移 |

## 任务
### Phase 1: 字体加载层迁移
- [x] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [x] 将 `Inter` 替换为 `Noto_Sans_SC`，`weight: ['400', '500', '600', '700']`，`subsets: ['latin']`，`variable: '--font-sans'`，`display: 'swap'`
- [x] 将 `Noto_Serif_SC` 的 `weight` 从 `['400', '700']` 扩展为 `['400', '500', '600', '700']`
- [x] 引入 `JetBrains_Mono`，`subsets: ['latin']`，`variable: '--font-mono'`，`display: 'swap'`
- [x] `<body>` className 包含全部三个字体变量
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** diff 已确认；Network 面板和 `document.fonts.check()` 需在浏览器手动验收
- [x] **文件:** `packages/wuh.site.next/app/post/layout.tsx`
- [x] 删除 `JetBrains_Mono` 导入与注入（已由 root layout 提供）
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** diff 已确认
### Phase 2: 主题变量层更新
- [x] **文件:** `packages/components/themes/cssVariableProvider.tsx`
- [x] 将 `--font-sans` fallback 更新为 `'Noto Sans SC', ui-sans-serif, system-ui, sans-serif`
- [x] 将 `--font-serif` fallback 更新为 `Georgia, serif`
- [x] 将 `--font-mono` fallback 更新为 `'JetBrains Mono', ui-monospace, 'Courier New', monospace`
- [x] 在 `body` 全局样式中添加 `font-synthesis: none`
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** diff 已确认；`getComputedStyle(document.body).fontSynthesis` 需在浏览器手动验收
### Phase 3: 硬编码字体引用清理
- [x] **文件:** `packages/wuh.site.next/app/post/styles/post-markdown.ts`
- [x] `code` 选择器（行 81）改为 `var(--font-mono)`
- [x] `kbd` 选择器（行 233）改为 `var(--font-mono)`
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 2 分钟
- [x] **验证:** diff 已确认
- [x] **文件:** 全站（重点检查 `packages/components/`、`packages/wuh.site.next/`）
- [x] Grep 搜索 Georgia、system-ui、Menlo、Consolas、SFMono、BlinkMacSystemFont、Segoe UI
- [x] `components/image-preview/styles/index.tsx:253` — `var(--font-mono, 'SFMono-Regular', monospace)` 简化为 `var(--font-mono)`
- [x] `share-utils.ts:63` — 微信扫码分享内联 HTML 模板，CSS 变量不可用，**保留系统字体栈**
- [x] `wuh.site.console/src/styles/global.css` — Console 在提案非目标范围内，**跳过**
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 10 分钟
- [x] **验证:** diff 已确认；无剩余不必要的硬编码系统字体声明
### Phase 4: 验证与性能基线
- [ ] 固定视口、DPR、浏览器版本（macOS Chrome/Safari、Windows Chrome/Edge）
- [ ] 验证 `document.fonts.check()` 在各目标浏览器和字重下返回 true
- [ ] 对标题、正文、按钮、中英混排、代码块记录换行行数和元素宽高，确认两个平台结果一致
- [ ] 测量首页、博客列表、文章详情三个页面的实际字体请求数和传输量
- [ ] 测量 CLS；若超出可接受范围则评估 metric overrides
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 同一文本在两个平台使用相同字体文件和真实字重；关键元素尺寸和换行一致；无超出预期的 CLS
- [ ] 主站中文、英文、数字、标点全部由 Noto Sans SC / Noto Serif SC / JetBrains Mono 渲染，无回退到系统字体（PingFang、微软雅黑、Georgia、Menlo、Consolas）
- [ ] 400/500/600/700 字重均由真实字体文件提供，font-synthesis: none 生效
- [ ] 字体变量作为唯一入口；全站无绕过 token 的硬编码系统字体声明
- [ ] macOS 与 Windows 关键元素换行一致、宽高误差在允许阈值内
- [ ] 首屏字体体积和请求数在各页面实测合理范围内，重复访问命中长期缓存
- [ ] `NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 零错误

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-28-P-unify-cross-platform-fonts
date: 2026-07-28
type: P
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/293
```

### `design.md`
# 设计文档

## 架构

字体统一的核心改动集中在字体加载层和主题变量层，组件层无需感知字体来源变化。

```
Root Layout（next/font 注入三个字体变量）
  ├── Noto Sans SC  → CSS var: --font-sans
  ├── Noto Serif SC → CSS var: --font-serif
  └── JetBrains Mono → CSS var: --font-mono
         ↓
CssVariableStyles（:root fallback 栈 + font-synthesis: none）
         ↓
全站组件只消费 var(--font-sans|serif|mono)
```

字体文件由 `next/font/google` 在构建期下载并同源托管，不依赖 Google Fonts CDN。浏览器通过 `unicode-range` 分片按需请求，只下载页面实际命中的字符区段。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 无衬线字体 | Noto Sans SC | 中英文同一字体文件，字形统一，避免 Inter + 系统中文混排；OFL 开源授权，适合自托管 |
| 衬线字体 | Noto Serif SC（保留现有） | 与 Noto Sans SC 同一设计体系，视觉协调，只需补充 500/600 字重 |
| 等宽字体 | JetBrains Mono（保留现有） | 已自托管，提升到根布局统一注入即可 |
| 字重 | 400/500/600/700 | 覆盖现有样式实际使用的所有字重，避免 synthetic bold |
| 加载方式 | next/font + unicode-range 分片 | 构建期缓存、同源、长期不可变、按需分片；无 Google CDN 依赖 |
| display | swap | 首屏速度优先；配合 metric overrides 降低 CLS |
| 字体合成 | font-synthesis: none | 明确禁止 synthetic bold/italic，使缺失字重在开发期暴露 |
| 字体 token | var(--font-sans|serif|mono) | 全站单一入口，组件不感知底层字体，便于后续迁移 |

## 数据模型（如涉及）

不涉及数据模型变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### Root Layout 字体注入

替换 `Inter` 为 `Noto_Sans_SC`，覆盖 `weight: ['400', '500', '600', '700']`，`subsets: ['latin']`，`variable: '--font-sans'`，`display: 'swap'`。

将 `Noto_Serif_SC` 的 `weight` 从 `['400', '700']` 扩展为 `['400', '500', '600', '700']`。

将 `JetBrains_Mono` 从 post/layout.tsx 移入 root layout.tsx，注入到 `<body>` className。

### CssVariableStyles 变量层

`--font-sans` fallback 精简为 `'Noto Sans SC', ui-sans-serif, system-ui, sans-serif`，其余平台特定字体（PingFang、Microsoft YaHei 等）从 fallback 移除，避免系统字体在 Web Font 未加载时造成可见差异。

`--font-serif` fallback 保留 `Georgia, serif`（仅 Latin 兜底）。

`--font-mono` fallback 保留 `ui-monospace, 'Courier New', monospace`。

在 `body` 全局样式中增加 `font-synthesis: none`，禁止浏览器合成粗体和斜体。

### 硬编码字体引用清理

全站组件中的 `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`（post-markdown.ts:79、post-markdown.ts:232）改为 `var(--font-mono)`。

排查其他绕过 token 的硬编码字体声明，统一改为三个语义 token。

## 响应式策略（如涉及）

字体加载与分片策略在桌面和移动端相同，由浏览器根据 unicode-range 自动分片请求。

## 影响分析

- **新增依赖:** `next/font/google` 下载 Noto Sans SC 400/500/600/700；Noto Serif SC 新增 500/600 字重；JetBrains Mono 已存在。
- **破坏性变更:** Noto Sans SC Latin 字形与 Inter 不同，标题和导航文本宽度可能微调；需截图回归。Noto Serif SC 新增字重后，原先依赖 synthetic bold 渲染的 500/600 样式视觉会有轻微变化。
- **向后兼容:** 字体 token 名称不变（--font-sans / --font-serif / --font-mono），组件无需改变 CSS 变量引用。字体失败时 fallback 仍保证页面可读。
- **性能影响:** 首屏字体分片请求数增加，但每次只下载命中字符的分片；重复访问命中长期缓存。构建产物字体文件增加（新增 Noto Sans SC 四档字重）。实际首屏传输量需构建后在 Network 面板逐页测量，不能仅依赖字体原始文件大小估算。

### `proposal.md`
# 主站跨平台字体统一：Noto 双家族全量自托管方案

## 背景

主站目前加载了 Inter（仅 Latin 子集）和 Noto Serif SC（仅 400/700），但中文无衬线内容仍会回退到操作系统字体。macOS 通常使用苹方，Windows 通常使用微软雅黑，二者字形、字宽、标点位置和 synthetic bold 方式不同，导致：

- 同一标题在 Windows 提前换行；
- 按钮与标签宽度不一致；
- font-weight 500/600 的视觉粗细在两个平台不同；
- 中英文混排的基线和密度不一致。

单纯统一 CSS font-family 名称或排版指标（line-height、font-size）无法解决这些由字体度量本身决定的差异。

## 目标

- 主站中文、英文、数字和标点全部使用同一套自托管 Web Font，消除中文回退系统字体。
- 提供 400/500/600/700 真实字重，禁止浏览器对缺失字重进行 synthetic bold/italic。
- CJK 字体按 unicode-range 分片加载，首屏只下载页面实际命中的分片。
- 字体 token（--font-sans / --font-serif / --font-mono）作为全站唯一字体入口，禁止组件直接声明系统字体栈。
- 在 macOS/Windows 的 Chrome、Edge、Safari 上验证字形、字宽、换行和 CLS 一致。

## 非目标（明确不做）

- 不消除 macOS CoreText 与 Windows DirectWrite 的抗锯齿差异（像素灰度级一致不是承诺目标）。
- 不覆盖后台 Console（wuh.site.console）。
- 不替换 iconfont 和彩色 Emoji 字体。
- 不修改字号、行高、字重的语义 token 值，只改字体来源。

## 影响范围

- `packages/wuh.site.next/app/layout.tsx` — 替换 Inter 为 Noto Sans SC，补充 400/500/600/700，JetBrains Mono 从 post layout 提升到 root layout 注入。
- `packages/wuh.site.next/app/post/layout.tsx` — 移除 JetBrains Mono 注入，由 root layout 统一提供。
- `packages/components/themes/cssVariableProvider.tsx` — 更新 --font-sans / --font-serif / --font-mono 的 fallback 栈；增加 font-synthesis: none。
- `packages/wuh.site.next/app/post/styles/post-markdown.ts` — 移除代码字体硬编码，改用 var(--font-mono)。
- 全站组件中直接声明 Georgia、system-ui、Menlo、Consolas 等的引用 — 统一改为字体 token。

### `specs/design-system/spec.md`
# Spec: 设计系统

## ADDED Requirements

### Requirement: 全站字体 token 单一入口
All font-family declarations MUST reference semantic tokens only; direct platform font names are MUST NOT be used.

#### Scenario: 组件引用字体
- **GIVEN** 全站组件需要引用字体
- **WHEN** 任何组件或页面样式声明 font-family
- **THEN** 只能引用 `var(--font-sans)`、`var(--font-serif)` 或 `var(--font-mono)` 三个语义 token
- **AND** 不直接声明 Georgia、system-ui、Menlo、Consolas、SFMono、BlinkMacSystemFont、Segoe UI 等平台字体

### Requirement: 禁止字体合成
All font weights and styles MUST be served from real font files; the browser MUST NOT synthesize bold or italic.

#### Scenario: 浏览器渲染字体
- **GIVEN** 浏览器渲染使用字体 token 的文本
- **WHEN** 当前字重在字体文件中有真实字型
- **THEN** 浏览器使用真实字型渲染，不合成粗体或斜体
- **AND** 全局 `font-synthesis: none` 确保缺失字重在开发期暴露而非被静默合成

## MODIFIED Requirements

### Requirement: CSS 变量命名规范
The font CSS variables MUST reference self-hosted Noto fonts covering CJK and Latin, with real weights 400/500/600/700.

#### Scenario: 字体 token 使用 Noto 自托管字体
- **GIVEN** 组件使用 CSS 字体变量
- **WHEN** 浏览器解析 `--font-sans`、`--font-serif`、`--font-mono`
- **THEN** `--font-sans` 由 Noto Sans SC 自托管提供，覆盖中文和 Latin，fallback 为 `ui-sans-serif, system-ui, sans-serif`
- **AND** `--font-serif` 由 Noto Serif SC 自托管提供，覆盖中文和 Latin，fallback 为 `Georgia, serif`
- **AND** `--font-mono` 由 JetBrains Mono 自托管提供，fallback 为 `ui-monospace, 'Courier New', monospace`
- **AND** 三个字体 token 的真实字重均覆盖 400/500/600/700，禁止浏览器 synthetic bold

### `tasks.md`
# 任务清单

## Phase 1: 字体加载层迁移

### Task 1: 更新根布局字体注入

- [x] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [x] 将 `Inter` 替换为 `Noto_Sans_SC`，`weight: ['400', '500', '600', '700']`，`subsets: ['latin']`，`variable: '--font-sans'`，`display: 'swap'`
- [x] 将 `Noto_Serif_SC` 的 `weight` 从 `['400', '700']` 扩展为 `['400', '500', '600', '700']`
- [x] 引入 `JetBrains_Mono`，`subsets: ['latin']`，`variable: '--font-mono'`，`display: 'swap'`
- [x] `<body>` className 包含全部三个字体变量
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** diff 已确认；Network 面板和 `document.fonts.check()` 需在浏览器手动验收

### Task 2: 移除 post layout 的字体注入

- [x] **文件:** `packages/wuh.site.next/app/post/layout.tsx`
- [x] 删除 `JetBrains_Mono` 导入与注入（已由 root layout 提供）
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 3 分钟
- [x] **验证:** diff 已确认

## Phase 2: 主题变量层更新

### Task 3: 更新 CSS 变量 fallback 并禁止字体合成

- [x] **文件:** `packages/components/themes/cssVariableProvider.tsx`
- [x] 将 `--font-sans` fallback 更新为 `'Noto Sans SC', ui-sans-serif, system-ui, sans-serif`
- [x] 将 `--font-serif` fallback 更新为 `Georgia, serif`
- [x] 将 `--font-mono` fallback 更新为 `'JetBrains Mono', ui-monospace, 'Courier New', monospace`
- [x] 在 `body` 全局样式中添加 `font-synthesis: none`
- [x] **预计耗时:** 20 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** diff 已确认；`getComputedStyle(document.body).fontSynthesis` 需在浏览器手动验收

## Phase 3: 硬编码字体引用清理

### Task 4: 清理 post-markdown 硬编码字体栈

- [x] **文件:** `packages/wuh.site.next/app/post/styles/post-markdown.ts`
- [x] `code` 选择器（行 81）改为 `var(--font-mono)`
- [x] `kbd` 选择器（行 233）改为 `var(--font-mono)`
- [x] **预计耗时:** 10 分钟
- [x] **实际耗时:** 2 分钟
- [x] **验证:** diff 已确认

### Task 5: 排查其余绕过 token 的硬编码声明

- [x] **文件:** 全站（重点检查 `packages/components/`、`packages/wuh.site.next/`）
- [x] Grep 搜索 Georgia、system-ui、Menlo、Consolas、SFMono、BlinkMacSystemFont、Segoe UI
- [x] `components/image-preview/styles/index.tsx:253` — `var(--font-mono, 'SFMono-Regular', monospace)` 简化为 `var(--font-mono)`
- [x] `share-utils.ts:63` — 微信扫码分享内联 HTML 模板，CSS 变量不可用，**保留系统字体栈**
- [x] `wuh.site.console/src/styles/global.css` — Console 在提案非目标范围内，**跳过**
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 10 分钟
- [x] **验证:** diff 已确认；无剩余不必要的硬编码系统字体声明

## Phase 4: 验证与性能基线

### Task 6: 跨平台验证与首屏字体性能基线

- [ ] 固定视口、DPR、浏览器版本（macOS Chrome/Safari、Windows Chrome/Edge）
- [ ] 验证 `document.fonts.check()` 在各目标浏览器和字重下返回 true
- [ ] 对标题、正文、按钮、中英混排、代码块记录换行行数和元素宽高，确认两个平台结果一致
- [ ] 测量首页、博客列表、文章详情三个页面的实际字体请求数和传输量
- [ ] 测量 CLS；若超出可接受范围则评估 metric overrides
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 同一文本在两个平台使用相同字体文件和真实字重；关键元素尺寸和换行一致；无超出预期的 CLS

## 验收

- [ ] 主站中文、英文、数字、标点全部由 Noto Sans SC / Noto Serif SC / JetBrains Mono 渲染，无回退到系统字体（PingFang、微软雅黑、Georgia、Menlo、Consolas）
- [ ] 400/500/600/700 字重均由真实字体文件提供，font-synthesis: none 生效
- [ ] 字体变量作为唯一入口；全站无绕过 token 的硬编码系统字体声明
- [ ] macOS 与 Windows 关键元素换行一致、宽高误差在允许阈值内
- [ ] 首屏字体体积和请求数在各页面实测合理范围内，重复访问命中长期缓存
- [ ] `NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 零错误
