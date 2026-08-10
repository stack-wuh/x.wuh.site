# Google Analytics 性能分析接入

> 原始变更名：`20250606_P_ga_performance`

## 元数据
- 日期：2025-06-06
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
```
packages/components/analytics/
  ├── GoogleAnalytics.tsx   # 封装 @next/third-parties/google
  └── WebVitals.tsx         # 通过 useReportWebVitals 上报 Core Web Vitals

app/layout.tsx              # 引入上述两个组件
```

使用 `@next/third-parties/google` 官方包提供 `GoogleAnalytics` 组件，搭配 Next.js 内置 `useReportWebVitals` hook 自定义 `WebVitals` 组件。

## 任务
### Phase 1：历史任务
- [ ] **Step 1: Add dependency**
- [ ] **Step 2: Verify install**
- [ ] **Step 3: Commit**
- [ ] **Step 1: Create component**
- [ ] **Step 2: Verify compilation**
- [ ] **Step 3: Commit**
- [ ] **Step 1: Create component**
- [ ] **Step 2: Verify compilation**
- [ ] **Step 3: Commit**
- [ ] **Step 1: Add imports and render components**
- [ ] **Step 2: Verify build**
- [ ] **Step 3: Commit**

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: ga-performance
date: 2025-06-06
type: P
status: applied
```

### `design.md`
# 设计文档

## 方案

使用 `@next/third-parties/google` 官方包提供 `GoogleAnalytics` 组件，搭配 Next.js 内置 `useReportWebVitals` hook 自定义 `WebVitals` 组件。

## 架构

```
packages/components/analytics/
  ├── GoogleAnalytics.tsx   # 封装 @next/third-parties/google
  └── WebVitals.tsx         # 通过 useReportWebVitals 上报 Core Web Vitals

app/layout.tsx              # 引入上述两个组件
```

## 组件设计

### GoogleAnalytics

```tsx
'use client'
import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'

interface Props { gaId: string }

export function GoogleAnalytics({ gaId }: Props) {
  return <NextGoogleAnalytics gaId={gaId} />
}
```

**职责**：注入 gtag.js，自动追踪每次路由变更的 pageview。

### WebVitals

```tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'

interface Props { gaId: string }

export function WebVitals({ gaId }: Props) {
  useReportWebVitals((metric) => {
    ;(window as any).gtag?.('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      metric_name: metric.name,
    })
  })
  return null
}
```

**职责**：无 UI，挂载时注册 Web Vitals 回调，将 LCP/INP/CLS/TTFB/FCP 作为 `web_vitals` 自定义事件发送到 GA4。

## 数据流

```
浏览器:
  pageview: gtag.js → GA4 (自动, GoogleAnalytics 组件处理)
  web_vitals: useReportWebVitals → gtag('event') → GA4 (手动, WebVitals 组件处理)
```

## 依赖

- 新增 `@next/third-parties/google` 到 `packages/components`

## 环境变量

不需要环境变量，gaId 硬编码在 layout.tsx 中（所有环境启用，无需区分）。

### `proposal.md`
# Google Analytics 性能分析接入

## 概述

为 x.wuh.site 博客接入 Google Analytics 4 (GA4)，同时覆盖用户行为分析（页面浏览）和性能监控（Core Web Vitals）。

## 需求

- 接入 GA4 页面浏览追踪（自动追踪每次路由变更的 pageview）
- 接入 Web Vitals 性能指标监控（LCP, INP, CLS, TTFB, FCP）
- 所有环境启用，不做 cookie consent
- Measurement ID: G-X4ZVBQXW9E
- 组件统一放在 `packages/components` 目录下

### `tasks.md`
# Google Analytics 性能分析接入 — 实施计划

> **Goal:** 接入 GA4 页面浏览追踪和 Web Vitals 性能监控

**Architecture:** 在 `packages/components/analytics/` 下新增 `GoogleAnalytics` 和 `WebVitals` 两个组件，在 `app/layout.tsx` 中引入

**Tech Stack:** Next.js 15 App Router, `@next/third-parties/google`, `useReportWebVitals`

---

### Task 1: 安装 @next/third-parties/google

**Files:**
- Modify: `packages/components/package.json`

- [ ] **Step 1: Add dependency**

```bash
pnpm --filter @wuh.site/components add @next/third-parties/google
```

- [ ] **Step 2: Verify install**

```bash
ls packages/components/node_modules/@next/third-parties/google
```
Expected: directory exists

- [ ] **Step 3: Commit**

```bash
git add packages/components/package.json packages/components/node_modules pnpm-lock.yaml
git commit -m "feat(components): add @next/third-parties/google dependency"
```

---

### Task 2: Create GoogleAnalytics component

**Files:**
- Create: `packages/components/analytics/GoogleAnalytics.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client'

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  return <NextGoogleAnalytics gaId={gaId} />
}
```

- [ ] **Step 2: Verify compilation**

```bash
pnpm exec tsc --noEmit
```
Expected: no TS errors

- [ ] **Step 3: Commit**

```bash
git add packages/components/analytics/GoogleAnalytics.tsx
git commit -m "feat(components): add GoogleAnalytics wrapper component"
```

---

### Task 3: Create WebVitals component

**Files:**
- Create: `packages/components/analytics/WebVitals.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals({ gaId }: { gaId: string }) {
  useReportWebVitals((metric) => {
    ;(window as any).gtag?.('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      metric_name: metric.name,
    })
  })
  return null
}
```

- [ ] **Step 2: Verify compilation**

```bash
pnpm exec tsc --noEmit
```
Expected: no TS errors

- [ ] **Step 3: Commit**

```bash
git add packages/components/analytics/WebVitals.tsx
git commit -m "feat(components): add WebVitals tracking component"
```

---

### Task 4: Wire components into layout

**Files:**
- Modify: `packages/wuh.site.next/app/layout.tsx`

- [ ] **Step 1: Add imports and render components**

Add import lines after existing imports (after `import { ProgressProvider } from '@bprogress/next/app'`):

```tsx
import { GoogleAnalytics } from '@wuh.site/components/analytics/GoogleAnalytics'
import { WebVitals } from '@wuh.site/components/analytics/WebVitals'
```

Add component rendering after `<body>` open tag:

```tsx
<body>
  <GoogleAnalytics gaId="G-X4ZVBQXW9E" />
  <WebVitals gaId="G-X4ZVBQXW9E" />
  <ThemeModeProvider>
```

- [ ] **Step 2: Verify build**

```bash
pnpm build:next
```
Expected: build succeeds, no errors

- [ ] **Step 3: Commit**

```bash
git add packages/wuh.site.next/app/layout.tsx
git commit -m "feat: integrate GA4 analytics and Web Vitals tracking"
```
