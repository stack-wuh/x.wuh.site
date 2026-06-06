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
