import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter, Noto_Serif_SC } from 'next/font/google'
import AppProviders from './components/AppProviders'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var scheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.colorScheme = scheme;
  try {
    var stored = window.localStorage.getItem('wuh.site.theme');
    if (stored === 'wine' || stored === 'plain') {
      document.documentElement.dataset.themeFamily = stored;
    }
  } catch (_) {}
  document.documentElement.dataset.noTransition = 'true';
})();
          `.trim(),
          }}
        />
      </head>
      <body className={`${inter.variable} ${notoSerifSC.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
