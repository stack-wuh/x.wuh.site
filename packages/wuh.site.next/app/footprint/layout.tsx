import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const SITE_URL = 'https://wuh.site'

export const metadata: Metadata = {
  title: '足迹 · wuh.site',
  description: '深圳周边的旅游足迹记录，探索路线与风景',
  alternates: { canonical: `${SITE_URL}/footprint` },
  openGraph: {
    title: '足迹 · wuh.site',
    description: '深圳周边的旅游足迹记录',
    url: `${SITE_URL}/footprint`,
    siteName: 'wuh.site',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '足迹 · wuh.site',
    description: '深圳周边的旅游足迹记录',
  },
}

export default function FootprintLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
