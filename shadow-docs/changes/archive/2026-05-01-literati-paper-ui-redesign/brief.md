# Proposal: 文青纸张风 UI 重新设计

> 原始变更名：`2026-05-01-literati-paper-ui-redesign`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
当前首页暖红/金色调卡片网格布局缺乏个性，与博客 introspect、文青气质的写作风格不匹配。同时 GitHub API 不再返回 `body_html` 字段，导致博客详情页内容空白无法正常展示。

## 引用规范
- `specs/content-rendering/spec.md`
- `specs/design-system/spec.md`

## 决策
# Design: 文青纸张风 UI 重新设计

## 架构决策

### 色彩体系

废除金色 (#E3B567)，改用暖赭色 (#C89060) 作为 accent。

| 层级 | Light | Dark |
|------|-------|------|
| primary | #FBF4EE~#4A2C18 (9 阶) | 自动生成自暖深底色 |
| background | #FFFDF9~#F2EDE4 (9 阶) | 自动生成自 #1a1512 |
| normal | #2A2218~#F5F1EA (9 阶) | 暖灰阶 |
| accent | #C89060 | #D4A478 |

### 字体策略

- `--font-serif`: Georgia, Songti SC, serif — 标题/引言用
- 正文保持无衬线 (Geist Sans)
- 不引入外部字体，零网络开销

### 首页布局

```
Hero (小logo + 衬线标题 + tagline)
  ↓
Motto (衬线 blockquote + 装饰下划线)
  ↓
CTA (小按钮 + 社交链接)
  ↓
OrnamentDivider (SVG ◆ 装饰分隔线)
  ↓
精选博客 (时间线 + 按年分组 + InkDot)
  ↓
OrnamentDivider
  ↓
开源项目 (紧凑文字链接)
```

### 博客时间线组件

YearGroup + PostRow 可复用，首页和 `/blog` 共享同一模式。PostRow 使用 `next/link`，hover 时左侧 padding 微增 + accent 低透明度背景。

### Tag 纸风格

标签文字始终使用 `var(--text-primary)`，GtiHub 标签颜色仅用于左侧 2.5px 色条装饰和背景透明度混合。

### Markdown 渲染策略

GitHub API 不再返回 `body_html`。前端 PostView 使用 `marked` 库：
- `body_html` 有值 → 直接用
- `body_html` 为空 → `marked.parse(body)` 渲染 markdown
- `buildTocAndHtml` 统一处理 HTML 提取目录

### 同步脚本

`sync-init.mjs` 独立于 NestJS，直接连接 Mongoose + Octokit：
- 绕过 `ts-node` + NestJS 导致的段错误 (exit 139)
- `pnpm sync:init` → `node scripts/sync-init.mjs`

## 关键文件

| 文件 | 角色 |
|------|------|
| `packages/components/themes/generator-color.ts` | 色阶生成器 |
| `packages/components/themes/cssVariableProvider.tsx` | CSS 变量注入 |
| `packages/components/themes/index.ts` | 字号/间距令牌 |
| `packages/wuh.site.next/app/HomeView.tsx` | 首页布局 |
| `packages/wuh.site.next/app/blog/BlogListView.tsx` | 博客列表 |
| `packages/wuh.site.next/app/post/PostView.tsx` | 文章详情 + marked 渲染 |
| `packages/wuh.site.nest/scripts/sync-init.mjs` | 独立同步脚本 |

## 任务
### Phase 1: 设计令牌改造
- [x] **Task 1.1** 重写色阶生成器
- [x] **Task 1.2** 更新 CSS 变量注入
- [x] **Task 1.3** 微调设计令牌
### Phase 2: 首页重构
- [x] **Task 2.1** 完全重写 HomeView
- [x] **Task 2.2** 装饰分隔线 (OrnamentDivider)
### Phase 3: 辅助组件
- [x] **Task 3.1** 博客列表重构
- [x] **Task 3.2** Tag 纸风格
- [x] **Task 3.3** Button 微调
- [x] **Task 3.4** Skeleton 适配暖色系
- [x] **Task 3.5** Loading 骨架屏重设计
- [x] **Task 4.1** 前端 marked 解析 markdown
- [x] **Task 4.2** 独立同步脚本

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
schema: spec-driven
created: 2026-05-01
```

### `design.md`
# Design: 文青纸张风 UI 重新设计

## 架构决策

### 色彩体系

废除金色 (#E3B567)，改用暖赭色 (#C89060) 作为 accent。

| 层级 | Light | Dark |
|------|-------|------|
| primary | #FBF4EE~#4A2C18 (9 阶) | 自动生成自暖深底色 |
| background | #FFFDF9~#F2EDE4 (9 阶) | 自动生成自 #1a1512 |
| normal | #2A2218~#F5F1EA (9 阶) | 暖灰阶 |
| accent | #C89060 | #D4A478 |

### 字体策略

- `--font-serif`: Georgia, Songti SC, serif — 标题/引言用
- 正文保持无衬线 (Geist Sans)
- 不引入外部字体，零网络开销

### 首页布局

```
Hero (小logo + 衬线标题 + tagline)
  ↓
Motto (衬线 blockquote + 装饰下划线)
  ↓
CTA (小按钮 + 社交链接)
  ↓
OrnamentDivider (SVG ◆ 装饰分隔线)
  ↓
精选博客 (时间线 + 按年分组 + InkDot)
  ↓
OrnamentDivider
  ↓
开源项目 (紧凑文字链接)
```

### 博客时间线组件

YearGroup + PostRow 可复用，首页和 `/blog` 共享同一模式。PostRow 使用 `next/link`，hover 时左侧 padding 微增 + accent 低透明度背景。

### Tag 纸风格

标签文字始终使用 `var(--text-primary)`，GtiHub 标签颜色仅用于左侧 2.5px 色条装饰和背景透明度混合。

### Markdown 渲染策略

GitHub API 不再返回 `body_html`。前端 PostView 使用 `marked` 库：
- `body_html` 有值 → 直接用
- `body_html` 为空 → `marked.parse(body)` 渲染 markdown
- `buildTocAndHtml` 统一处理 HTML 提取目录

### 同步脚本

`sync-init.mjs` 独立于 NestJS，直接连接 Mongoose + Octokit：
- 绕过 `ts-node` + NestJS 导致的段错误 (exit 139)
- `pnpm sync:init` → `node scripts/sync-init.mjs`

## 关键文件

| 文件 | 角色 |
|------|------|
| `packages/components/themes/generator-color.ts` | 色阶生成器 |
| `packages/components/themes/cssVariableProvider.tsx` | CSS 变量注入 |
| `packages/components/themes/index.ts` | 字号/间距令牌 |
| `packages/wuh.site.next/app/HomeView.tsx` | 首页布局 |
| `packages/wuh.site.next/app/blog/BlogListView.tsx` | 博客列表 |
| `packages/wuh.site.next/app/post/PostView.tsx` | 文章详情 + marked 渲染 |
| `packages/wuh.site.nest/scripts/sync-init.mjs` | 独立同步脚本 |

### `proposal.md`
# Proposal: 文青纸张风 UI 重新设计

## 动机

当前首页暖红/金色调卡片网格布局缺乏个性，与博客 introspect、文青气质的写作风格不匹配。同时 GitHub API 不再返回 `body_html` 字段，导致博客详情页内容空白无法正常展示。

## 变更范围

### Phase 1: 设计令牌改造 (packages/components/themes)
1. 重写 `generator-color.ts` 暖纸色系（象牙白纸张 + 深棕墨水 + 陶土赭石点缀）
2. 更新 `cssVariableProvider.tsx` 4 个主题分支（light/dark + root/plain）
3. 微调 `index.ts` 字号/间距/圆角

### Phase 2: 首页重构 (packages/wuh.site.next/app)
4. `HomeView.tsx` 完全重写：小 Hero + 格言区 + CTA + 社交链接 + 时间线博客 + 紧凑项目列表
5. 装饰分隔线 (OrnamentDivider) 分隔 Section

### Phase 3: 辅助组件 (packages/components + app)
6. `BlogListView.tsx` 卡片网格 → 单列书卷时间线
7. `Tag/index.tsx` 纸风格标签（左侧色条 + 小圆角）
8. `Button/tokens.ts` + `index.tsx` 圆角微调 + ink-wash ripple
9. `Skeleton/index.tsx` 闪烁渐变适配暖色系
10. `blog/loading.tsx` + `post/[number]/loading.tsx` 骨架屏重设计

### 修复: 详情页空白
11. 前端 `PostView.tsx` 新增 `marked` 解析 markdown body
12. 新增独立 `sync-init.mjs` 同步脚本（绕过 NestJS ts-node 段错误）

## 非目标

- 不更换外部字体（使用系统衬线字体栈）
- 不改变双主题切换机制
- 不动后端 NestJS 接口

### `specs/content-rendering/spec.md`
# Content Rendering

## ADDED

### Requirement: 前端 markdown 回退渲染
当 blog bodyHtml 缺失时，前端使用 marked 库渲染 markdown body。

- **GIVEN** API 返回文章数据，bodyHtml 为空
- **WHEN** PostView 组件渲染文章内容
- **THEN** 使用 `marked.parse(body)` 生成 HTML，再提取目录并渲染

### Requirement: PostView renderedHtml memo
PostView 新增 renderedHtml memo 统一处理 HTML 内容源。

- **GIVEN** issue 数据包含 body 和 body_html 字段
- **WHEN** PostView 挂载
- **THEN** renderedHtml = body_html ? body_html : body ? marked.parse(body) : ''

### Requirement: 独立数据同步脚本
同步脚本从数据库同步与 issue 同步，绕过 NestJS 启动。

- **GIVEN** `pnpm sync:init` 执行
- **WHEN** node 运行 scripts/sync-init.mjs
- **THEN** 直接连接 Mongoose + Octokit，从 GitHub Issues 同步数据到 MongoDB

## MODIFIED

### Requirement: 博客详情页面内容展示
详情页正确渲染博客内容，无论是 HTML 还是 markdown 格式。

- **GIVEN** 用户访问 /post/[number]
- **WHEN** 页面加载文章数据
- **THEN** 无论 bodyHtml 是否存在，内容均可正常渲染显示

### `specs/design-system/spec.md`
# Design System

## MODIFIED

### Requirement: 暖纸色系替代金色系
设计令牌颜色体系从暖红/金色调切换为纸张/墨水/陶土色系。

- **GIVEN** 站点加载 CSS 变量
- **WHEN** 用户访问任意页面
- **THEN** primary 色阶为暖赭色 (#C89060)，background 为象牙白纸色 (#FFFDF9)，accent 为 #C89060

### Requirement: 衬线字体变量
CSS 变量 --font-serif 指向系统衬线字体栈。

- **GIVEN** CSS 变量可用
- **WHEN** 标题/引言/格言区渲染
- **THEN** 使用 Georgia / Songti SC / STSong / serif 字体栈，font-weight: 500

### Requirement: 主题色阶重写
generator-color.ts 输出暖纸色阶替代原暖金阶。

- **GIVEN** generator-color 生成色阶
- **WHEN** primary/background/normal 三色阶被请求
- **THEN** Light: 象牙底+深棕墨+陶土点缀；Dark: 深灰底+暖白文+暖赭点缀

### Requirement: 设计令牌微调
字号/间距/圆角微调以匹配纸张风格。

- **GIVEN** ThemeProvider 注入令牌
- **WHEN** 组件使用 fontSize/spaces/borderRadius tokens
- **THEN** base: 15px, md: 28px, lg: 36px, borderRadius.base: 8px

## REMOVED

### Requirement: 金色 accent
废除 #E3B567 金色 accent 色。

- **GIVEN** CSS 变量注入
- **WHEN** 新主题加载
- **THEN** --accent-color 不再为金色，替换为暖赭色 #C89060

### `tasks.md`
# Tasks: 文青纸张风 UI 重新设计

## Phase 1: 设计令牌改造

- [x] **Task 1.1** 重写色阶生成器
  - 文件: `packages/components/themes/generator-color.ts`
  - 暖赭色 primary (#C89060)，象牙白背景，深棕墨水 normal 色阶

- [x] **Task 1.2** 更新 CSS 变量注入
  - 文件: `packages/components/themes/cssVariableProvider.tsx`
  - 4 个主题分支: `:root`, `:root[data-theme='plain']`, `dark :root`, `dark plain`
  - 新增 `--font-serif`，替换 `--accent-color`

- [x] **Task 1.3** 微调设计令牌
  - 文件: `packages/components/themes/index.ts`
  - fontSizes: base 16→15px, spaces: md 24→28px, borderRadius: base 12→8px

## Phase 2: 首页重构

- [x] **Task 2.1** 完全重写 HomeView
  - 文件: `packages/wuh.site.next/app/HomeView.tsx`
  - 小 Hero (logo + 衬线标题) → Motto → CTA → 社交链接 → OrnamentDivider → 时间线博客 → 项目列表

- [x] **Task 2.2** 装饰分隔线 (OrnamentDivider)
  - SVG diamond 分隔线，Section 之间使用
  - 修复 TDZ ReferenceError 导致 PostRow 不可点击

## Phase 3: 辅助组件

- [x] **Task 3.1** 博客列表重构
  - 文件: `packages/wuh.site.next/app/blog/BlogListView.tsx`
  - 卡片网格 → 720px 单列时间线，YearGroup + PostRow + InkDot

- [x] **Task 3.2** Tag 纸风格
  - 文件: `packages/components/tag/index.tsx`
  - 左侧 2.5px 色条 + 小圆角 + text-primary 文字 + color-mix 背景

- [x] **Task 3.3** Button 微调
  - 文件: `packages/components/button/tokens.ts`, `index.tsx`
  - 圆角 8px→6px，ripple 改为 ink-wash 风格

- [x] **Task 3.4** Skeleton 适配暖色系
  - 文件: `packages/components/skeleton/index.tsx`
  - shimmer 渐变 midpoint `--background-200`→`--normal-300`

- [x] **Task 3.5** Loading 骨架屏重设计
  - 文件: `packages/wuh.site.next/app/blog/loading.tsx`, `app/post/[number]/loading.tsx`
  - 宽度 1200→720px，卡片网格→时间线骨架

## 修复: 详情页空白

- [x] **Task 4.1** 前端 marked 解析 markdown
  - 文件: `packages/wuh.site.next/app/post/PostView.tsx`
  - renderedHtml memo: body_html 优先，fallback marked.parse(body)
  - 依赖: `pnpm add marked --filter @wuh.site/next`

- [x] **Task 4.2** 独立同步脚本
  - 文件: `packages/wuh.site.nest/scripts/sync-init.mjs`
  - 绕过 ts-node + NestJS 段错误，直接 mongoose + octokit
  - 更新 `package.json`: `sync:init` → `node scripts/sync-init.mjs`

## 总结

- 改动文件: 16 个
- Bug 修复: Tag 可读性、Motto 换行、Skeleton 不可见、OrnamentDivider TDZ 崩溃、bodyHtml 缺失
