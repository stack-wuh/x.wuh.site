import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { SITE_URL } from '@wuh.site/core'
import { buildSectionMetadata } from '../lib/seo'

export const metadata: Metadata = {
  title: '足迹',
  description: '吴尒红（Shadow）记录的深圳周边旅游足迹、探索路线与沿途风景',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/footprint` },
  ...buildSectionMetadata({
    title: '足迹',
    description: '吴尒红（Shadow）记录的深圳周边旅游足迹与沿途风景',
    url: `${SITE_URL}/footprint`,
  }),
}

export default function FootprintLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
