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
