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
