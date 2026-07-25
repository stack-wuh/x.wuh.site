import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const SITE_URL = 'https://wuh.site'

export const metadata: Metadata = {
  title: '关于',
  description: '数据驱动的作者日记，以 GitHub 热力图为灵感，汇聚创作故事',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: '关于',
    description: '数据驱动的作者日记，以 GitHub 热力图为灵感',
    url: `${SITE_URL}/about`,
    siteName: 'wuh.site',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '关于',
    description: '数据驱动的作者日记',
  },
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
