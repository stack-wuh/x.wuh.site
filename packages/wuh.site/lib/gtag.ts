/**
 * 引入google gtag 静态分析
 * @url https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics
 */

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  ;(window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export type normalEventTypeProps = {
  action?: string
  category?: string
  label?: string
  value?: number
}
// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: normalEventTypeProps) => {
  ;(window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
