import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Noto_Serif_SC } from 'next/font/google'
import AppProviders from './components/AppProviders'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://wuh.site'),
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head />
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${notoSerifSC.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
