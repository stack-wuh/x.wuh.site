import type { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design Token 调试面板',
  description: 'wuh.site 内部设计 Token 调试页面。',
  robots: { index: false, follow: false },
}

export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  return children
}
