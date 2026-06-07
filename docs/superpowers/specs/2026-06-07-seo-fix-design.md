# SEO Fix: Google 搜索无法索引博客文章

## 问题诊断

网站 `wuh.site` 的基础 SEO 设施（动态 sitemap、generateMetadata、ISR、JsonLd）已具备，但 Google 无法搜到博客文章。定位到 3 个根因：

1. **HTML lang 不匹配**: `layout.tsx` 中 `<html lang='en'>`，但网站内容为中文，影响 Google 语言判断
2. **根 layout 缺 metadata**: `layout.tsx` 有 `'use client'` 指令，导致无法导出 `metadataBase`、`robots` 等基础 meta
3. **Sitemap 静默失败**: API 调用失败时只返回 4 条静态路由，博客 URL 全丢，且无日志

## 修复方案（Plan A）

### 1. `app/layout.tsx` — 语言修正 + 分离 Server/Client

- `lang='en'` → `lang='zh-CN'`
- 移除根 layout 的 `'use client'`，导出 `metadata`（metadataBase、robots）
- 客户端逻辑（useEventListener、useExternal 等）抽到独立 `<AppProviders>` 客户端组件

### 2. `app/sitemap.ts` — 暴露失败

- catch 分支加 `console.error`，便于排查 API 是否不可达

### 3. `app/page.tsx`、`app/blog/page.tsx` — 补充 robots 声明

- metadata 增加 `robots: { index: true, follow: true }`

## 改动范围

- `app/layout.tsx`: 拆分为 Server Component + 内嵌 Client Component
- `app/sitemap.ts`: 1 行 console.error
- `app/page.tsx`: metadata 加 robots
- `app/blog/page.tsx`: metadata 加 robots

不动业务逻辑，不改组件行为。
