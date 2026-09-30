import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { SITE_URL } from '@wuh.site/core'

export const metadata: Metadata = {
  title: '关于',
  description: '吴尒红（Shadow）的创作档案，以数据记录思考、作品与知识系统',
  alternates: { canonical: `${SITE_URL}/about` },
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
