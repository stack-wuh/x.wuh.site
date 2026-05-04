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
