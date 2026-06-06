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
