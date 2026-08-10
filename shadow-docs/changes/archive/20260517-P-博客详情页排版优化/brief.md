# 博客详情页排版重新设计

> 原始变更名：`博客详情页排版优化_2026_05_17`

## 元数据
- 日期：2026-05-17
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
博客详情页（PostView + MarkdownBody）在酒红(Default) + 素雅(Plain) × light + dark 四组主题组合下，存在字号层级不清晰、文字与背景对比度不足、素雅 dark 模式 CSS 变量覆盖不完整的系统性问题。

## 引用规范
- `specs/blog-detail/spec.md`

## 决策
# 技术方案：双主题独立排版 Token

## Token 架构

```
:root {
  --font-size-*:      <酒红值>
  --line-height-body:   <酒红值>
  --line-height-heading:<酒红值>
}

:root[data-theme='plain'] {
  --font-size-*:      <素雅独立值>
  --line-height-body:   <素雅独立值>
  --line-height-heading:<素雅独立值>
}
```

## 字号 Token（双主题独立）

| Token | 酒红 | 素雅 | 用途 |
|-------|------|------|------|
| `--font-size-base` | 16px | 16px | 正文 |
| `--font-size-sm` | 14px | 15px | 元信息 |
| `--font-size-md` | 18px | 17px | 强调 |
| `--font-size-lg` | 20px | 19px | 小标题 |
| `--font-size-xl` | 24px | 22px | h3/h4 |
| `--font-size-2xl` | 30px | 27px | 文章标题/h1/h2 |

设计意图：酒红偏现代张扬（字稍大、紧凑），素雅偏内敛克制（字稍小、呼吸感）。

## 行高 Token（双主题独立）

| Token | 酒红 | 素雅 | 用途 |
|-------|------|------|------|
| `--line-height-body` | 1.8 | 2.0 | 段落 |
| `--line-height-heading` | 1.35 | 1.4 | 标题 |

## 色彩对比度原则

1. 正文 ≥ 4.5:1（WCAG AA）— `--text-primary` vs 背景
2. 辅助文 ≥ 3:1 — `--text-secondary` / `--text-muted`
3. 素雅 dark 补全缺失的 `--normal-*` 和 `--background-*` 变量
4. 代码块背景与代码字色 ≥ 4.5:1

实现时 DevTools 逐组合调色，不预先承诺具体色值。

## MarkdownBody 改造

```css
/* 从硬编码 em 改为 CSS 变量引用 */
h1 { font-size: var(--font-size-2xl); }
h2 { font-size: var(--font-size-xl); }
h3 { font-size: var(--font-size-lg); }
p  { font-size: var(--font-size-base); line-height: var(--line-height-body); }
```

## 影响分析

- `cssVariableProvider.tsx`：新增 `--line-height-*` token 渲染，`[data-theme='plain']` 下覆写字号/行高，补全素雅 dark 变量
- `styles/index.ts`：MarkdownBody 标题/段落引用 CSS 变量替代 em
- 不影响现有组件库的视觉一致性（字号 token 名不变，值根据需要覆写）

## 任务
### Phase 1: CSS 变量基础设施
- [x] **Task 1.1: cssVariableProvider.tsx — 新增行高 token 渲染**
- [x] **Task 1.2: cssVariableProvider.tsx — plain 主题覆写字号/行高**
- [x] **Task 1.3: cssVariableProvider.tsx — 补全 plain dark 变量**
### Phase 2: MarkdownBody 排版改造
- [x] **Task 2.1: MarkdownBody 标题改用 CSS 变量**
### Phase 3: 逐组合调色
- [x] **Task 3.1: 调色 — 酒红 light**
- [x] **Task 3.2: 调色 — 酒红 dark**
- [x] **Task 3.3: 调色 — 素雅 light**
- [x] **Task 3.4: 调色 — 素雅 dark**

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: 博客详情页排版优化
change: blog-detail-typography
date: 2026-05-17
type: P
status: archived
```

### `design.md`
# 技术方案：双主题独立排版 Token

## Token 架构

```
:root {
  --font-size-*:      <酒红值>
  --line-height-body:   <酒红值>
  --line-height-heading:<酒红值>
}

:root[data-theme='plain'] {
  --font-size-*:      <素雅独立值>
  --line-height-body:   <素雅独立值>
  --line-height-heading:<素雅独立值>
}
```

## 字号 Token（双主题独立）

| Token | 酒红 | 素雅 | 用途 |
|-------|------|------|------|
| `--font-size-base` | 16px | 16px | 正文 |
| `--font-size-sm` | 14px | 15px | 元信息 |
| `--font-size-md` | 18px | 17px | 强调 |
| `--font-size-lg` | 20px | 19px | 小标题 |
| `--font-size-xl` | 24px | 22px | h3/h4 |
| `--font-size-2xl` | 30px | 27px | 文章标题/h1/h2 |

设计意图：酒红偏现代张扬（字稍大、紧凑），素雅偏内敛克制（字稍小、呼吸感）。

## 行高 Token（双主题独立）

| Token | 酒红 | 素雅 | 用途 |
|-------|------|------|------|
| `--line-height-body` | 1.8 | 2.0 | 段落 |
| `--line-height-heading` | 1.35 | 1.4 | 标题 |

## 色彩对比度原则

1. 正文 ≥ 4.5:1（WCAG AA）— `--text-primary` vs 背景
2. 辅助文 ≥ 3:1 — `--text-secondary` / `--text-muted`
3. 素雅 dark 补全缺失的 `--normal-*` 和 `--background-*` 变量
4. 代码块背景与代码字色 ≥ 4.5:1

实现时 DevTools 逐组合调色，不预先承诺具体色值。

## MarkdownBody 改造

```css
/* 从硬编码 em 改为 CSS 变量引用 */
h1 { font-size: var(--font-size-2xl); }
h2 { font-size: var(--font-size-xl); }
h3 { font-size: var(--font-size-lg); }
p  { font-size: var(--font-size-base); line-height: var(--line-height-body); }
```

## 影响分析

- `cssVariableProvider.tsx`：新增 `--line-height-*` token 渲染，`[data-theme='plain']` 下覆写字号/行高，补全素雅 dark 变量
- `styles/index.ts`：MarkdownBody 标题/段落引用 CSS 变量替代 em
- 不影响现有组件库的视觉一致性（字号 token 名不变，值根据需要覆写）

### `proposal.md`
# 博客详情页排版重新设计

## 动机

博客详情页（PostView + MarkdownBody）在酒红(Default) + 素雅(Plain) × light + dark 四组主题组合下，存在字号层级不清晰、文字与背景对比度不足、素雅 dark 模式 CSS 变量覆盖不完整的系统性问题。

## 变更范围

- 双主题独立排版 Token（字号 + 行高）
- 补全素雅 dark 模式缺失的 CSS 变量
- MarkdownBody 标题字号从硬编码 em 改为 CSS 变量引用
- 按 WCAG AA 校准四组组合的文字对比度

## 影响包

- `packages/components` — cssVariableProvider.tsx
- `packages/wuh.site.next` — app/post/styles/index.ts

## 非目标

- 不修改组件库其他组件（Button、Card 等）
- 不修改 DefaultTheme tokens 类型结构
- 不新增 npm 依赖

### `specs/blog-detail/spec.md`
# 博客详情页排版规格

## MODIFIED

### Requirement: 正文字号与行高

GIVEN 用户在酒红主题下查看博客详情页
WHEN 页面渲染 Markdown 正文
THEN 正文字号应使用 `--font-size-base`（16px）
AND 行高应使用 `--line-height-body`（1.8）

GIVEN 用户在素雅主题下查看博客详情页
WHEN 页面渲染 Markdown 正文
THEN 正文字号应使用 `--font-size-base`（16px）
AND 行高应使用 `--line-height-body`（2.0）

### Requirement: 标题层级字号

GIVEN 用户在酒红主题下查看博客详情页
WHEN 页面渲染 h1/h2 标题
THEN 字号应为 `--font-size-2xl`（30px）

GIVEN 用户在素雅主题下查看博客详情页
WHEN 页面渲染 h1/h2 标题
THEN 字号应为 `--font-size-2xl`（27px）

### Requirement: 文字色彩对比度

GIVEN 用户在任意主题（酒红/素雅 × light/dark）组合下查看博客详情页
WHEN 页面渲染正文文字
THEN `--text-primary` 与背景的对比度应 ≥ 4.5:1

GIVEN 用户在任意主题组合下查看博客详情页
WHEN 页面渲染辅助文字（元信息、引用、注释）
THEN `--text-secondary` 与背景的对比度应 ≥ 3:1

### Requirement: 代码块可读性

GIVEN 用户在任意主题组合下查看博客详情页
WHEN 页面渲染代码块
THEN 代码块背景与代码字色的对比度应 ≥ 4.5:1

### Requirement: 素雅 Dark 模式完整性

GIVEN 用户在素雅主题、dark 模式下查看博客详情页
WHEN 页面渲染
THEN 所有 `--normal-*` 和 `--background-*` 变量应有素雅 dark 的专属值
AND 不应继承酒红 dark 的颜色值

### `tasks.md`
# 实施任务

## Phase 1: CSS 变量基础设施

- [x] **Task 1.1: cssVariableProvider.tsx — 新增行高 token 渲染**
  - 涉及文件: `packages/components/themes/cssVariableProvider.tsx`
  - 在 `:root` 中新增 `--line-height-body` 和 `--line-height-heading` 的渲染逻辑
  - 实际耗时: 5min

- [x] **Task 1.2: cssVariableProvider.tsx — plain 主题覆写字号/行高**
  - 涉及文件: `packages/components/themes/cssVariableProvider.tsx`
  - 在 `:root[data-theme='plain']` 中覆写 `--font-size-*`、`--line-height-*`
  - 实际耗时: 5min

- [x] **Task 1.3: cssVariableProvider.tsx — 补全 plain dark 变量**
  - 涉及文件: `packages/components/themes/cssVariableProvider.tsx`
  - 在 `@media (prefers-color-scheme: dark)` 的 `:root[data-theme='plain']` 中补全缺失的 `--normal-*`、`--background-*` 和 `--primary-*` 变量
  - 实际耗时: 10min

## Phase 2: MarkdownBody 排版改造

- [x] **Task 2.1: MarkdownBody 标题改用 CSS 变量**
  - 涉及文件: `packages/wuh.site.next/app/post/styles/index.ts`
  - h1-h6 字号从 em 硬编码改为 `var(--font-size-*)` 引用
  - p 行高改为 `var(--line-height-body)`
  - 实际耗时: 5min

### Phase 3: 逐组合调色

- [x] **Task 3.1: 调色 — 酒红 light**
  - `--text-muted`: light['600'] → light['700']
  - 实际耗时: 2min

- [x] **Task 3.2: 调色 — 酒红 dark**
  - `--text-secondary`: dark['700'] → dark['600']
  - `--text-muted`: dark['800'] → dark['700']
  - 实际耗时: 2min

- [x] **Task 3.3: 调色 — 素雅 light**
  - 已在 Phase 1.2 中同步调整
  - 实际耗时: 0min（合并在 Phase 1）

- [x] **Task 3.4: 调色 — 素雅 dark**
  - 已在 Phase 1.3 中同步调整，补全完整色阶
  - 实际耗时: 0min（合并在 Phase 1）

总实际: 30min | 总预计: 140min
