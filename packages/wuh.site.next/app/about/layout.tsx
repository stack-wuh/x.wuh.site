import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const SITE_URL = 'https://wuh.site'

export const metadata: Metadata = {
  title: '关于',
  description: '吴尒红（Shadow）的创作档案，以数据记录思考、作品与知识系统',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: '关于',
    description: '吴尒红（Shadow）的创作档案，以数据记录思考与作品',
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
