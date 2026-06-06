'use client'

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  return <NextGoogleAnalytics gaId={gaId} />
}
