import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const SITE_URL = 'https://wuh.site'

export const metadata: Metadata = {
  title: '足迹',
  description: '吴尒红（Shadow）记录的深圳周边旅游足迹、探索路线与沿途风景',
  alternates: { canonical: `${SITE_URL}/footprint` },
  openGraph: {
    title: '足迹',
    description: '吴尒红（Shadow）记录的深圳周边旅游足迹与沿途风景',
    url: `${SITE_URL}/footprint`,
    siteName: 'wuh.site',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '足迹',
    description: '吴尒红（Shadow）记录的深圳周边旅游足迹与沿途风景',
  },
}

export default function FootprintLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
