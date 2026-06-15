# 首屏加载优化设计

- **日期**: 2026-06-15
- **项目**: x.wuh.site
- **类型**: 需求 (P)

## 1. 问题分析

首页（`app/page.tsx` → `HomeView.tsx`）首屏加载了以下非必要资源：

**全局层 (`AppProviders` → `layout.tsx`)**:
- JetBrains Mono 字体：已在 root layout 加载，但首页无任何元素引用
- `Dialog` + `ContactCard` + CONTACT_CONFIG（7 个联系方式，~100 行配置）：点击联系按钮才需要，但总是同步渲染

**首页层 (`HomeView.tsx`)**:
- 微信读书 BookCover 使用 CSS `background: url()`，绕过了 `@wuh.site/components/image`（内置懒加载、WebP 转换、骨架屏）
- 首屏以下 3 个 section（年度总结、微信读书、精选项目）同步渲染，其中微信读书 section 含客户端交互

## 2. 设计决策

- **优先消除可见的浪费**：字体只加载用到的，图片用已有基础设施，弹窗按需加载
- **不改基础设施**：不引入新的懒加载库，用 `next/dynamic` + 已有的 `@wuh.site/components/image`
- **不拆 SSR 内容**：年度总结、精选项目纯文本无客户端 JS，保持 SSR

## 3. 优化项

### 3.1 JetBrains Mono 字体 — 移出全局 layout

**现状**：`layout.tsx` 加载 Inter + JetBrains_Mono + Noto_Serif_SC 三个字体，全部应用到 `<body>`。

**优化**：从 `layout.tsx` 移除 JetBrains Mono 的加载和 CSS variable。在用到代码块的页面（博客详情 `app/post/`）通过独立 layout 或页面内 `next/font/google` 单独加载。

**影响**：首页、博客列表、关于、微信读书页不再加载 JetBrains Mono。

### 3.2 BookCover — CSS background → @wuh.site/components/image

**现状**：`app/styles/index.ts` 中 `BookCover` 为 `styled.div`，通过 `background: url($p.$src)` 渲染封面图。

**优化**：改为 `@wuh.site/components/image`，该组件默认 `loading="lazy"`，自带骨架屏、WebP 转换、错误兜底。

**影响**：微信读书封面在首页和 `/weread` 页面实现懒加载 + 优化。

### 3.3 Dialog + ContactCard — next/dynamic 懒加载

**现状**：`HomeView.tsx` 直接 import `Dialog`、`ContactCard`，并在组件内定义 7 个联系方式的 `CONTACT_CONFIG` 对象（~100 行）。无论用户是否点击，弹窗代码都打入首屏 bundle。

**优化**：
- `CONTACT_CONFIG` 移到独立文件（如 `app/components/ContactConfig.ts`）
- 在 `HomeView.tsx` 中用 `next/dynamic` 懒加载 `Dialog` + `ContactCard`
- 点击联系按钮时触发 import

**影响**：首屏不加载弹窗组件，点击时才下载对应 chunk。

### 3.4 微信读书 section — IntersectionObserver + next/dynamic

**现状**：微信读书 section 渲染 `BookCover` 组件（改用 `@wuh.site/components/image` 后有客户端逻辑），跟随首页一同 SSR 渲染。

**优化**：用 `next/dynamic` + `IntersectionObserver` 包裹，滚到可视区才加载渲染。

**影响**：首屏以下的内容不会抢占首屏 JS 解析和渲染资源。

### 3.5 年度总结 / 精选项目 section — 保持不动

纯文本列表，无客户端组件，SSR 渲染成本极低，不值得加懒加载复杂度。

## 4. 不改范围

- iconfont（alicdn 外部 CSS）：暂不处理
- 年度总结 section：纯 SSR，不动
- 精选项目 section：纯 SSR，不动
- 全局 `AudioPlayerProvider` / `useExternal` / 分析脚本：不在本次范围
